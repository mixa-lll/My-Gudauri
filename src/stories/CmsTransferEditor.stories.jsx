import { useState } from 'react';
import { CmsTransferEditor } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const transfer = {
  id: 1, slug: 'tbilisi-airport-gudauri', status: 'published', name: 'Sedan · up to 3 seats',
  category: 'Gudauri ↔ Tbilisi Airport', description: 'A private car with a winter-ready driver, door to door, flight tracked on arrival.',
  card_image_url: '/assets/design-1/mosaic/transfer-1-144-upd.png', hero_image_url: '/assets/design-1/mosaic/transfer-1-144-upd.png',
  hero_image_alt: 'Gudauri ↔ Tbilisi Airport', price_amount: 180, currency: 'GEL', price_suffix: 'per vehicle',
  rating: 4.9, review_count: 128, catalog_group: 'tbilisi', vehicle_class: 'Comfort', seats: 3,
  duration_label: '~2 hours', pickup_type: 'airport', sort_order: 10,
  tags: ['~2 hours', 'Meet & greet', 'Ski rack'],
  facts: [{ label: 'Class', value: 'Comfort' }, { label: 'Seats', value: 'Up to 3' }, { label: 'Journey', value: '~2 hours' }],
  included: ['Meet & greet', 'Flight tracking', '60 min waiting', 'Ski luggage'],
  media: [{ type: 'image', url: '/assets/design-1/mosaic/transfer-1-144-upd.png', alt: 'Transfer car', featured: true }],
  reviewsList: [],
};

/** Matches the payload AdminPage hands the editor for “+ Новый трансфер”. */
const blankTransfer = {
  slug: '', status: 'draft', name: '', category: '', description: '', card_image_url: '', hero_image_url: '',
  hero_image_alt: '', price_amount: '', currency: '', price_suffix: '', rating: 0, review_count: 0,
  catalog_group: '', vehicle_class: '', seats: '', duration_label: '', pickup_type: '', sort_order: '',
  tags: [], facts: [], included: [], media: [], reviewsList: [],
};

/** Stands in for `uploadMedia({ collection: 'transfers', file })`. */
const fakeUpload = (file) => new Promise((resolve) => {
  setTimeout(() => resolve({ url: URL.createObjectURL(file) }), 600);
});

function EditorHarness({ initial = transfer, busy = false, dirty = false }) {
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
    counts={{ instructors: 8, activities: 9, transfers: 6 }}
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

export const ExistingTransfer = { name: 'Existing Transfer', render: () => <EditorHarness /> };

/** Only the name is required — the route follows from the chosen city. */
export const NewTransfer = { name: 'New Transfer', render: () => <EditorHarness initial={blankTransfer} /> };

/** A name and a city are enough: slug, route, alt and description follow. */
export const NameAndCity = { name: 'Name And City', render: () => <EditorHarness initial={{ ...blankTransfer, name: 'Минивэн · до 7 мест', catalog_group: 'kutaisi' }} /> };

export const UnsavedChanges = { name: 'Unsaved Changes', render: () => <EditorHarness dirty /> };
