import { useCallback, useRef, useState } from 'react';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import { PIPELINE_HOURS_SAVED, pipelineNodes } from '@/data/labs';
import { trackEvent } from '@/lib/analytics';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { motionQuery } from '@/lib/motion/tokens';
import type { PipelineCopy, PipelineStatus, UseAutomationPipelineReturn } from './interface';

const HOP_SECONDS = 0.85;

/**
 * One run: the packet leaves each stage along its link while the link draws
 * itself solid, the next stage pulses as it receives it, and the log and the
 * hours counter follow. Every run starts from a clean slate.
 */
const useAutomationPipeline = (copy: PipelineCopy): UseAutomationPipelineReturn => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const [status, setStatus] = useState<PipelineStatus>('idle');
  const [activeNode, setActiveNode] = useState(-1);
  const [logCount, setLogCount] = useState(0);
  const [hours, setHours] = useState(0);
  const { inView } = useScrollLayout();

  // The stages settle in one after another when the demo comes into view.
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        gsap.from('[data-pipe-node]', {
          autoAlpha: 0,
          y: 12,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: inView(scopeRef.current, { vertical: 'top 80%', horizontal: 'left 80%' }),
        });
      });
      return () => media.revert();
    },
    { scope: scopeRef, dependencies: [inView], revertOnUpdate: true },
  );

  const { contextSafe } = useGSAP({ scope: scopeRef });

  const run = useCallback(() => {
    if (status === 'running') return;
    const root = scopeRef.current;
    const packet = root?.querySelector<SVGCircleElement>('[data-packet]');
    const paths = Array.from(root?.querySelectorAll<SVGPathElement>('[data-pipe-path]') ?? []);
    const live = Array.from(root?.querySelectorAll<SVGPathElement>('[data-pipe-live]') ?? []);
    const nodes = Array.from(root?.querySelectorAll<SVGGElement>('[data-pipe-node]') ?? []);
    if (!packet) return;
    trackEvent('lab_run', { lab: 'pipeline' });

    contextSafe(() => {
      timeline.current?.kill();
      gsap.set(live, { drawSVG: '0%' });
      gsap.set(packet, { autoAlpha: 0 });
      setActiveNode(-1);
      setLogCount(0);
      setHours(0);
      setStatus('running');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(live, { drawSVG: '100%' });
        setActiveNode(pipelineNodes.length - 1);
        setLogCount(pipelineNodes.length);
        setHours(PIPELINE_HOURS_SAVED);
        setStatus('done');
        return;
      }

      const counter = { value: 0 };
      const pulse = (index: number) =>
        gsap.fromTo(
          nodes[index] ?? {},
          { scale: 1.16 },
          { scale: 1, duration: 0.5, ease: 'back.out(3)', transformOrigin: '50% 50%' },
        );

      const tl = gsap.timeline({ onComplete: () => setStatus('done') });
      tl.call(() => {
        setActiveNode(0);
        setLogCount(1);
      });
      tl.add(pulse(0));
      paths.forEach((path, index) => {
        const label = `hop-${index}`;
        tl.addLabel(label, '+=0.1');
        tl.set(packet, { autoAlpha: 1 }, label);
        tl.to(
          packet,
          { duration: HOP_SECONDS, ease: 'power1.inOut', motionPath: { path, align: path, alignOrigin: [0.5, 0.5] } },
          label,
        );
        tl.fromTo(
          live[index] ?? {},
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: HOP_SECONDS, ease: 'power1.inOut' },
          label,
        );
        tl.set(packet, { autoAlpha: 0 });
        tl.call(() => {
          setActiveNode(index + 1);
          setLogCount(index + 2);
        });
        tl.add(pulse(index + 1));
      });
      tl.to(counter, {
        value: PIPELINE_HOURS_SAVED,
        duration: 1.1,
        ease: 'power3.out',
        onUpdate: () => setHours(Math.round(counter.value)),
      });
      timeline.current = tl;
    })();
  }, [contextSafe, status]);

  const actionLabel = { idle: copy.run, running: copy.running, done: copy.replay }[status];

  return { scopeRef, status, activeNode, logCount, hours, run, actionLabel };
};

export default useAutomationPipeline;
