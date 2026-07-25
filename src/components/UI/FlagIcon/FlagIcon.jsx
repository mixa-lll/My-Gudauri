import { cn } from '../../../utils/cn';
import './FlagIcon.scss';

const FLAG_SIZES = ['xs', 'sm', 'md', 'lg'];

const QUADRANT_CENTERS = [[4.7, 4.7], [19.3, 4.7], [4.7, 19.3], [19.3, 19.3]];

function crossPath([cx, cy], arm, thickness) {
  const a = arm;
  const t = thickness;
  return `M${cx - t} ${cy - a}H${cx + t}V${cy - t}H${cx + a}V${cy + t}H${cx + t}V${cy + a}H${cx - t}V${cy + t}H${cx - a}V${cy - t}Z`;
}

const FLAGS = {
  ge: {
    name: 'Georgia',
    artwork: (
      <>
        <rect width="24" height="24" fill="#ffffff" />
        <path d="M9.4 0h5.2v24H9.4zM0 9.4h24v5.2H0z" fill="#ff0000" />
        {QUADRANT_CENTERS.map((center) => (
          <path d={crossPath(center, 2, 0.62)} fill="#ff0000" key={`${center[0]}-${center[1]}`} />
        ))}
      </>
    )
  },
  gb: {
    name: 'United Kingdom',
    artwork: (
      <>
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0 24 24M24 0 0 24" stroke="#ffffff" strokeWidth="6" />
        <path d="M0 0 24 24M24 0 0 24" stroke="#c8102e" strokeWidth="2.4" />
        <path d="M12 0v24M0 12h24" stroke="#ffffff" strokeWidth="8" />
        <path d="M12 0v24M0 12h24" stroke="#c8102e" strokeWidth="4.8" />
      </>
    )
  },
  ru: {
    name: 'Russia',
    artwork: (
      <>
        <rect width="24" height="8" fill="#ffffff" />
        <rect width="24" height="8" y="8" fill="#0039a6" />
        <rect width="24" height="8" y="16" fill="#d52b1e" />
      </>
    )
  }
};

export const FLAG_COUNTRIES = Object.keys(FLAGS);

export function FlagIcon({ country, size = 'md', className, decorative = true, label }) {
  const flag = FLAGS[country];
  if (!flag) throw new Error(`FlagIcon: unsupported country “${country}”.`);
  if (!FLAG_SIZES.includes(size)) throw new Error(`FlagIcon: unsupported size “${size}”.`);

  const accessibilityProps = decorative
    ? { 'aria-hidden': true, focusable: 'false' }
    : { role: 'img', 'aria-label': label ?? flag.name };

  return (
    <svg
      className={cn('flag-icon', `flag-icon--${size}`, className)}
      viewBox="0 0 24 24"
      {...accessibilityProps}
    >
      {flag.artwork}
      <circle className="flag-icon__ring" cx="12" cy="12" r="11.6" />
    </svg>
  );
}
