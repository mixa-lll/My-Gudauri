export function Slot({ name, optional = false, children }) {
  return (
    <section className={`sb-template-slot ${optional ? 'is-optional' : 'is-required'}`}>
      <header><strong>{name}</strong><span>{optional ? 'Optional' : 'Required'}</span></header>
      {children}
    </section>
  );
}

export function Contract({ contract }) {
  return (
    <aside className="sb-template-contract">
      <h2>{contract.name} contract</h2>
      <dl>
        <div><dt>Required</dt><dd>{contract.required.join(' → ')}</dd></div>
        <div><dt>Optional</dt><dd>{contract.optional.join(', ')}</dd></div>
        <div><dt>Allowed order</dt><dd>{contract.order.join(' → ')}</dd></div>
        <div><dt>Data source</dt><dd>{contract.dataSource}</dd></div>
        <div><dt>Allowed children</dt><dd>{contract.allowedChildren.join(', ')}</dd></div>
        <div><dt>Content limits</dt><dd>{contract.contentLimits}</dd></div>
        <div><dt>Desktop/mobile</dt><dd>{contract.responsive}</dd></div>
        <div><dt>States</dt><dd>{contract.states.join(', ')}</dd></div>
        <div><dt>Named variants</dt><dd>{contract.variants.join(', ')}</dd></div>
      </dl>
    </aside>
  );
}
