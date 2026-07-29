import { useState } from 'react';
import { CmsActivityEditor } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const activity = {
  id: 4, slug: 'snowmobile-plateau', status: 'published', name: 'Snowmobile tour to the plateau',
  category: 'Snowmobile tours', description: 'A guided ride across the Gudauri plateau with stops at the best viewpoints.',
  card_image_url: '/assets/design-1/mosaic/tours-1-117-upd.png', hero_image_url: '/assets/design-1/hero-gudauri-panorama.jpg',
  hero_image_alt: 'Snowmobile on the Gudauri plateau', price_amount: 350, currency: 'GEL', price_suffix: 'per guest',
  rating: 4.8, review_count: 12, catalog_group: 'snowmobile-tours', skill_level: 'beginner', duration_group: 'half-day', format: 'group', sort_order: 20,
  tags: ['Transfer', 'Guide'],
  facts: [{ label: 'Duration', value: '2 hours' }, { label: 'Highest point', value: '2 450 m' }, { label: 'Difficulty', value: '2' }],
  included: ['Local guide', 'Snowmobile rental'], excluded: ['Personal insurance'], equipment: ['Warm waterproof layers'],
  schedule: [{ time: '10:00', title: 'Meeting point', description: 'Gudauri centre' }, { time: '10:30', title: 'Ride to the plateau', description: '' }],
  media: [{ type: 'image', url: '/assets/design-1/mosaic/tours-1-117-upd.png', alt: 'Snowmobile', featured: true }],
  reviewsList: [],
};

/** Matches the payload AdminPage hands to the editor when “+ Новая активность” is pressed. */
const blankActivity = {
  slug: '', status: 'draft', name: '', category: '', description: '', card_image_url: '', hero_image_url: '',
  hero_image_alt: '', price_amount: '', currency: '', price_suffix: '', rating: 0, review_count: 0,
  catalog_group: '', skill_level: '', duration_group: '', format: '', sort_order: '',
  tags: [], facts: [], included: [], excluded: [], equipment: [], schedule: [], media: [], reviewsList: [],
};

/** Stands in for `uploadMedia({ collection: 'activities', file })`. */
const fakeUpload = (file) => new Promise((resolve) => {
  setTimeout(() => resolve({ url: URL.createObjectURL(file) }), 600);
});

function EditorHarness({ initial = activity, busy = false, dirty = false }) {
  const [value, setValue] = useState(initial);
  return <CmsActivityEditor
    value={value}
    onChange={setValue}
    onSave={() => {}}
    onPublish={() => setValue((current) => ({ ...current, status: 'published' }))}
    onDelete={() => {}}
    onBack={() => {}}
    onSignOut={() => {}}
    onNavigate={() => {}}
    onUploadMedia={fakeUpload}
    counts={{ instructors: 8, activities: 6 }}
    busy={busy}
    dirty={dirty}
  />;
}

export default {
  title: 'Blocks/Admin/CMS Activity Editor',
  component: CmsActivityEditor,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'CmsActivityEditor', children: ['Button', 'FormField', 'Input', 'CmsEditorShell', 'MediaUploadField'] }) },
};

export const ExistingActivity = { render: () => <EditorHarness /> };

/** Only “Название” is required — every other field previews what will be stored. */
export const NewActivity = { name: 'New Activity', render: () => <EditorHarness initial={blankActivity} /> };

/** A name alone is enough for a draft: slug, category and description follow from it. */
export const NameOnly = { name: 'Name Only', render: () => <EditorHarness initial={{ ...blankActivity, name: 'Прогулка на снегоходах' }} /> };

export const UnsavedChanges = { name: 'Unsaved Changes', render: () => <EditorHarness dirty /> };

export const Saving = { render: () => <EditorHarness busy /> };
