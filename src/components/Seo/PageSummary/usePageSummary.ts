import { useEffect, useState } from 'react';

/** True until the client has mounted (the static HTML always ships the full summary). */
const usePageSummary = (replaceOnMount: boolean) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return { showCopy: !(replaceOnMount && mounted) };
};

export default usePageSummary;
