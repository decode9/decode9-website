import type { SignalErrorCode, SignalGateway, SignalResult } from '@/interfaces/signal';
import type { ApiClient } from './createApiClient';

interface SignalAnswer {
  ok?: boolean;
  code?: string;
  error?: string;
}

const KNOWN_ERRORS: readonly SignalErrorCode[] = ['alias', 'correo', 'whatsapp', 'regreso', 'espera', 'almacenamiento'];

const fail = (error: SignalErrorCode): SignalResult => ({ ok: false, error });

const errorFrom = (status: number, raw: string | undefined): SignalErrorCode => {
  const known = KNOWN_ERRORS.find((code) => code === raw);
  if (known) return known;
  return status === 429 ? 'espera' : 'net';
};

/**
 * Adapter of the SignalGateway port over POST {apiUrl}/senal (successor of decode9/api/senal.php).
 * 200 {ok:true,code} → ok + receipt · 422/429/500 {error} → that error · no API → unavailable · rest → net.
 * Never throws.
 */
const createSignalGateway = (client: ApiClient): SignalGateway => ({
  send: async (payload) => {
    if (!client.available) return fail('unavailable');
    try {
      const res = await client.postJson<SignalAnswer>('senal', payload);
      if (res.ok && res.data.ok) return { ok: true, code: typeof res.data.code === 'string' ? res.data.code : undefined };
      return fail(errorFrom(res.status, res.data.error));
    } catch {
      return fail('net');
    }
  },
});

export default createSignalGateway;
