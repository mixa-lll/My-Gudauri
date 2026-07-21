export default {
  title: 'Deprecated/Compatibility Layer',
  parameters: { controls: { disable: true } }
};

export const Buttons = {
  render: () => (
    <main className="sb-canvas">
      <section className="sb-section"><h2>Medium</h2><div className="sb-row"><button className="ui-btn-md">Outline</button><button className="ui-btn-md ui-btn-md--filled">Filled</button><button className="ui-btn-md"><span>With arrow</span><img className="ui-btn-md__arrow" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" /></button></div></section>
      <section className="sb-section"><h2>Large</h2><div className="sb-row"><button className="ui-btn-lg">Outline</button><button className="ui-btn-lg ui-btn-lg--filled">Filled</button></div></section>
      <section className="sb-section"><h2>Icon buttons</h2><div className="sb-row"><button className="ui-icon-btn" aria-label="Close" /><button className="ui-icon-btn ui-icon-btn--accent" aria-label="Close" /></div></section>
    </main>
  )
};

export const Pills = {
  render: () => <div className="sb-canvas sb-row"><span className="ui-pill-sm">Small</span><span className="ui-pill-md">Medium</span><span className="ui-pill-md ui-pill-md--active">Active</span><span className="ui-pill-md ui-pill-md--outline">Outline</span><span className="ui-pill-md ui-pill-md--soft">Soft</span><span className="ui-pill-lg">Large</span><span className="ui-pill-lg ui-pill-lg--soft">Large soft</span></div>
};

export const Stepper = {
  render: () => <div className="sb-canvas sb-row"><div className="ui-stepper"><button className="ui-stepper__btn" aria-label="Decrease" /><button className="ui-stepper__btn ui-stepper__btn--plus" aria-label="Increase" /></div><div className="ui-stepper"><button className="ui-stepper__btn ui-stepper__btn--accent" aria-label="Decrease" /><button className="ui-stepper__btn ui-stepper__btn--plus ui-stepper__btn--accent" aria-label="Increase" /></div></div>
};
