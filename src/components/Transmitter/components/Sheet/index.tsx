import { cn } from '@/utils/cn';
import shared from '../../shared.module.scss';
import ch from '../Channel/styles.module.scss';
import type { SheetProps } from './interface';

/** Bottom sheet of the main screen (#vs, #as, #rs): tap the backdrop or ✕ CERRAR to close. */
const Sheet = ({ open, labelledBy, kicker, onClose, bodyClassName, bodyRef, children }: SheetProps) => (
  <div
    className={cn(ch.sheet, open && ch.sheetOn)}
    role="dialog"
    aria-modal="true"
    aria-labelledby={labelledBy}
    aria-hidden={!open}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className={cn(ch.card, shared.cut)}>
      <div className={ch.hd}>
        <span className={cn(shared.lbl, shared.amb)}>{kicker}</span>
        <button type="button" className={shared.x} onClick={onClose} aria-label="Cerrar">
          ✕ CERRAR
        </button>
      </div>
      <div ref={bodyRef} className={cn(ch.sbody, bodyClassName)}>
        {children}
      </div>
    </div>
  </div>
);

export default Sheet;
