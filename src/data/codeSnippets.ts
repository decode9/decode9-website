// Code snippet strings for the CodePatterns section.
// Using single quotes throughout to avoid eval-source-map escaping issues in dev mode.
// Template literals with nested backticks are rewritten as string concatenation.

export const debounceSnippet = [
  '// Stop firing on every keystroke — wait for the pause.',
  'function debounce<T extends (...a: any[]) => void>(',
  '  fn: T, wait = 300,',
  ') {',
  '  let t: ReturnType<typeof setTimeout>;',
  '  return (...args: Parameters<T>) => {',
  '    clearTimeout(t);',
  '    t = setTimeout(() => fn(...args), wait);',
  '  };',
  '}',
  '',
  "const search = debounce(q => api.search(q), 250);",
  "input.addEventListener('input', e => search(e.target.value));",
].join('\n');

export const fetchRetrySnippet = [
  '// Retry with exponential backoff — survive flaky networks.',
  'async function fetchWithRetry<T>(',
  '  url: string,',
  '  retries = 3,',
  '  delay = 500,',
  '): Promise<T> {',
  '  try {',
  '    const res = await fetch(url);',
  "    if (!res.ok) throw new Error('HTTP ' + res.status);",
  '    return res.json() as T;',
  '  } catch (err) {',
  '    if (retries === 0) throw err;',
  '    await new Promise(r => setTimeout(r, delay));',
  '    return fetchWithRetry<T>(url, retries - 1, delay * 2);',
  '  }',
  '}',
].join('\n');

export const optimisticUpdateSnippet = [
  '// Show the result immediately — reconcile later.',
  'async function optimisticUpdate<T>(',
  '  items: T[],',
  '  newItem: T,',
  '  persist: (item: T) => Promise<T>,',
  '  rollback: (items: T[]) => void,',
  '): Promise<void> {',
  '  const prev = [...items];',
  '  items.push(newItem); // instant UI update',
  '  try {',
  '    const saved = await persist(newItem);',
  '    Object.assign(newItem as object, saved);',
  '  } catch {',
  '    rollback(prev); // undo on failure',
  '  }',
  '}',
].join('\n');

export const cancelableSearchSnippet = [
  '// Cancel stale requests — only the last one counts.',
  'function useCancelableSearch(query: string) {',
  '  useEffect(() => {',
  '    const ctrl = new AbortController();',
  '',
  "    fetch('/api/search?q=' + query, {",
  '      signal: ctrl.signal,',
  '    })',
  '      .then(r => r.json())',
  '      .then(setResults)',
  '      .catch(e => {',
  "        if (e.name !== 'AbortError') setError(e);",
  '      });',
  '',
  '    return () => ctrl.abort(); // cancel on re-run',
  '  }, [query]);',
  '}',
].join('\n');
