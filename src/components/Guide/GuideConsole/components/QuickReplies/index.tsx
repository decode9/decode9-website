import Chip from '@/components/UI/Chip';
import type { QuickRepliesProps } from './interface';

/** Scripted next steps for the current chapter (navigation or a predefined question). */
const QuickReplies = ({ label, options, disabled, onSelect }: QuickRepliesProps) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2 px-4 pb-3">
    {options.map((option) => (
      <Chip key={option.id} label={option.label} onClick={() => onSelect(option.id)} disabled={disabled} />
    ))}
  </div>
);

export default QuickReplies;
