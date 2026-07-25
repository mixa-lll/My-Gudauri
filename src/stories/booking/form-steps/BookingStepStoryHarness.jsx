import { useState } from 'react';
import {
  BookingFormSection,
  BookingRequestSummary,
  Button,
  Surface,
} from '../../../design-system';
import { defineComposition } from '../../../design-system/architecture/registry';
import {
  BOOKING_STEP_REGISTRY,
  createBookingOffer,
  createInitialBookingAnswers,
  getBookingFlowDefinition,
  getBookingStepPresentation,
} from '../../../features/booking';

export const STORY_OBJECTS = {
  instructor: { id: 'instructor:storybook', slug: 'mikhail', name: 'Mikhail Andreev', typeLabel: 'Private instructor', image: '/assets/design-3/avatar-booking.jpg' },
  activity: { id: 'activity:storybook', slug: 'freeride-day', name: 'Freeride day', typeLabel: 'Mountain activity' },
};

function StoryStep({ config, mode }) {
  const definition = getBookingFlowDefinition(config.category);
  const offer = createBookingOffer({ definition, object: config.object, basePrice: config.basePrice });
  const [answers, setAnswers] = useState(() => createInitialBookingAnswers(definition, config.answers));
  const update = (key, value) => setAnswers((current) => ({ ...current, [key]: value }));
  const contract = BOOKING_STEP_REGISTRY[config.stepId];
  const presentation = getBookingStepPresentation(config.stepId, { definition, answers, currentStep: 0, stepIndex: 0 });

  if (mode === 'collapsed') {
    return <div style={{ maxWidth: 820 }}>
      <BookingFormSection compact stepNumber={1} title={presentation.label} summary={presentation.compactSummary} onEdit={() => {}} />
    </div>;
  }

  if (mode === 'summary') {
    return <div style={{ maxWidth: 407 }}>
      {presentation.summaryRows.length
        ? <BookingRequestSummary title="Sticky summary contribution" rows={presentation.summaryRows} totalLabel={null} />
        : <Surface padding="md"><strong>No sticky-summary row</strong><p>This step validates or confirms the request, while totals remain owned by the summary block.</p></Surface>}
    </div>;
  }

  const StepComponent = contract.Component;
  return <div style={{ maxWidth: 980 }}>
    <StepComponent
      answers={answers}
      update={update}
      definition={definition}
      offer={offer}
      stepNumber={1}
      error=""
      actions={<div className="booking-request-flow__actions booking-request-flow__actions--forward-only"><Button variant="accent">Next →</Button></div>}
    />
  </div>;
}

export function stepMeta(config) {
  return {
    title: `Blocks/Booking/Form Steps/${config.title}`,
    component: BOOKING_STEP_REGISTRY[config.stepId].Component,
    tags: ['autodocs'],
    parameters: {
      controls: { disable: true },
      composition: defineComposition({ root: 'BookingFormSection' }),
      docs: {
        description: {
          component: `${config.description} This production step contract owns its expanded content, collapsed summary and sticky-summary contribution.`,
        },
      },
    },
  };
}

export const expandedStory = (config) => ({
  name: 'Expanded',
  render: () => <StoryStep config={config} mode="expanded" />,
});

export const collapsedStory = (config) => ({
  name: 'Collapsed',
  render: () => <StoryStep config={config} mode="collapsed" />,
});

export const summaryStory = (config) => ({
  name: 'Sticky Summary Rows',
  parameters: { composition: defineComposition({ root: 'BookingRequestSummary' }) },
  render: () => <StoryStep config={config} mode="summary" />,
});
