import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProjectId } from '@/interfaces';
import { useGuide } from '@/context/GuideContext';
import { useSceneStore } from '@/context/SceneContext';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import { caseStudies } from '@/data/projects';
import { trackEvent } from '@/lib/analytics';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import type { UseWorkReturn } from './interface';

/**
 * The study on screen retints the stage and the UI with its own brand colour.
 * On the horizontal tour the screenshots also drift against the travel.
 */
const useWork = (): UseWorkReturn => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [openCase, setOpenCase] = useState<ProjectId | null>(null);
  const { activeChapter } = useGuide();
  const scene = useSceneStore();
  const { track } = useScrollLayout();

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-case]', trackRef.current);
      const triggers = panels.map((panel, index) =>
        ScrollTrigger.create({
          trigger: panel,
          ...(track
            ? { containerAnimation: track, start: 'left 60%', end: 'right 60%' }
            : { start: 'top center', end: 'bottom center' }),
          onToggle: (self) => self.isActive && setActive(index),
        }),
      );
      if (track) {
        panels.forEach((panel) =>
          gsap.fromTo(
            panel.querySelector('[data-case-media]'),
            { xPercent: 7 },
            {
              xPercent: -7,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: track,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          ),
        );
      }
      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { scope: sectionRef, dependencies: [track], revertOnUpdate: true },
  );

  // Retint whenever the active study changes — and again when the chapter is (re)entered,
  // because entering the chapter resets the accent to the chapter default.
  useEffect(() => {
    if (activeChapter !== 'work') return;
    const accent = caseStudies[active]?.brand.primary;
    if (!accent) return;
    scene.set({ accent });
    document.documentElement.style.setProperty('--accent', accent);
  }, [active, activeChapter, scene]);

  const open = useCallback((id: ProjectId) => {
    setOpenCase(id);
    trackEvent('project_click', { project: id, action: 'case_study' });
  }, []);
  const close = useCallback(() => setOpenCase(null), []);
  const visit = useCallback((id: ProjectId) => trackEvent('project_click', { project: id, action: 'visit' }), []);
  const openStudy = caseStudies.find((study) => study.id === openCase) ?? null;

  return { sectionRef, trackRef, active, openStudy, open, close, visit };
};

export default useWork;
