import { Button, SectionHeading } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const meta = {
  title: 'Components/Section Heading',
  component: SectionHeading,
  parameters: { composition: defineComposition({ root: 'SectionHeading' }) },
  args: {
    kicker: 'Local knowledge',
    title: 'Plan a better Gudauri stay',
    description: 'Clear local information, trusted providers and practical guidance in one place.',
    size: 'lg',
    align: 'start',
    headingLevel: 'h2'
  },
  argTypes: {
    size: { control: 'select', options: ['display', 'lg', 'md', 'sm'] },
    align: { control: 'select', options: ['start', 'center'] },
    headingLevel: { control: 'select', options: ['h1', 'h2', 'h3'] }
  }
};

export default meta;
export const Playground = {};

export const Sizes = {
  render: () => <main className="sb-canvas">{['display', 'lg', 'md', 'sm'].map((size) => <section className="sb-section" key={size}><SectionHeading kicker={`${size} heading`} title="Explore Gudauri with confidence" description="A reusable section heading with optional supporting copy." size={size} /></section>)}</main>
};

export const LocalizedDisplayStress = {
  render: () => <main className="sb-canvas sb-section"><SectionHeading headingLevel="h1" size="display" kicker="Контакты My Gudauri" title="Местный ответ, когда он вам нужен." description="Проверка переноса длинного заголовка и читаемого интервала на русском языке." /><SectionHeading headingLevel="h1" size="display" kicker="გუდაური · საქართველო" title="ადგილობრივი პასუხი, როცა გჭირდებათ." description="ქართული ტექსტის სიგრძისა და სტრიქონებს შორის მანძილის შემოწმება." /></main>
};

export const Alignments = {
  render: () => <main className="sb-canvas">{['start', 'center'].map((align) => <section className="sb-section" key={align}><SectionHeading kicker={align} title="Mountain essentials" size="md" align={align} /></section>)}</main>
};

export const WithActions = { render: () => <SectionHeading kicker="Optional actions" title="Plan with confidence" description="Actions are a named slot in the component anatomy." actions={<><Button>Start planning</Button><Button variant="secondary">Learn more</Button></>} /> };

export const OptionalContent = {
  render: () => <main className="sb-canvas"><section className="sb-section"><SectionHeading title="Title only" size="md" /></section><section className="sb-section"><SectionHeading kicker="Frequently asked" title="With kicker" size="md" /></section><section className="sb-section"><SectionHeading title="With description" description="Description can be supplied independently from the kicker." size="md" /></section></main>
};
