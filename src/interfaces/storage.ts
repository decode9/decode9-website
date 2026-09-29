/** Minimal key/value persistence. Browser storage can throw or be absent, so implementations never throw. */
export interface KeyValueStorage {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
}
