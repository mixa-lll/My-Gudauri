import { StarRating } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Primitives/Star Rating',
  component: StarRating,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'StarRating' }) },
  args: { value: 4.8, max: 5, size: 'md', tone: 'neutral' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: ['neutral', 'accent'] },
    decorative: { control: 'boolean' },
  },
};

export const Playground = {};

export const RatingStates = {
  render: () => (
    <div className="sb-canvas sb-row">
      <StarRating value={5} size="md" />
      <StarRating value={4.8} size="md" />
      <StarRating value={3.4} size="md" />
      <StarRating value={0} size="md" />
    </div>
  ),
};

export const Tones = {
  render: () => (
    <div className="sb-canvas sb-row">
      <StarRating value={4.8} size="md" tone="neutral" />
      <StarRating value={4.8} size="md" tone="accent" />
      <StarRating value={3.4} size="lg" tone="accent" />
    </div>
  ),
};
