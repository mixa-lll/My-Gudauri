import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../src/i18n/LanguageContext';
import '../src/styles/globals.scss';
import '../src/styles/SystemCompat.scss';
import '../src/styles/page-polish.scss';
import '../src/stories/storybook.scss';

const preview = {
  decorators: [
    (Story, context) => (
      <MemoryRouter initialEntries={[context.parameters.route ?? '/']}>
        <LanguageProvider>
          <div className={context.parameters.fullscreen ? 'sb-stage sb-stage--fullscreen' : 'sb-stage'}>
            <Story />
          </div>
        </LanguageProvider>
      </MemoryRouter>
    )
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      test: 'error'
    },
    options: {
      storySort: {
        order: ['Foundations', 'Primitives', 'Components', 'Blocks', ['Global', 'Catalog', 'Detail', 'Editorial', 'Marketing'], 'Patterns', 'CMS Templates', 'Deprecated', 'Design System', ['Architecture', 'Composition', 'Design QA'], 'Product Stories']
      }
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#f6f6f3' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#20211e' }
      ]
    }
  },
  tags: ['autodocs']
};

export default preview;
