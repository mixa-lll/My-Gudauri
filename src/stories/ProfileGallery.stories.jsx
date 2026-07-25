import { useState } from 'react';
import { Button, ObjectMediaGallery } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';
import { INSTRUCTOR_DETAILS } from '../data/instructors';

const images = INSTRUCTOR_DETAILS.mikhail.media;

function GalleryHarness({ initialOpen = true, items = images }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [index, setIndex] = useState(0);
  return <><Button variant="primary" onClick={() => setIsOpen(true)}>Open gallery</Button><ObjectMediaGallery images={items} index={index} objectName="Mikhail Andreev" objectLabel="Instructor media" isOpen={isOpen} onClose={() => setIsOpen(false)} onIndexChange={setIndex} /></>;
}

export default { title: 'Components/Object Media Gallery', component: ObjectMediaGallery, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'ObjectMediaGallery' }) } };
export const Open = { render: () => <GalleryHarness /> };
export const Closed = { render: () => <div className="sb-canvas"><GalleryHarness initialOpen={false} /></div> };
export const SingleImage = { render: () => <GalleryHarness items={images.slice(0, 1)} /> };
