import './CatalogCategoryTabs.scss';

export function CatalogCategoryTabs({ categories, activeId, onChange, label = 'Browse by category', className = '' }) {
  return (
    <section className={`catalog-category-tabs ${className}`.trim()} aria-label={label}>
      <div className="catalog-category-tabs__heading">
        <p className="catalog-category-tabs__kicker">{label}</p>
        <p>Choose a direction first, then refine the results below.</p>
      </div>
      <div className="catalog-category-tabs__list" role="group" aria-label={label}>
        {categories.map((category) => {
          const isActive = activeId === category.id;

          return (
            <button
              className={isActive ? 'is-active' : ''}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(category.id)}
              key={category.id}
            >
              <span>
                <strong>{category.label}</strong>
                {category.description && <small>{category.description}</small>}
              </span>
              {typeof category.count === 'number' && <b>{category.count}</b>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
