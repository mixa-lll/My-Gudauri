import { cn } from '../../../utils/cn';
import './SectionHeading.scss';

export function SectionHeading({
  kicker,
  title,
  description,
  className,
  size = 'lg',
  align = 'start',
  as: Heading = 'h2',
  titleId
}) {
  return (
    <header className={cn('section-heading', `section-heading--${size}`, `section-heading--${align}`, className)}>
      {kicker ? <p className="section-heading__kicker">{kicker}</p> : null}
      <Heading id={titleId} className="section-heading__title">{title}</Heading>
      {description ? <p className="section-heading__description">{description}</p> : null}
    </header>
  );
}
