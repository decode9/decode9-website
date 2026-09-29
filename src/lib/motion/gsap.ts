import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Registered once, in the browser only (this module is also evaluated while prerendering).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrambleTextPlugin,
    SplitText,
    DrawSVGPlugin,
    MotionPathPlugin,
    Flip,
    CustomEase,
  );
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export {
  gsap,
  CustomEase,
  DrawSVGPlugin,
  Flip,
  MotionPathPlugin,
  ScrambleTextPlugin,
  ScrollTrigger,
  SplitText,
  useGSAP,
};
