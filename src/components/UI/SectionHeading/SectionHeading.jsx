import { cn } from '../../../utils/cn';
import './SectionHeading.scss';

export function SectionHeading({
  kicker,
  title,
  description,
  actions,
  className,
  size = 'lg',
  align = 'start',
  headingLevel = 'h2',
  as,
  titleId
}) {
  const Heading = as ?? headingLevel;
  return (
    <header className={cn('section-heading', `section-heading--${size}`, `section-heading--${align}`, className)}>
      {kicker ? <p className="section-heading__kicker">{kicker}</p> : null}
      <Heading id={titleId} className="section-heading__title">{title}</Heading>
      {description ? <p className="section-heading__description">{description}</p> : null}
      {actions ? <div className="section-heading__actions">{actions}</div> : null}
    </header>
  );
}
