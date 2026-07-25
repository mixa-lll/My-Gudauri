import { useState } from 'react';
import { CmsInstructorEditor } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const instructor = {
  id: 1, slug: 'mikhail', status: 'draft', display_name: 'Михаил Андреев', role: 'Instructor', gender: 'male',
  card_description: 'Лыжи и сноуборд · 8 лет опыта', tagline: 'Частные уроки в Гудаури',
  intro: 'Спокойное обучение с упором на технику и уверенность на склоне.',
  card_image_url: '/assets/design-2/card-mikhail.png', hero_image_url: '/assets/design-3/hero-main.png',
  hero_image_alt: 'Михаил Андреев на склоне', booking_avatar_url: '/assets/design-3/avatar-booking.jpg',
  experience_years: 8, availability_label: 'Свободен на этой неделе', certificate_label: 'Проверенный инструктор',
  hourly_rate_gel: 345, min_hours: 2, max_hours: 12, hours_step: 2, sort_order: 10,
  disciplines: ['snowboard', 'ski'], languages: ['Ge', 'En', 'Ru'],
  about: ['Сертифицированный инструктор с восьмилетним опытом.', 'Занятия адаптируются под уровень и цели гостя.'],
  tags: ['Новички', 'Карвинг', 'Дети'],
  certifications: [{ title: 'ISIA Alpine — Level 2', level: '2019', file_url: '' }],
  media: [{ type: 'image', url: '/assets/design-3/media-1.jpg', alt: 'Урок на склоне', featured: true }],
};

function EditorHarness({ initial = instructor, busy = false }) {
  const [value, setValue] = useState(initial);
  return <CmsInstructorEditor value={value} onChange={setValue} onSave={() => {}} onPublish={() => setValue((current) => ({ ...current, status: 'published' }))} onDelete={() => {}} onBack={() => {}} onSignOut={() => {}} instructorCount={8} busy={busy} />;
}

export default { title: 'Blocks/Admin/CMS Instructor Editor', component: CmsInstructorEditor, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'CmsInstructorEditor', children: ['Badge', 'Button', 'ChoiceControls', 'FormField', 'Input'] }) } };
export const ExistingInstructor = { render: () => <EditorHarness /> };
export const NewInstructor = { render: () => <EditorHarness initial={{ ...instructor, id: undefined, slug: '', display_name: '', status: 'draft', certifications: [], media: [] }} /> };
export const Saving = { render: () => <EditorHarness busy /> };
