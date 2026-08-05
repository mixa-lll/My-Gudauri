import { useState } from 'react';
import { CmsTransferEditor } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

/** The directions category settings provide; the editor only references them. */
const routes = [
  { id: 1, slug: 'tbilisi-gudauri', origin_name: 'Tbilisi', city: 'tbilisi', duration_label: '~2 hours', zone_type: 'City & airport', distance_km: 120, offers_count: 4 },
  { id: 2, slug: 'kutaisi-airport-gudauri', origin_name: 'Kutaisi Airport', city: 'kutaisi', duration_label: '~4.5 hours', zone_type: 'Airport', distance_km: 310, offers_count: 2 },
  { id: 3, slug: 'kazbegi-gudauri', origin_name: 'Kazbegi', city: 'kazbegi', duration_label: '~1 hour', zone_type: 'City', distance_km: 35, offers_count: 2 },
];

const vehicle = {
  id: 1, slug: 'toyota-camry', status: 'published', name: 'Toyota Camry', body_type: 'sedan', class_name: 'Comfort',
  seats: 3, large_bags: 3, carry_on_bags: 2, ski_capacity: 2,
  description: 'Toyota Camry — a winter-ready sedan for up to three passengers with full ski luggage.',
  card_image_url: '/assets/transfers/sedan-black-road.jpg', hero_image_url: '/assets/transfers/winter-road-peaks.jpg',
  hero_image_alt: 'Toyota Camry on a mountain road', exact_vehicle: false, sort_order: 10,
  vehicle_options: ['Winter tyres', 'Climate control', 'Child seat on request'],
  included: ['Meet & greet', 'Flight tracking', '60 min waiting', 'Ski luggage'],
  offers: [
    { id: 11, slug: 'tbilisi-toyota-camry', route_id: 1, price_amount: 180, currency: 'GEL', published: true },
    { id: 12, slug: 'kazbegi-toyota-camry', route_id: 3, price_amount: 150, currency: 'GEL', published: true },
  ],
  media: [{ type: 'image', url: '/assets/transfers/sedan-black-road.jpg', alt: 'Sedan on the road', featured: true }],
  reviewsList: [],
};

/** Matches the payload AdminPage hands the editor for “+ Новая машина”. */
const blankVehicle = {
  slug: '', status: 'draft', name: '', body_type: '', class_name: '', seats: '', large_bags: '', carry_on_bags: '',
  ski_capacity: '', description: '', card_image_url: '', hero_image_url: '', hero_image_alt: '', exact_vehicle: false,
  sort_order: '', vehicle_options: [], included: [], offers: [], media: [], reviewsList: [],
};

/** Stands in for `uploadMedia({ collection: 'transfers', file })`. */
const fakeUpload = (file) => new Promise((resolve) => {
  setTimeout(() => resolve({ url: URL.createObjectURL(file) }), 600);
});

function EditorHarness({ initial = vehicle, busy = false, dirty = false }) {
  const [value, setValue] = useState(initial);
  return <CmsTransferEditor
    value={value}
    onChange={setValue}
    onSave={() => {}}
    onPublish={() => setValue((current) => ({ ...current, status: 'published' }))}
    onDelete={() => {}}
    onBack={() => {}}
    onSignOut={() => {}}
    onNavigate={() => {}}
    onUploadMedia={fakeUpload}
    onOpenCategorySettings={() => {}}
    routes={routes}
    counts={{ instructors: 8, activities: 9, transfers: 5 }}
    busy={busy}
    dirty={dirty}
  />;
}

export default {
  title: 'Blocks/Admin/CMS Transfer Editor',
  component: CmsTransferEditor,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'CmsTransferEditor', children: ['FormField', 'Input', 'CmsEditorShell', 'MediaUploadField'] }) },
};

/** A vehicle with two priced routes — each row previews its catalog card. */
export const ExistingVehicle = { name: 'Existing Vehicle', render: () => <EditorHarness /> };

/** Only the vehicle name is required; routes are attached with a price each. */
export const NewVehicle = { name: 'New Vehicle', render: () => <EditorHarness initial={blankVehicle} /> };

/** A name alone fills class, luggage, ski capacity and description. */
export const NameOnly = { name: 'Name Only', render: () => <EditorHarness initial={{ ...blankVehicle, name: 'Hyundai Staria', body_type: 'minivan', seats: 7 }} /> };

export const UnsavedChanges = { name: 'Unsaved Changes', render: () => <EditorHarness dirty /> };
