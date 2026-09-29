import type { ChipProps } from './interface';

const Chip = ({ label, onClick, pressed, icon, disabled = false }: ChipProps) => (
  <button type="button" className="d9-chip" onClick={onClick} aria-pressed={pressed} disabled={disabled}>
    {icon}
    <span>{label}</span>
  </button>
);

export default Chip;
