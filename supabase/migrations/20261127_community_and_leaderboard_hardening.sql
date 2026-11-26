-- =========================================================================
-- HANZIGO: COMMUNITY MODERATION & ZERO-PII LEADERBOARD / HALL OF FAME
-- =========================================================================
-- 1. Bảo đảm profiles có cờ ẩn danh bảng vàng is_leaderboard_hidden
-- 2. Hàm sanitize_public_display_name(TEXT) che email/PII ngay trong PostgreSQL
-- 3. RPC get_public_leaderboard (Tuần/Tháng theo Asia/Ho_Chi_Minh, zero email)
-- 4. RPC get_hsk_hall_of_fame (chỉ tính exam_mode = 'simulation', đã chấm server)
-- 5. RPC moderate_community_post (Admin/Teacher Pin, Unpin, Hide kèm audit log)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_leaderboard_hidden BOOLEAN NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.sanitize_public_display_name(raw_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean TEXT;
  v_local TEXT;
BEGIN
  v_clean := btrim(regexp_replace(COALESCE(raw_name, ''), '[<>]+', '', 'g'));
  IF v_clean = '' THEN
    RETURN 'Học viên HanziGo';
  END IF;

  IF v_clean ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
    v_local := split_part(v_clean, '@', 1);
    IF length(v_local) <= 1 THEN
      RETURN v_local || '***';
    END IF;
    RETURN left(v_local, LEAST(3, length(v_local) - 1)) || '***';
  END IF;

  RETURN left(v_clean, 60);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_public_leaderboard(
  p_timeframe TEXT DEFAULT 'weekly',
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  rank INT,
  user_id UUID,
  display_name TEXT,
  avatar TEXT,
  hsk_level TEXT,
  xp BIGINT,
  streak INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_vn_now TIMESTAMP;
  v_period_start TIMESTAMPTZ;
  v_limit INT := LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100);
  v_tf TEXT := lower(COALESCE(p_timeframe, 'weekly'));
BEGIN
  v_vn_now := timezone('Asia/Ho_Chi_Minh', now());

  IF v_tf = 'monthly' THEN
    v_period_start := date_trunc('month', v_vn_now) AT TIME ZONE 'Asia/Ho_Chi_Minh';
  ELSIF v_tf = 'weekly' THEN
    v_period_start := date_trunc('week', v_vn_now) AT TIME ZONE 'Asia/Ho_Chi_Minh';
  ELSE
    v_period_start := NULL;
  END IF;

  IF v_period_start IS NOT NULL THEN
    RETURN QUERY
    WITH period_activity AS (
      SELECT
        a.user_id,
        SUM(GREATEST(10, COALESCE(a.score, 0) / 5))::BIGINT AS period_xp
      FROM public.hsk_attempts a
      WHERE a.user_id IS NOT NULL
        AND a.created_at >= v_period_start
      GROUP BY a.user_id
    ),
    ranked_rows AS (
      SELECT
        p.id AS user_id,
        public.sanitize_public_display_name(p.name) AS display_name,
        p.avatar,
        COALESCE(p.level, 'HSK 1') AS hsk_level,
        COALESCE(pa.period_xp, LEAST(COALESCE(p.xp, 0)::BIGINT, CASE WHEN v_tf = 'weekly' THEN 350 ELSE 900 END))::BIGINT AS xp,
        COALESCE(p.streak, 0)::INT AS streak
      FROM public.profiles p
      LEFT JOIN period_activity pa ON pa.user_id = p.id
      WHERE COALESCE(p.status, 'active') <> 'blocked'
        AND COALESCE(p.is_leaderboard_hidden, false) = false
        AND (COALESCE(pa.period_xp, 0) > 0 OR COALESCE(p.xp, 0) > 0)
    )
    SELECT
      ROW_NUMBER() OVER (ORDER BY r.xp DESC, r.streak DESC, r.user_id ASC)::INT AS rank,
      r.user_id,
      r.display_name,
      r.avatar,
      r.hsk_level,
      r.xp,
      r.streak
    FROM ranked_rows r
    ORDER BY r.xp DESC, r.streak DESC, r.user_id ASC
    LIMIT v_limit;
  ELSE
    RETURN QUERY
    SELECT
      ROW_NUMBER() OVER (ORDER BY COALESCE(p.xp, 0) DESC, COALESCE(p.streak, 0) DESC, p.id ASC)::INT AS rank,
      p.id AS user_id,
      public.sanitize_public_display_name(p.name) AS display_name,
      p.avatar,
      COALESCE(p.level, 'HSK 1') AS hsk_level,
      COALESCE(p.xp, 0)::BIGINT AS xp,
      COALESCE(p.streak, 0)::INT AS streak
    FROM public.profiles p
    WHERE COALESCE(p.status, 'active') <> 'blocked'
      AND COALESCE(p.is_leaderboard_hidden, false) = false
    ORDER BY COALESCE(p.xp, 0) DESC, COALESCE(p.streak, 0) DESC, p.id ASC
    LIMIT v_limit;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_leaderboard(TEXT, INT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_hsk_hall_of_fame(
  p_exam_system TEXT DEFAULT 'all',
  p_level TEXT DEFAULT 'all',
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  rank INT,
  attempt_id TEXT,
  user_id UUID,
  display_name TEXT,
  avatar TEXT,
  exam_id TEXT,
  exam_title TEXT,
  exam_level TEXT,
  exam_system TEXT,
  score INT,
  max_score INT,
  accuracy_percentage NUMERIC,
  passed BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_limit INT := LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100);
  v_sys TEXT := lower(COALESCE(p_exam_system, 'all'));
  v_lvl TEXT := upper(replace(COALESCE(p_level, 'all'), '–', '-'));
BEGIN
  RETURN QUERY
  WITH verified_attempts AS (
    SELECT
      a.id AS attempt_id,
      a.user_id,
      public.sanitize_public_display_name(p.name) AS display_name,
      p.avatar,
      a.exam_id,
      COALESCE(e.title, a.exam_id) AS exam_title,
      COALESCE(e.level, 'HSK 1') AS exam_level,
      CASE
        WHEN COALESCE(e.exam_version, '') ILIKE '%3.0%' OR a.exam_id ILIKE '%hsk30%' OR COALESCE(e.level, '') LIKE '%7%'
          THEN 'hsk_3_0'
        ELSE 'hsk_2_0'
      END AS exam_system,
      COALESCE(a.score, 0)::INT AS score,
      GREATEST(1, COALESCE(a.max_score, 200))::INT AS max_score,
      COALESCE(a.accuracy_percentage, 0)::NUMERIC AS accuracy_percentage,
      COALESCE(a.passed, false) AS passed,
      a.created_at
    FROM public.hsk_attempts a
    JOIN public.hsk_exams e ON e.id = a.exam_id
    JOIN public.profiles p ON p.id = a.user_id
    WHERE a.exam_mode = 'simulation'
      AND a.user_id IS NOT NULL
      AND COALESCE(p.status, 'active') <> 'blocked'
      AND COALESCE(p.is_leaderboard_hidden, false) = false
  ),
  filtered AS (
    SELECT *
    FROM verified_attempts va
    WHERE (v_sys = 'all' OR va.exam_system = v_sys)
      AND (v_lvl = 'ALL' OR upper(replace(va.exam_level, '–', '-')) = v_lvl)
  ),
  best_per_user AS (
    SELECT DISTINCT ON (f.user_id, f.exam_system, f.exam_level)
      f.*
    FROM filtered f
    ORDER BY
      f.user_id,
      f.exam_system,
      f.exam_level,
      (f.score::NUMERIC / f.max_score::NUMERIC) DESC,
      f.accuracy_percentage DESC,
      f.created_at ASC
  )
  SELECT
    ROW_NUMBER() OVER (
      ORDER BY (b.score::NUMERIC / b.max_score::NUMERIC) DESC, b.score DESC, b.accuracy_percentage DESC
    )::INT AS rank,
    b.attempt_id,
    b.user_id,
    b.display_name,
    b.avatar,
    b.exam_id,
    b.exam_title,
    b.exam_level,
    b.exam_system,
    b.score,
    b.max_score,
    b.accuracy_percentage,
    b.passed,
    b.created_at
  FROM best_per_user b
  ORDER BY (b.score::NUMERIC / b.max_score::NUMERIC) DESC, b.score DESC, b.accuracy_percentage DESC
  LIMIT v_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_hsk_hall_of_fame(TEXT, TEXT, INT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.moderate_community_post(
  p_post_id BIGINT,
  p_action TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_role TEXT;
  v_action TEXT := lower(COALESCE(p_action, ''));
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
  END IF;

  SELECT role INTO v_role FROM public.profiles WHERE id = v_uid;
  IF v_role NOT IN ('admin', 'teacher') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;

  IF v_action = 'pin' THEN
    UPDATE public.community_posts SET is_pinned = true, updated_at = now() WHERE id = p_post_id;
  ELSIF v_action = 'unpin' THEN
    UPDATE public.community_posts SET is_pinned = false, updated_at = now() WHERE id = p_post_id;
  ELSIF v_action = 'hide' THEN
    UPDATE public.community_posts SET status = 'hidden', updated_at = now() WHERE id = p_post_id;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Unsupported moderation action');
  END IF;

  INSERT INTO public.community_moderation_logs (admin_id, target_type, target_id, action, reason)
  VALUES (v_uid, 'post', p_post_id::TEXT, v_action, 'Community feed moderation');

  RETURN jsonb_build_object('success', true, 'post_id', p_post_id, 'action', v_action);
END;
$$;

GRANT EXECUTE ON FUNCTION public.moderate_community_post(BIGINT, TEXT) TO authenticated;
