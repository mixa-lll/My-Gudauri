import { cn } from '../../../utils/cn';
import './VehicleTypeIcon.scss';

/*
 * Side-profile illustrations of the body types a transfer can arrive in.
 *
 * A guest recognises the shape of a minibus long before they read the word, so
 * the catalog leads with the drawing and lets the label confirm it. The artwork
 * is one shared set at one angle and one scale, which is what makes the five
 * sizes comparable at a glance.
 */

export const VEHICLE_TYPES = ['sedan', 'hatchback', 'suv', 'minivan', 'minibus'];

export function VehicleTypeIcon({ type, className, alt = '' }) {
  if (!VEHICLE_TYPES.includes(type)) throw new Error(`VehicleTypeIcon: unknown vehicle type “${type}”.`);
  return (
    <img
      className={cn('ui-vehicle-icon', className)}
      src={`/assets/vehicle-types/${type}.png`}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      loading="lazy"
      width="320"
      height="158"
    />
  );
}

/** The body type as it sits beside a vehicle name on a catalog card. */
export function VehicleTypeTag({ type, label, className }) {
  if (!type || !VEHICLE_TYPES.includes(type)) return null;
  return (
    <span className={cn('ui-vehicle-tag', className)}>
      <VehicleTypeIcon type={type} />
      <b>{label}</b>
    </span>
  );
}
