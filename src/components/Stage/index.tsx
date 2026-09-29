'use client';

import StageFallback from './components/StageFallback';
import useStage from './useStage';

/** Fixed WebGL backdrop — decorative, hidden from assistive tech. */
const Stage = () => {
  const { hostRef, mode } = useStage();

  return (
    <div className="d9-stage" aria-hidden="true" data-stage={mode}>
      <StageFallback visible={mode === 'fallback'} />
      <div ref={hostRef} className="absolute inset-0" />
    </div>
  );
};

export default Stage;
