import './CatalogCategoryTabs.scss';

export function CategoryTab({ category, active = false, onSelect }) {
  return (
    <button className={active ? 'is-active' : ''} type="button" aria-pressed={active} onClick={() => onSelect(category.id)}>
      <span><strong>{category.label}</strong>{category.description ? <small>{category.description}</small> : null}</span>
      {typeof category.count === 'number' ? <b aria-label={`${category.count} results`}>{category.count}</b> : null}
    </button>
  );
}

export function CatalogCategoryTabs({ categories, activeId, onChange, label = 'Browse by category', className = '' }) {
  return (
    <section className={`catalog-category-tabs ${className}`.trim()} aria-label={label}>
      <div className="catalog-category-tabs__heading">
        <p className="catalog-category-tabs__kicker">{label}</p>
        <p>Choose a direction first, then refine the results below.</p>
      </div>
      <div className="catalog-category-tabs__list" role="group" aria-label={label}>
        {categories.map((category) => <CategoryTab key={category.id} category={category} active={activeId === category.id} onSelect={onChange} />)}
      </div>
    </section>
  );
}
