import { cn } from '@/utils/cn';
import type { ButtonProps } from './interface';

// Literal class names: Tailwind only keeps component classes it can find in the source.
const VARIANT_CLASS = {
  energy: 'd9-btn--energy d9-notch-tr',
  outline: 'd9-btn--outline',
  secondary: 'd9-btn--secondary',
  ghost: 'd9-btn--ghost',
} as const;
const SIZE_CLASS = { sm: 'd9-btn--sm', md: '', lg: 'd9-btn--lg' } as const;

const Button = ({
  children,
  variant = 'energy',
  size = 'md',
  href,
  external = false,
  onClick,
  type = 'button',
  disabled = false,
  className,
  ariaLabel,
}: ButtonProps) => {
  const classes = cn('d9-btn', VARIANT_CLASS[variant], SIZE_CLASS[size], className);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
};

export default Button;
