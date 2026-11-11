'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react';
import { CONTEXT_MENU_TEXT as T } from '@/data/terminal';
import type { TerminalLang } from '@/interfaces/terminal';
import type { WindowManagerApi } from '../../useWindowManager';
import type { ContextAction } from './components/ContextMenu/interface';
import type { StageMenu, UseStageResult } from './interface';

const FORM_FIELDS = 'input,textarea,select,[contenteditable]';

interface Deps {
  stageRef: RefObject<HTMLElement>;
  wm: WindowManagerApi;
  screenVersion: number;
  lang: TerminalLang;
}

/** Screen-in timing, the CRT-wide selectstart rule and the stage context menu (original ctxOpen/ctxClose). */
const useStage = ({ stageRef, wm, screenVersion, lang }: Deps): UseStageResult => {
  const [entering, setEntering] = useState(false);
  const [menu, setMenu] = useState<StageMenu | null>(null);
  const wmRef = useRef(wm);
  wmRef.current = wm;

  /* .scr.in for 600 ms after each screen change. */
  useEffect(() => {
    if (!screenVersion) return undefined;
    setEntering(true);
    const id = window.setTimeout(() => setEntering(false), 600);
    return () => window.clearTimeout(id);
  }, [screenVersion]);

  /* No text selection inside the CRT except in form fields (original selectstart rule). */
  useEffect(() => {
    const crt = stageRef.current?.parentElement;
    if (!crt) return undefined;
    const onSelect = (e: Event) => {
      const t = e.target as Element | null;
      if (!t?.closest?.(FORM_FIELDS)) e.preventDefault();
    };
    crt.addEventListener('selectstart', onSelect);
    return () => crt.removeEventListener('selectstart', onSelect);
  }, [stageRef]);

  const closeMenu = useCallback(() => {
    setMenu((m) => (m && m.visible ? { ...m, visible: false } : m));
    window.setTimeout(() => setMenu((m) => (m && !m.visible ? null : m)), 160);
  }, []);

  /* Close on outside pointerdown, Escape, resize and any scroll (original listeners). */
  useEffect(() => {
    if (!menu?.visible) return undefined;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.('[data-terminal-ctx]')) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu, true);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
    };
  }, [menu?.visible, closeMenu]);

  const onContextMenu = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const t = e.target as Element;
      if (t.closest('input,textarea,select')) return;
      e.preventDefault();
      const { windows, isDesk } = wmRef.current;
      const live = windows.filter((w) => !w.leaving);
      const winEl = t.closest<HTMLElement>('[data-terminal-win]');
      const win = winEl ? live.find((w) => String(w.uid) === winEl.dataset.uid) ?? null : null;
      const noArrange = live.length < 1 || !isDesk();
      setMenu({
        target: { x: e.clientX, y: e.clientY, uid: win?.uid ?? null },
        title: win ? win.spec.title[lang === 'en' ? 1 : 0] : null,
        windowItems: win
          ? [
              { action: 'front', label: T.front },
              { action: 'min', label: win.min ? T.restore : T.minimize, key: '▾' },
              { action: 'close', label: T.close, key: '✕' },
            ]
          : [],
        deskItems: [
          { action: 'arrange', label: T.arrange, key: '▦', disabled: noArrange },
          { action: 'cascade', label: T.cascade, key: '◱', disabled: noArrange },
        ],
        closeAllItem: { action: 'closeall', label: T.closeAll, disabled: live.length < 1 },
        visible: true,
      });
    },
    [lang],
  );

  const onMenuAction = useCallback(
    (action: ContextAction) => {
      const uid = menu?.target.uid ?? null;
      closeMenu();
      const api = wmRef.current;
      const win = uid !== null ? api.windows.find((w) => w.uid === uid) : undefined;
      if (action === 'front' && win) api.front(win.uid);
      else if (action === 'min' && win) api.setMin(win.uid, !win.min);
      else if (action === 'close' && win) api.close(win.uid);
      else if (action === 'arrange') api.arrange('topic');
      else if (action === 'cascade') api.arrange('cascade');
      else if (action === 'closeall') api.closeAll();
    },
    [closeMenu, menu],
  );

  return { entering, menu, onContextMenu, onMenuAction };
};

export default useStage;
