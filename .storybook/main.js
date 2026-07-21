/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx)', '../src/**/*.mdx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  staticDirs: [
    { from: '../assets', to: '/assets' },
    { from: '../public', to: '/' }
  ],
  docs: {
    autodocs: 'tag'
  }
};

export default config;
