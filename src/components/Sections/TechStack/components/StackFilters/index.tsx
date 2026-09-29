import Chip from '@/components/UI/Chip';
import type { StackFiltersProps } from './interface';

const StackFilters = ({ label, allLabel, names, keys, active, onChange }: StackFiltersProps) => (
  <div role="group" aria-label={label} className="mb-8 flex flex-wrap gap-2">
    <Chip label={allLabel} pressed={active === 'all'} onClick={() => onChange('all')} />
    {keys.map((key) => (
      <Chip key={key} label={names[key]} pressed={active === key} onClick={() => onChange(key)} />
    ))}
  </div>
);

export default StackFilters;
