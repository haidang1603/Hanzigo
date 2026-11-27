import clientErrorHandler from '../_handlers/telemetry/client-error.js';
import { sendSafeServerError } from '../_utils/supabaseServer.js';

export default async function handler(req, res) {
  try {
    const urlPath = req.url ? req.url.split('?')[0] : '';
    const pathAction = urlPath.split('/').filter(Boolean).pop();
    const action = req.query?.action || pathAction;

    if (action === 'client-error') {
      return await clientErrorHandler(req, res);
    }

    return res.status(404).json({
      error: `Telemetry endpoint không tồn tại: ${action || 'unknown'}`,
    });
  } catch (err) {
    console.error('[Telemetry Router Error]:', err);
    return sendSafeServerError(res, 'Lỗi máy chủ nội bộ.', err);
  }
}
