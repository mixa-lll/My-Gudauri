import { TransferConditions, TransferDirectionSwitch, TransferRelatedOffers, TransferRouteDetails, TransferVehicleDetails } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { transferRoutes } from '../fixtures/transferRoutes';

const vehicle = {
  name: 'Mercedes-Benz V-Class',
  className: 'Comfort minivan',
  seats: 7,
  luggage: { large: 7, carryOn: 4 },
  skiCapacity: 7,
  isExact: false,
  options: ['Winter tyres', 'Climate control', 'Child seat on request'],
  media: [
    { src: '/assets/transfers/minivan-highway.jpg', alt: 'Minivan on the mountain highway' },
    { src: '/assets/transfers/minivan-black-front.jpg', alt: 'Black minivan ready for pickup' },
    { src: '/assets/transfers/van-interior-leather.jpg', alt: 'Leather minivan cabin' },
  ],
};

const related = [
  { slug: 'tbilisi-minivan-gudauri', name: 'Minivan · up to 7 seats', route: 'Gudauri ↔ Tbilisi', duration: '~2 hours', vehicle: 'Minivan', price: '260 GEL', tags: ['Ski luggage'] },
  { slug: 'kutaisi-minivan-gudauri', name: 'Minivan · up to 7 seats', route: 'Gudauri ↔ Kutaisi Airport', duration: '~4.5 hours', vehicle: 'Minivan', price: '520 GEL', tags: ['Meet & greet'] },
  { slug: 'tbilisi-suv-gudauri', name: '4×4 · up to 4 seats', route: 'Gudauri ↔ Tbilisi Airport', duration: '~2 hours', vehicle: '4×4', price: '220 GEL', tags: ['Winter tyres'] },
];

export default { title: 'Blocks/Detail/Transfer', tags: ['autodocs'], parameters: { controls: { disable: true } } };

export const Direction = { parameters: { composition: defineComposition({ root: 'TransferDirectionSwitch' }) }, render: () => <TransferDirectionSwitch start="Tbilisi Airport" finish="Gudauri" /> };
export const Vehicle = { parameters: { composition: defineComposition({ root: 'TransferVehicleDetails' }) }, render: () => <TransferVehicleDetails vehicle={vehicle} description="One vehicle image and a comparison-first capacity infographic are shared across every route where this car is offered." /> };
export const VehicleWithoutMedia = { name: 'Vehicle — Without Media', parameters: { composition: defineComposition({ root: 'TransferVehicleDetails' }) }, render: () => <TransferVehicleDetails vehicle={{ ...vehicle, media: [] }} /> };
const routeStory = (route) => ({
  parameters: { composition: defineComposition({ root: 'TransferRouteDetails' }) },
  render: () => <TransferRouteDetails route={route} title={`${route.origin} → ${route.destination}`} description="The route line is stored on the reusable route entity and shared by every vehicle offer on this direction." />,
});

export const Route = { ...routeStory(transferRoutes.tbilisiAirport), name: 'Route — Tbilisi Airport' };
export const RouteTbilisiCity = { ...routeStory(transferRoutes.tbilisiCity), name: 'Route — Tbilisi City' };
export const RouteKutaisiAirport = { ...routeStory(transferRoutes.kutaisiAirport), name: 'Route — Kutaisi Airport' };
export const RouteBatumi = { ...routeStory(transferRoutes.batumi), name: 'Route — Batumi' };
export const RouteKazbegi = { ...routeStory(transferRoutes.kazbegi), name: 'Route — Kazbegi' };
export const RouteVladikavkaz = { ...routeStory(transferRoutes.vladikavkaz), name: 'Route — Vladikavkaz' };
export const ReverseRoute = { name: 'Route — Reverse Direction', parameters: { composition: defineComposition({ root: 'TransferRouteDetails' }) }, render: () => <TransferRouteDetails route={transferRoutes.tbilisiAirport} direction="from-gudauri" title="Gudauri → Tbilisi Airport" /> };
export const Conditions = { parameters: { composition: defineComposition({ root: 'TransferConditions' }) }, render: () => <TransferConditions items={[{ label: 'Waiting', value: '60 minutes after landing' }, { label: 'Stops', value: 'On request' }, { label: 'Cancellation', value: 'Free until confirmation' }, { label: 'Children and pets', value: 'Add them to the request' }]} /> };
export const Related = { parameters: { composition: defineComposition({ root: 'TransferRelatedOffers' }) }, render: () => <TransferRelatedOffers sameVehicle={related.slice(0, 2)} sameRoute={related.slice(2)} /> };
