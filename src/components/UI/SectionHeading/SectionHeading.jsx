import { cn } from '../../../utils/cn';
import './SectionHeading.scss';

export function SectionHeading({ kicker, title, className }) {
  return (
    <header className={cn('section-heading', className)}>
      {kicker ? <p className="section-heading__kicker">{kicker}</p> : null}
      <h2 className="section-heading__title">{title}</h2>
    </header>
  );
}
