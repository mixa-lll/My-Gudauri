import { useState } from 'react';
import { CmsInstructorEditor } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const instructor = {
  id: 1, slug: 'mikhail', status: 'draft', display_name: 'Михаил Андреев', role: 'Instructor', gender: 'male',
  card_description: 'Ski & snowboard · 8 years experience', tagline: 'Private lessons in Gudauri',
  intro: 'Calm, technique-focused coaching for first turns and confident carving.',
  card_image_url: '/assets/design-2/card-mikhail.png', hero_image_url: '/assets/design-3/hero-main.png',
  hero_image_alt: 'Mikhail Andreev on a ski slope', booking_avatar_url: '/assets/design-3/avatar-booking.jpg',
  experience_years: 8, availability_label: 'Available this week', certificate_label: 'Verified Instructor',
  hourly_rate_gel: 345, min_hours: 2, max_hours: 12, hours_step: 2, min_people: 1, max_people: 6, sort_order: 10,
  price_round_to: 5,
  price_tiers: {
    duration: [{ from: 1, percent: 0 }, { from: 4, percent: 8 }, { from: 8, percent: 15 }],
    participants: [{ from: 2, percent: 35 }, { from: 3, percent: 25 }, { from: 5, percent: 15 }],
  },
  disciplines: ['snowboard', 'ski'], languages: ['Ge', 'En', 'Ru'],
  about: ['Сертифицированный инструктор с восьмилетним опытом.', 'Занятия адаптируются под уровень и цели гостя.'],
  tags: ['Новички', 'Карвинг', 'Дети'],
  certifications: [{ title: 'ISIA Alpine — Level 2', level: '2019', file_url: '' }],
  media: [{ type: 'image', url: '/assets/design-3/media-1.jpg', alt: 'Урок на склоне', featured: true }],
};

/** Matches the payload AdminPage hands to the editor when “+ Новый инструктор” is pressed. */
const blankInstructor = {
  slug: '', status: 'draft', display_name: '', role: '', card_description: '', tagline: '', intro: '',
  card_image_url: '', hero_image_url: '', hero_image_alt: '', booking_avatar_url: '', gender: '',
  experience_years: '', rating: 0, review_count: 0, availability_label: '', certificate_label: '',
  hourly_rate_gel: '', min_hours: '', max_hours: '', hours_step: '', min_people: '', max_people: '',
  default_hours: '', default_people: '', price_round_to: '', price_tiers: {}, sort_order: '',
  disciplines: [], languages: [], about: [], tags: [], certifications: [], media: [], reviewsList: [],
};

/** Stands in for `uploadMedia({ collection: 'instructors', file })`. */
const fakeUpload = (file) => new Promise((resolve) => {
  setTimeout(() => resolve({ url: URL.createObjectURL(file) }), 600);
});

function EditorHarness({ initial = instructor, busy = false, dirty = false }) {
  const [value, setValue] = useState(initial);
  return <CmsInstructorEditor value={value} onChange={setValue} onSave={() => {}} onPublish={() => setValue((current) => ({ ...current, status: 'published' }))} onDelete={() => {}} onBack={() => {}} onSignOut={() => {}} onUploadMedia={fakeUpload} instructorCount={8} busy={busy} dirty={dirty} />;
}

export default { title: 'Blocks/Admin/CMS Instructor Editor', component: CmsInstructorEditor, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'CmsInstructorEditor', children: ['Badge', 'Button', 'ChoiceControls', 'FormField', 'Input', 'MediaPlaceholder', 'MediaUploadField'] }) } };

export const ExistingInstructor = { render: () => <EditorHarness /> };

/** Only “Имя” is required — every other field previews the value that will be stored. */
export const NewInstructor = { render: () => <EditorHarness initial={blankInstructor} /> };

/** A name alone is enough to save a draft: slug, texts and images are derived from it. */
export const NameOnly = { name: 'Name Only', render: () => <EditorHarness initial={{ ...blankInstructor, display_name: 'Нино Беридзе', disciplines: ['ski'], experience_years: 7 }} /> };

export const UnsavedChanges = { name: 'Unsaved Changes', render: () => <EditorHarness dirty /> };

export const Saving = { render: () => <EditorHarness busy /> };
