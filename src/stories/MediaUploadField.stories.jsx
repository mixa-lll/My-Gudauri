import { useState } from 'react';
import { MediaUploadField } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

/** Stands in for `uploadMedia({ collection, file })` without touching the network. */
const fakeUpload = (delay = 700) => (file) => new Promise((resolve) => {
  setTimeout(() => resolve({ url: URL.createObjectURL(file) }), delay);
});

const failingUpload = () => () => Promise.reject(new Error('Файл больше 8 МБ.'));

function Harness({ initial = '', upload = fakeUpload(), ...props }) {
  const [value, setValue] = useState(initial);
  return <div className="sb-canvas" style={{ maxWidth: 560 }}>
    <MediaUploadField label="Главное фото" placeholderKind="instructor" placeholderLabel="Нино Беридзе" value={value} onChange={setValue} onUpload={upload} {...props} />
  </div>;
}

export default {
  title: 'Blocks/Admin/Media Upload Field',
  component: MediaUploadField,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'MediaUploadField', children: ['Button', 'Input', 'MediaPlaceholder'] }) },
};

/** Nothing uploaded yet — the field previews the placeholder the site will show. */
export const Empty = { render: () => <Harness /> };

export const WithImage = { name: 'With Image', render: () => <Harness initial="/assets/design-2/card-mikhail.png" /> };

/** A stored path that no longer resolves falls back to the placeholder and says so. */
export const BrokenFile = { name: 'Broken File', render: () => <Harness initial="/assets/missing/photo.jpg" /> };

export const UploadFailed = { name: 'Upload Failed', render: () => <Harness upload={failingUpload()} /> };

export const Landscape = { render: () => <Harness shape="landscape" label="Обложка страницы" /> };

export const Square = { render: () => <Harness shape="square" label="Аватар в бронировании" /> };

export const Disabled = { render: () => <Harness initial="/assets/design-2/card-mikhail.png" disabled /> };

/** Collections that only accept externally hosted files can hide the picker. */
export const UrlOnly = { name: 'URL Only', render: () => <Harness upload={undefined} /> };
