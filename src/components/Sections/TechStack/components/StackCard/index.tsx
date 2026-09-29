import DynamicIcon from '@/components/UI/DynamicIcon';
import { cn } from '@/utils/cn';
import type { StackCardProps } from './interface';

/** The outer element belongs to the reveal and Flip animations; dimming lives on the inner one. */
const StackCard = ({ category, name, dimmed, selected }: StackCardProps) => (
  <article data-stack-card data-reveal className={cn(selected && 'sm:col-span-2 h:col-span-1')}>
    <div
      className={cn(
        'd9-card h-full p-5 transition-[opacity,border-color] duration-500',
        dimmed && 'opacity-35',
        selected && 'border-brand-red/60',
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink-700 text-ink-200">
          <DynamicIcon name={category.icon} size={16} />
        </span>
        <h3 className="d9-h4 text-[15px]">{name}</h3>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {category.tags.map((tag) => (
          <li key={tag} className="d9-tag px-2.5 py-0.5 text-[12px]">
            {tag}
          </li>
        ))}
      </ul>
    </div>
  </article>
);

export default StackCard;
