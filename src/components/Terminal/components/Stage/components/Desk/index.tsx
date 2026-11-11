import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import Window from '../Window';
import type { DeskProps } from './interface';
import styles from './styles.module.scss';

/** Absolute-positioned window area of the stage (original .desk); a stacked grid on phones. */
const Desk = ({ deskRef, wm, lang, reduceMotion }: DeskProps) => {
  const { close } = wm;
  const onClose = useCallback((uid: number) => close(uid, { toDock: true }), [close]);
  return (
    <div ref={deskRef} className={cn(styles.desk, wm.arranging && styles.arr)}>
      {wm.windows.map((win) => (
        <Window
          key={win.uid}
          win={win}
          top={win.uid === wm.topUid}
          arranging={wm.arranging}
          lang={lang}
          reduceMotion={reduceMotion}
          deskRef={deskRef}
          isDesk={wm.isDesk}
          onFront={wm.front}
          onClose={onClose}
          onMin={wm.setMin}
          onMove={wm.moveTo}
        />
      ))}
    </div>
  );
};

export default Desk;
