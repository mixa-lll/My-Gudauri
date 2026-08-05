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
  /* 'split' puts the title on the left and the description (plus any actions)
     on the right, both sitting on the same baseline — the section header used
     throughout the home page. */
  layout = 'stack',
  /* Hairline above the header. Sections lead with it instead of extra spacing,
     which is what separates them on a page with no card backgrounds. */
  divider = false,
  /* Accent by default: the kicker is the one place the brand red appears in a
     section header, and it is what ties headings across the site together.
     Pass tone="muted" where the header sits on a coloured or dark surface. */
  tone = 'accent',
  headingLevel = 'h2',
  as,
  titleId
}) {
  const Heading = as ?? headingLevel;
  const aside = description || actions;

  return (
    <header
      className={cn(
        'section-heading',
        `section-heading--${size}`,
        `section-heading--${align}`,
        `section-heading--${layout}`,
        `section-heading--kicker-${tone}`,
        divider && 'section-heading--divided',
        className
      )}
    >
      <div className="section-heading__lead">
        {kicker ? <p className="section-heading__kicker">{kicker}</p> : null}
        <Heading id={titleId} className="section-heading__title">{title}</Heading>
        {layout === 'stack' && description ? <p className="section-heading__description">{description}</p> : null}
        {layout === 'stack' && actions ? <div className="section-heading__actions">{actions}</div> : null}
      </div>

      {layout === 'split' && aside ? (
        <div className="section-heading__aside">
          {description ? <p className="section-heading__description">{description}</p> : null}
          {actions ? <div className="section-heading__actions">{actions}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
