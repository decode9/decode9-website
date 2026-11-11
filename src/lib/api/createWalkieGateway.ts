import type { WalkieGateway, WalkieResult } from '@/interfaces/walkie';
import type { ApiClient } from './createApiClient';

interface WalkieAnswer {
  ok?: boolean;
  error?: string;
}

const result = (status: WalkieResult['status']): WalkieResult => ({ status });

/**
 * Adapter of the WalkieGateway port over POST {apiUrl}/walkie (successor of perfil/api/mensaje.php).
 * 200 + {ok:true} → ok · 429 → rate-limited · {error:'vacio'} → empty · no API → unavailable · rest → failed.
 */
const createWalkieGateway = (client: ApiClient): WalkieGateway => ({
  send: async (payload) => {
    if (!client.available) return result('unavailable');
    try {
      const res = await client.postJson<WalkieAnswer>('walkie', payload);
      if (res.ok && res.data.ok) return result('ok');
      if (res.status === 429) return result('rate-limited');
      if (res.data.error === 'vacio') return result('empty');
      return result('failed');
    } catch {
      return result('failed');
    }
  },
});

export default createWalkieGateway;
