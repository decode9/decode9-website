import { useCallback, useEffect, useRef, useState } from 'react';
import { useGuide } from '@/context/GuideContext';
import { traceSteps } from '@/data/labs';
import { trackEvent } from '@/lib/analytics';

const STEP_MS = 750;

/** Steps through the (illustrative) pipeline behind the guide; replays when the visitor asks something new. */
const useAgentTrace = () => {
  const { lastQuestion, open } = useGuide();
  const [activeStep, setActiveStep] = useState(-1);
  const timers = useRef<number[]>([]);

  const replay = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    setActiveStep(-1);
    timers.current = traceSteps.map((_, index) => window.setTimeout(() => setActiveStep(index), (index + 1) * STEP_MS));
    trackEvent('lab_run', { lab: 'agent_trace' });
  }, []);

  useEffect(() => {
    if (lastQuestion) replay();
  }, [lastQuestion, replay]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  return { lastQuestion, activeStep, replay, openGuide: open };
};

export default useAgentTrace;
