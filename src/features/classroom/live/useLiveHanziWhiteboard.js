/**
 * =========================================================================
 * HANZIGO — LIVEKIT HANZI WHITEBOARD SYNC HOOK (TASK 33.02)
 * =========================================================================
 * Protocol: HANZIGO_WB_PROTOCOL_V1
 * - Reliable Control Channel (reliable: true, topic: 'hanzigo-wb-control')
 * - High-Speed Ink Channel (reliable: false, topic: 'hanzigo-wb-ink', rAF + 25ms throttle)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RoomEvent } from 'livekit-client';

export const HANZIGO_WB_PROTOCOL_V1 = 'HANZIGO_WB_PROTOCOL_V1';
export const WB_CONTROL_TOPIC = 'hanzigo-wb-control';
export const WB_INK_TOPIC = 'hanzigo-wb-ink';
export const INK_THROTTLE_MS = 25;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function createInitialWhiteboardState() {
  return {
    activeCharacter: '整',
    pinyin: 'zhěng',
    meaningVi: 'chỉnh lý, sắp xếp',
    gridType: 'mizige',
    mode: 'animate',
    animationCommand: null,
    grantedStudentIdentity: null,
    grantedStudentName: null,
    freehandStrokes: [],
    spotlightCard: null,
    activePopQuiz: null,
    popQuizResponses: {},
    liveStrokeFeed: [],
  };
}

export function encodeWhiteboardPacket(payload) {
  return textEncoder.encode(
    JSON.stringify({
      protocol: HANZIGO_WB_PROTOCOL_V1,
      ts: Date.now(),
      ...payload,
    })
  );
}

export function decodeWhiteboardPacket(rawUint8Array) {
  try {
    const str = textDecoder.decode(rawUint8Array);
    const parsed = JSON.parse(str);
    if (!parsed || typeof parsed !== 'object' || !parsed.type) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clampNorm(val) {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(1, Number(num.toFixed(4))));
}

/**
 * Pure state reducer for HANZIGO_WB_PROTOCOL_V1 packets.
 */
export function reduceWhiteboardState(prev, packet) {
  if (!packet || !packet.type) return prev;

  switch (packet.type) {
    case 'WB_SET_CHARACTER':
      return {
        ...prev,
        activeCharacter: packet.character || prev.activeCharacter,
        pinyin: packet.pinyin ?? prev.pinyin,
        meaningVi: packet.meaning_vi ?? prev.meaningVi,
        gridType: packet.gridType === 'tianzige' ? 'tianzige' : 'mizige',
        mode: packet.mode === 'quiz' ? 'quiz' : 'animate',
        liveStrokeFeed: [],
      };

    case 'WB_ANIMATE_STROKE':
      return {
        ...prev,
        animationCommand: {
          character: packet.character || prev.activeCharacter,
          strokeIndex:
            typeof packet.strokeIndex === 'number' ? packet.strokeIndex : null,
          nonce: packet.ts || Date.now(),
        },
      };

    case 'WB_STROKE_RESULT': {
      const entry = {
        userId: packet.userId || 'unknown',
        userName: packet.userName || 'Học viên',
        strokeNum: Number(packet.strokeNum || 0),
        isCorrect: Boolean(packet.isCorrect),
        totalMistakes: Number(packet.totalMistakes || 0),
        ts: packet.ts || Date.now(),
      };
      return {
        ...prev,
        liveStrokeFeed: [entry, ...prev.liveStrokeFeed].slice(0, 20),
      };
    }

    case 'WB_GRANT_STUDENT_PEN':
      return {
        ...prev,
        grantedStudentIdentity: packet.grantedIdentity || null,
        grantedStudentName: packet.grantedIdentity ? packet.studentName || 'Học viên' : null,
      };

    case 'WB_SPOTLIGHT_CARD':
      return {
        ...prev,
        spotlightCard: packet.payload
          ? {
              cardType: packet.cardType || 'vocab',
              payload: packet.payload,
              ts: packet.ts || Date.now(),
            }
          : null,
      };

    case 'WB_POP_QUIZ_START':
      return {
        ...prev,
        activePopQuiz: packet.quiz
          ? {
              ...packet.quiz,
              startedAt: packet.ts || Date.now(),
            }
          : null,
        popQuizResponses: {},
      };

    case 'WB_POP_QUIZ_ANSWER':
      if (!packet.userId) return prev;
      return {
        ...prev,
        popQuizResponses: {
          ...prev.popQuizResponses,
          [packet.userId]: {
            userId: packet.userId,
            userName: packet.userName || 'Học viên',
            selectedOption: packet.selectedOption,
            isCorrect: Boolean(packet.isCorrect),
            answeredAt: packet.ts || Date.now(),
          },
        },
      };

    case 'WB_FREEHAND_POINTS': {
      const incoming = Array.isArray(packet.points) ? packet.points : [];
      if (incoming.length === 0) return prev;
      const strokeId = packet.strokeId || 'default-stroke';
      const color = packet.color || '#00D4FF';
      const normalizedPts = incoming.map(([x, y]) => [clampNorm(x), clampNorm(y)]);

      const existingIdx = prev.freehandStrokes.findIndex((s) => s.id === strokeId);
      if (existingIdx >= 0) {
        const nextStrokes = [...prev.freehandStrokes];
        nextStrokes[existingIdx] = {
          ...nextStrokes[existingIdx],
          points: [...nextStrokes[existingIdx].points, ...normalizedPts],
        };
        return { ...prev, freehandStrokes: nextStrokes };
      }

      return {
        ...prev,
        freehandStrokes: [
          ...prev.freehandStrokes.slice(-80),
          { id: strokeId, color, points: normalizedPts },
        ],
      };
    }

    case 'WB_CLEAR_INK':
      return {
        ...prev,
        freehandStrokes: [],
      };

    default:
      return prev;
  }
}

export function canParticipantDraw({ isTeacher = false, userIdentity = null, grantedStudentIdentity = null }) {
  if (isTeacher) return true;
  if (!userIdentity || !grantedStudentIdentity) return false;
  return String(userIdentity) === String(grantedStudentIdentity);
}

export function useLiveHanziWhiteboard(room, currentUser, isTeacher = false) {
  const [boardState, setBoardState] = useState(createInitialWhiteboardState);

  const pendingInkPointsRef = useRef([]);
  const activeStrokeMetaRef = useRef({ strokeId: null, color: '#00D4FF' });
  const rafIdRef = useRef(null);
  const lastFlushAtRef = useRef(0);

  const canDrawOnBoard = useMemo(
    () =>
      canParticipantDraw({
        isTeacher,
        userIdentity: currentUser?.id,
        grantedStudentIdentity: boardState.grantedStudentIdentity,
      }),
    [isTeacher, currentUser?.id, boardState.grantedStudentIdentity]
  );

  const publishPacket = useCallback(
    async (payload, { reliable = true, topic = WB_CONTROL_TOPIC } = {}) => {
      const enriched = {
        protocol: HANZIGO_WB_PROTOCOL_V1,
        ts: Date.now(),
        ...payload,
      };
      setBoardState((prev) => reduceWhiteboardState(prev, enriched));

      if (!room?.localParticipant || typeof room.localParticipant.publishData !== 'function') {
        return false;
      }

      try {
        await room.localParticipant.publishData(encodeWhiteboardPacket(enriched), {
          reliable,
          topic,
        });
        return true;
      } catch {
        return false;
      }
    },
    [room]
  );

  useEffect(() => {
    if (!room || typeof room.on !== 'function') return undefined;

    const handleDataReceived = (payload, _participant, _kind, topic) => {
      if (topic && topic !== WB_CONTROL_TOPIC && topic !== WB_INK_TOPIC) {
        return;
      }
      const packet = decodeWhiteboardPacket(payload);
      if (!packet) return;
      setBoardState((prev) => reduceWhiteboardState(prev, packet));
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      if (typeof room.off === 'function') {
        room.off(RoomEvent.DataReceived, handleDataReceived);
      }
    };
  }, [room]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const broadcastSetCharacter = useCallback(
    ({ character, pinyin = '', meaning_vi = '', gridType = 'mizige', mode = 'animate' }) =>
      publishPacket(
        {
          type: 'WB_SET_CHARACTER',
          character,
          pinyin,
          meaning_vi,
          gridType,
          mode,
        },
        { reliable: true, topic: WB_CONTROL_TOPIC }
      ),
    [publishPacket]
  );

  const broadcastAnimateCharacter = useCallback(
    ({ character, strokeIndex } = {}) =>
      publishPacket(
        {
          type: 'WB_ANIMATE_STROKE',
          character,
          ...(typeof strokeIndex === 'number' ? { strokeIndex } : {}),
        },
        { reliable: true, topic: WB_CONTROL_TOPIC }
      ),
    [publishPacket]
  );

  const broadcastStrokeResult = useCallback(
    ({ strokeNum, isCorrect, totalMistakes = 0 }) =>
      publishPacket(
        {
          type: 'WB_STROKE_RESULT',
          userId: currentUser?.id || 'guest',
          userName: currentUser?.name || currentUser?.email || 'Học viên',
          strokeNum,
          isCorrect,
          totalMistakes,
        },
        { reliable: true, topic: WB_CONTROL_TOPIC }
      ),
    [publishPacket, currentUser]
  );

  const flushInkQueue = useCallback(function runFlush() {
    rafIdRef.current = null;
    const now = Date.now();
    if (now - lastFlushAtRef.current < INK_THROTTLE_MS) {
      if (pendingInkPointsRef.current.length > 0 && typeof requestAnimationFrame === 'function') {
        rafIdRef.current = requestAnimationFrame(runFlush);
      }
      return;
    }

    if (pendingInkPointsRef.current.length === 0) return;
    const batch = pendingInkPointsRef.current.splice(0, pendingInkPointsRef.current.length);
    lastFlushAtRef.current = now;

    void publishPacket(
      {
        type: 'WB_FREEHAND_POINTS',
        strokeId: activeStrokeMetaRef.current.strokeId || `stroke-${now}`,
        color: activeStrokeMetaRef.current.color || '#00D4FF',
        points: batch,
      },
      { reliable: false, topic: WB_INK_TOPIC }
    );
  }, [publishPacket]);

  const broadcastStrokePoint = useCallback(
    (x, y, { strokeId = 'teacher-laser', color = '#00D4FF' } = {}) => {
      if (!canDrawOnBoard) return;
      activeStrokeMetaRef.current = { strokeId, color };
      pendingInkPointsRef.current.push([clampNorm(x), clampNorm(y)]);

      if (typeof requestAnimationFrame === 'function') {
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(flushInkQueue);
        }
      } else {
        flushInkQueue();
      }
    },
    [canDrawOnBoard, flushInkQueue]
  );

  const broadcastClearInk = useCallback(
    () =>
      publishPacket(
        { type: 'WB_CLEAR_INK' },
        { reliable: true, topic: WB_CONTROL_TOPIC }
      ),
    [publishPacket]
  );

  const grantPenToStudent = useCallback(
    (grantedIdentity = null, studentName = null) =>
      publishPacket(
        {
          type: 'WB_GRANT_STUDENT_PEN',
          grantedIdentity,
          studentName,
        },
        { reliable: true, topic: WB_CONTROL_TOPIC }
      ),
    [publishPacket]
  );

  const broadcastSpotlightCard = useCallback(
    (cardType, payload) =>
      publishPacket(
        {
          type: 'WB_SPOTLIGHT_CARD',
          cardType,
          payload,
        },
        { reliable: true, topic: WB_CONTROL_TOPIC }
      ),
    [publishPacket]
  );

  const launchPopQuiz = useCallback(
    (quiz) =>
      publishPacket(
        {
          type: 'WB_POP_QUIZ_START',
          quiz,
        },
        { reliable: true, topic: WB_CONTROL_TOPIC }
      ),
    [publishPacket]
  );

  const submitPopQuizAnswer = useCallback(
    ({ selectedOption, isCorrect = false }) =>
      publishPacket(
        {
          type: 'WB_POP_QUIZ_ANSWER',
          userId: currentUser?.id || 'guest',
          userName: currentUser?.name || currentUser?.email || 'Học viên',
          selectedOption,
          isCorrect,
        },
        { reliable: true, topic: WB_CONTROL_TOPIC }
      ),
    [publishPacket, currentUser]
  );

  return {
    boardState,
    canDrawOnBoard,
    broadcastSetCharacter,
    broadcastAnimateCharacter,
    broadcastStrokeResult,
    broadcastStrokePoint,
    broadcastClearInk,
    grantPenToStudent,
    broadcastSpotlightCard,
    launchPopQuiz,
    submitPopQuizAnswer,
  };
}
