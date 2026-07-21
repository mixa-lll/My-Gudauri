import { userEvent } from 'storybook/test';
import { SiteNavbar } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Blocks/Global/Site Navbar',
  component: SiteNavbar,
  parameters: { fullscreen: true, composition: defineComposition({ root: 'SiteNavbar' }) }
};

export const DesktopClosed = {
  render: () => <div style={{ minHeight: 360, paddingTop: 24 }}><SiteNavbar /></div>
};

export const DesktopMenuOpen = {
  render: () => <div style={{ minHeight: 720, paddingTop: 24 }}><SiteNavbar /></div>,
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('.site-nav__trigger'));
  }
};

export const LanguageMenuOpen = {
  render: () => <div style={{ minHeight: 520, paddingTop: 24 }}><SiteNavbar /></div>,
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('.site-language__trigger'));
  }
};

export const MobileClosed = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => <div style={{ minHeight: 520, paddingTop: 12 }}><SiteNavbar /></div>
};

export const MobileMenuOpen = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => <div style={{ minHeight: 780, paddingTop: 12 }}><SiteNavbar /></div>,
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('.site-nav__trigger'));
  }
};
