import { useEffect, useId, useRef, useState } from 'react';
import 'ol/ol.css';
import { Badge, Button, ListingCardGrid, MediaPlaceholder, Notice, SectionHeading, TransferCard } from '../../../../components';
import './TransferDetailBlocks.scss';

function TransferSection({ id, kicker, title, description, className = '', children }) {
  const titleId = useId();
  return <section id={id} className={`ds-detail-section ${className}`} aria-labelledby={titleId}>
    <SectionHeading kicker={kicker} title={title} description={description} size="sm" titleId={titleId} />
    {children}
  </section>;
}

export function TransferDirectionSwitch({
  label = 'Direction',
  start,
  finish,
  value = 'to-gudauri',
  onChange,
}) {
  const options = [
    { value: 'to-gudauri', label: `${start} → ${finish}` },
    { value: 'from-gudauri', label: `${finish} → ${start}` },
  ];
  return <div className="ds-transfer-direction" role="group" aria-label={label}>
    {options.map((option) => <Button
      key={option.value}
      type="button"
      size="sm"
      variant={value === option.value ? 'primary' : 'secondary'}
      aria-pressed={value === option.value}
      onClick={() => onChange?.(option.value)}
    >{option.label}</Button>)}
  </div>;
}

function VehicleImage({ media = [], name }) {
  const image = media.find((item) => item?.featured && (item?.src || item?.url))
    ?? media.find((item) => item?.src || item?.url);
  if (!image) return <div className="ds-transfer-vehicle__placeholder"><MediaPlaceholder kind="transfer" label={name} /></div>;
  return <figure className="ds-transfer-vehicle__image"><img src={image.src ?? image.url} alt={image.alt || name} loading="lazy" /></figure>;
}

function VehicleMetricIcon({ type }) {
  if (type === 'seats') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="3" /><path d="M3.5 19c.4-4.2 2.3-6.3 5.5-6.3s5.1 2.1 5.5 6.3M16 5.5a2.6 2.6 0 0 1 0 5.2M16 13c2.7.2 4.2 2.2 4.5 6" /></svg>;
  if (type === 'skis') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 3 4 18M14 3l3 18M4.5 9.5l13-3M6 17.5l13-3" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M5 7h14v14H5zM9 7v14M15 7v14" /></svg>;
}

function VehicleMetrics({ items = [] }) {
  const visibleItems = items.filter((item) => item?.value !== undefined && item?.value !== null && item?.value !== '');
  return <dl className="ds-transfer-vehicle__metrics">{visibleItems.map((item) => <div key={item.label}>
    <dt>{item.label}</dt>
    <dd><span className="ds-transfer-vehicle__metric-icon"><VehicleMetricIcon type={item.type} /></span><strong>{item.value}</strong></dd>
  </div>)}</dl>;
}

function RouteMetricIcon({ type }) {
  if (type === 'distance') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19h14M7 16l3-9 4 6 3-8" /><circle cx="7" cy="16" r="1.5" /><circle cx="17" cy="5" r="1.5" /></svg>;
  if (type === 'duration') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 3h6" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>;
}

function RouteMetrics({ items = [] }) {
  const visibleItems = items.filter((item) => item?.value !== undefined && item?.value !== null && item?.value !== '');
  return <dl className="ds-transfer-route__metrics">{visibleItems.map((item) => <div key={item.label}>
    <dt>{item.label}</dt>
    <dd><span className="ds-transfer-route__metric-icon"><RouteMetricIcon type={item.type} /></span><strong>{item.value}</strong></dd>
  </div>)}</dl>;
}

function RouteMapFallback({ start, finish, mapLabel }) {
  return <div className="ds-transfer-route__plot" role="img" aria-label={mapLabel}>
    <svg className="ds-transfer-route__road" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true"><path d="M 10 40 C 34 38, 55 9, 90 10" /></svg>
    <span className="ds-transfer-route__point ds-transfer-route__point--start"><i aria-hidden="true" />{start}</span>
    <span className="ds-transfer-route__point ds-transfer-route__point--finish"><i aria-hidden="true" />{finish}</span>
  </div>;
}

function TransferRouteMap({ route, start, finish, mapLabel, labels }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState(route.geometry?.length > 1 ? 'loading' : 'fallback');
  const geometryKey = JSON.stringify(route.geometry ?? []);

  useEffect(() => {
    if (!containerRef.current || !Array.isArray(route.geometry) || route.geometry.length < 2) return undefined;
    const coordinates = route.geometry.filter((point) => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite));
    if (coordinates.length < 2) {
      setStatus('fallback');
      return undefined;
    }

    const styles = getComputedStyle(containerRef.current);
    const routeColor = styles.getPropertyValue('--action-primary').trim() || '#0b6bcb';
    const casingColor = styles.getPropertyValue('--surface-card').trim() || '#fff';
    let map;
    let disposed = false;

    Promise.all([
      import('ol/Map.js'),
      import('ol/View.js'),
      import('ol/layer/Tile.js'),
      import('ol/layer/Vector.js'),
      import('ol/source/OSM.js'),
      import('ol/source/XYZ.js'),
      import('ol/source/Vector.js'),
      import('ol/Feature.js'),
      import('ol/geom/LineString.js'),
      import('ol/geom/Point.js'),
      import('ol/control/defaults.js'),
      import('ol/interaction/defaults.js'),
    ]).then(([
      { default: OpenLayersMap },
      { default: View },
      { default: TileLayer },
      { default: VectorLayer },
      { default: OSM },
      { default: XYZ },
      { default: VectorSource },
      { default: Feature },
      { default: LineString },
      { default: Point },
      { defaults: defaultControls },
      { defaults: defaultInteractions },
    ]) => {
      if (disposed || !containerRef.current) return;
      const routeGeometry = new LineString(coordinates).transform('EPSG:4326', 'EPSG:3857');
      const routeSource = new VectorSource({ features: [new Feature({ geometry: routeGeometry })] });
      const endpointSource = new VectorSource({
        features: [coordinates[0], coordinates.at(-1)].map((point) => new Feature({ geometry: new Point(point).transform('EPSG:4326', 'EPSG:3857') })),
      });
      const tileUrl = import.meta.env.VITE_MAP_TILE_URL;
      const baseSource = tileUrl ? new XYZ({
        url: tileUrl,
        attributions: import.meta.env.VITE_MAP_ATTRIBUTION || '© OpenStreetMap contributors',
        crossOrigin: 'anonymous',
      }) : new OSM({ crossOrigin: 'anonymous' });
      const view = new View({ center: routeGeometry.getFirstCoordinate(), zoom: 7, enableRotation: false });

      map = new OpenLayersMap({
        target: containerRef.current,
        controls: defaultControls({ rotate: false, zoomOptions: { zoomInTipLabel: labels.zoomIn ?? 'Zoom in', zoomOutTipLabel: labels.zoomOut ?? 'Zoom out' } }),
        interactions: defaultInteractions({ altShiftDragRotate: false, pinchRotate: false, mouseWheelZoom: false }),
        layers: [
          new TileLayer({ source: baseSource }),
          new VectorLayer({ source: routeSource, style: { 'stroke-color': casingColor, 'stroke-width': 10 } }),
          new VectorLayer({ source: routeSource, style: { 'stroke-color': routeColor, 'stroke-width': 6 } }),
          new VectorLayer({ source: endpointSource, style: { 'circle-radius': 8, 'circle-fill-color': routeColor, 'circle-stroke-color': casingColor, 'circle-stroke-width': 4 } }),
        ],
        view,
      });
      view.fit(routeGeometry, { padding: [56, 56, 56, 56], maxZoom: 11, duration: 0 });
      map.once('postrender', () => {
        if (!disposed) setStatus('ready');
      });
    }).catch(() => {
      if (!disposed) setStatus('fallback');
    });

    return () => {
      disposed = true;
      map?.setTarget(undefined);
    };
  }, [geometryKey]);

  if (status === 'fallback') return <RouteMapFallback start={start} finish={finish} mapLabel={mapLabel} />;

  return <div className="ds-transfer-route__interactive-map" role="region" aria-label={mapLabel}>
    <div ref={containerRef} className="ds-transfer-route__map-canvas" tabIndex="0" aria-label={labels.mapControls ?? 'Interactive route map controls'} />
    {status === 'loading' ? <span className="ds-transfer-route__map-loading" aria-live="polite">{labels.mapLoading ?? 'Loading route map…'}</span> : null}
    <span className="ds-transfer-route__map-label ds-transfer-route__map-label--start"><i aria-hidden="true" />{start}</span>
    <span className="ds-transfer-route__map-label ds-transfer-route__map-label--finish"><i aria-hidden="true" />{finish}</span>
  </div>;
}

export function TransferVehicleDetails({
  id = 'vehicle',
  kicker = 'Your vehicle',
  title = 'Vehicle and capacity',
  description,
  vehicle = {},
  labels = {},
}) {
  const metrics = [
    { type: 'seats', label: labels.seats ?? 'Passenger seats', value: vehicle.seats },
    { type: 'luggage', label: labels.largeBags ?? 'Large bags', value: vehicle.luggage?.large },
    { type: 'luggage', label: labels.carryOn ?? 'Carry-on bags', value: vehicle.luggage?.carryOn },
    { type: 'skis', label: labels.skis ?? 'Skis / snowboards', value: vehicle.skiCapacity },
  ];
  const vehicleName = vehicle.name || [vehicle.make, vehicle.model].filter(Boolean).join(' ') || title;

  return <TransferSection id={id} className="ds-transfer-vehicle" kicker={kicker} title={title} description={description}>
    <div className="ds-transfer-vehicle__overview">
      <VehicleImage media={vehicle.media} name={vehicleName} />
      <div className="ds-transfer-vehicle__information">
        <div className="ds-transfer-vehicle__identity">
          <span>{labels.model ?? 'Make and model'}</span>
          <strong>{vehicleName}</strong>
          {vehicle.className ? <Badge>{vehicle.className}</Badge> : null}
        </div>
        <VehicleMetrics items={metrics} />
        {vehicle.options?.length ? <div className="ds-transfer-vehicle__options"><h3>{labels.options ?? 'On board'}</h3><ul>{vehicle.options.map((option) => <li key={option}><span aria-hidden="true">✓</span>{option}</li>)}</ul></div> : null}
      </div>
    </div>
    {vehicle.isExact === false ? <Notice tone="info">{labels.analogueNotice ?? 'A vehicle of the same class and capacity may be assigned.'}</Notice> : null}
  </TransferSection>;
}

export function TransferRouteDetails({
  id = 'route',
  kicker = 'Your route',
  title = 'Route',
  description,
  route = {},
  direction,
  labels = {},
}) {
  const forward = direction !== 'from-gudauri';
  const start = forward ? route.origin : route.destination;
  const finish = forward ? route.destination : route.origin;
  const mapLabel = labels.map ?? `Route map from ${start} to ${finish}`;
  const stats = [
    { type: 'distance', label: labels.distance ?? 'Road distance', value: route.distanceKm ? `${route.distanceKm} km` : undefined },
    { type: 'duration', label: labels.duration ?? 'Estimated time', value: route.duration },
    { type: 'zone', label: labels.zone ?? 'Pickup area', value: route.zoneType },
  ];

  return <TransferSection id={id} className="ds-transfer-route" kicker={kicker} title={title} description={description}>
    <div className="ds-transfer-route__map">
      {route.mapEmbedUrl && !route.geometry?.length ? <iframe src={route.mapEmbedUrl} title={mapLabel} loading="lazy" /> : <TransferRouteMap route={route} start={start} finish={finish} mapLabel={mapLabel} labels={labels} />}
      {route.mapUrl ? <a href={route.mapUrl} target="_blank" rel="noreferrer">{labels.openMap ?? 'Open route map'} <span aria-hidden="true">↗</span></a> : null}
    </div>
    <div className="ds-transfer-route__direction" aria-label={labels.direction ?? 'Route direction'}>
      <span><small>{labels.from ?? 'From'}</small><strong>{start}</strong></span>
      <b aria-hidden="true">→</b>
      <span><small>{labels.to ?? 'To'}</small><strong>{finish}</strong></span>
    </div>
    <RouteMetrics items={stats} />
    <Notice tone="info">{route.roadNotice || labels.addressNotice || 'Exact pickup and drop-off addresses are added in the request.'}</Notice>
  </TransferSection>;
}

export function TransferConditions({
  id = 'conditions',
  kicker = 'Before the trip',
  title = 'Trip conditions',
  description,
  items = [],
}) {
  return <TransferSection id={id} className="ds-transfer-conditions" kicker={kicker} title={title} description={description}>
    <dl>{items.map((item, index) => <div key={item.id ?? item.label ?? index}>
      <dt>{item.label}</dt>
      <dd>{item.value}</dd>
      {item.description ? <p>{item.description}</p> : null}
    </div>)}</dl>
  </TransferSection>;
}

export function TransferRelatedOffers({
  sameVehicle = [],
  sameRoute = [],
  sameVehicleTitle = 'Same vehicle on other routes',
  sameRouteTitle = 'Other vehicles on this route',
  sameVehicleDescription,
  sameRouteDescription,
}) {
  if (!sameVehicle.length && !sameRoute.length) return null;
  return <section className="ds-transfer-related" aria-label="Related transfers">
    {sameVehicle.length ? <RelatedTransferGroup title={sameVehicleTitle} description={sameVehicleDescription} items={sameVehicle} /> : null}
    {sameRoute.length ? <RelatedTransferGroup title={sameRouteTitle} description={sameRouteDescription} items={sameRoute} /> : null}
  </section>;
}

function RelatedTransferGroup({ title, description, items }) {
  return <TransferSection className="ds-object-related-listings" title={title} description={description}>
    <ListingCardGrid className="ds-related-listings" columns={3}>{items.map((item) => <TransferCard item={item} key={item.slug} />)}</ListingCardGrid>
  </TransferSection>;
}
