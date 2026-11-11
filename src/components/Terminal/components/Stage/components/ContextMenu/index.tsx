import { createPortal } from 'react-dom';
import { SHELL_TEXT } from '@/data/terminal';
import { cn } from '@/utils/cn';
import Bi from '../../../Bilingual';
import type { ContextMenuItem, ContextMenuProps } from './interface';
import useContextMenu from './useContextMenu';
import styles from './styles.module.scss';

/**
 * Right-click menu of the stage (original .ctxm): window actions, arrange by topic / cascade, close all.
 * Portaled to <body> (the CRT root has a filter, which would trap position:fixed); the wrapper carries
 * the terminal tokens and data-lang so <Bi> and the colours work out there.
 */
const ContextMenu = ({ target, title, windowItems, deskItems, closeAllItem, visible, lang, onAction }: ContextMenuProps) => {
  const { ref, on, pos, onKeyDown } = useContextMenu(target, visible);
  const item = (it: ContextMenuItem) => (
    <button key={it.action} type="button" role="menuitem" disabled={it.disabled} onClick={() => onAction(it.action)}>
      <span>
        <Bi t={it.label} />
      </span>
      <i>{it.key ?? ''}</i>
    </button>
  );

  return createPortal(
    <div className={styles.scope} data-lang={lang} data-terminal-ctx>
      <div
        ref={ref}
        className={cn(styles.ctxm, on && styles.on)}
        role="menu"
        style={{ left: pos.left, top: pos.top }}
        onKeyDown={onKeyDown}
      >
        {title !== null ? (
          <>
            <div className={styles.ch}>{title}</div>
            {windowItems.map(item)}
            <hr />
          </>
        ) : (
          <div className={styles.ch}>
            <Bi t={SHELL_TEXT.desktop} />
          </div>
        )}
        {deskItems.map(item)}
        <hr />
        {item(closeAllItem)}
      </div>
    </div>,
    document.body,
  );
};

export default ContextMenu;
