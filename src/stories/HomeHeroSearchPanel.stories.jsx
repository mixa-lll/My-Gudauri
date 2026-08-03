import { HomeHeroSearchPanel } from '../components/product';
import { defineComposition } from '../design-system/architecture/registry';

function CoverBackdrop({ children }) {
  return (
    <div
      style={{
        minHeight: 420,
        padding: '48px 32px',
        display: 'grid',
        placeItems: 'center',
        borderRadius: 20,
        background: 'linear-gradient(180deg, #33465c 0%, #0d1622 100%)'
      }}
    >
      {children}
    </div>
  );
}

export default {
  title: 'Blocks/Marketing/Home Hero Search Panel',
  component: HomeHeroSearchPanel,
  parameters: {
    composition: defineComposition({
      root: 'HomeHeroSearchPanel',
      description: 'Category tabs, up to three shared-grammar fields with value popovers and honest counts, a Show-N action and quick chips that deep-link into the catalog.'
    }),
    backgrounds: { default: 'dark' }
  }
};

export const Default = {
  render: () => (
    <CoverBackdrop>
      <HomeHeroSearchPanel />
    </CoverBackdrop>
  )
};

export const MobileSheet = {
  render: () => (
    <CoverBackdrop>
      <HomeHeroSearchPanel />
    </CoverBackdrop>
  ),
  globals: { viewport: { value: 'mobile1', isRotated: false } }
};
