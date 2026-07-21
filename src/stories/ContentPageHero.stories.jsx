import { Badge, ContentPageHero, MediaPlaceholder } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Blocks/Marketing/Content Page Hero',
  component: ContentPageHero,
  parameters: { fullscreen: true, composition: defineComposition({ root: 'ContentPageHero' }) }
};

export const WithoutMedia = {
  args: {
    kicker: 'Contact My Gudauri',
    title: 'Here when you need a local answer.',
    description: 'Questions about a service, a booking or cooperation? Contact the My Gudauri team directly.',
    status: <Badge tone="success">Working locally in Gudauri, Georgia</Badge>
  }
};

export const WithMedia = {
  args: {
    kicker: 'Greater Caucasus · Georgia',
    title: 'About Gudauri',
    description: 'A high-mountain resort with open alpine terrain, broad views and direct road access from Tbilisi.',
    media: <MediaPlaceholder label="Gudauri panorama" />
  }
};
