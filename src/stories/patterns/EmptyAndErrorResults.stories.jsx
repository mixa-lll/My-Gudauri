import { EmptyAndErrorResults, EmptyState, ErrorState, LoadingState } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default {
  title: 'Patterns/Empty and Error Results',
  component: EmptyAndErrorResults,
  parameters: { controls: { disable: true }, composition: defineComposition({ root: 'EmptyAndErrorResults' }) },
};

export const Default = {
  render: () => (
    <main className="sb-canvas sb-section">
      <EmptyAndErrorResults state="loading" loading={<LoadingState />} />
      <EmptyAndErrorResults state="empty" empty={<EmptyState />} />
      <EmptyAndErrorResults state="error" error={<ErrorState />} />
    </main>
  ),
};
