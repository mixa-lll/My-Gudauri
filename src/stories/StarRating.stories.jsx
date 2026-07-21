import { StarRating } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Primitives/Star Rating',
  component: StarRating,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'StarRating' }) },
  args: { value: 4.8, max: 5, size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
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
