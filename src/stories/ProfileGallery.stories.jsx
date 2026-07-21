import { useState } from 'react';
import { Button, ProfileGallery } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';
import { INSTRUCTOR_DETAILS } from '../data/instructors';

const images = INSTRUCTOR_DETAILS.mikhail.media;

function GalleryHarness({ initialOpen = true, items = images }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [index, setIndex] = useState(0);
  return <><Button variant="primary" onClick={() => setIsOpen(true)}>Open gallery</Button><ProfileGallery images={items} index={index} instructorName="Mikhail Andreev" isOpen={isOpen} onClose={() => setIsOpen(false)} onIndexChange={setIndex} /></>;
}

export default { title: 'Components/Profile Gallery', component: ProfileGallery, parameters: { composition: defineComposition({ root: 'ProfileGallery' }) } };
export const Open = { render: () => <GalleryHarness /> };
export const Closed = { render: () => <div className="sb-canvas"><GalleryHarness initialOpen={false} /></div> };
export const SingleImage = { render: () => <GalleryHarness items={images.slice(0, 1)} /> };
