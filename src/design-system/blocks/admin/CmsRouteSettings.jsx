import { useState } from 'react';
import { Button, Checkbox, FormField, Input, Textarea } from '../../../components';
import { validateRoutes } from '../../../shared/transferDefaults';
import { toSlug } from '../../../shared/slug';
import { CmsAdminRail, FieldGroup, Repeater } from './CmsEditorParts';
// The routes screen shares the settings shell visual language.
import './CmsCategorySettings.scss';

/**
 * Direction info blocks for the transfer category, in one place.
 *
 * A direction — «Гудаури ↔ Тбилиси» — owns its journey time, distance and the
 * road notice every card of that direction shows. Vehicles only reference the
 * direction and attach a price, so renaming or retiring one here updates every
 * card at once. Retiring a direction with cards takes those cards down.
 */
export function CmsRouteSettings({
  value = [],
  onChange,
  onSave,
  onBack,
  onNavigate,
  onSignOut,
  counts,
  busy = false,
  dirty = false,
}) {
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validateRoutes(value) : {};
  const cardsTotal = value.reduce((sum, route) => sum + (route.offers_count ?? 0), 0);

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateRoutes(value)).length) return;
    onSave();
  };

  const removeRoute = (route, remove) => {
    const used = route.offers_count ?? 0;
    if (used > 0 && !window.confirm(`Направление «${route.origin_name}» использует ${used} карточек — при сохранении они будут удалены. Убрать направление?`)) return;
    remove();
  };

  return <section className="cms-category-settings" aria-label="Настройки категории: Трансферы">
    <CmsAdminRail active="transfers" counts={counts} onNavigate={onNavigate} onSignOut={onSignOut} />

    <form className="cms-category-settings__main" onSubmit={submit} noValidate>
      <header className="cms-category-settings__header">
        <button className="cms-category-settings__breadcrumb" type="button" onClick={onBack}>Трансферы</button>
        <span aria-hidden="true">/</span><strong>Настройки категории</strong>
        {dirty ? <span className="cms-category-settings__dirty">Есть несохранённые правки</span> : null}
        <div className="cms-category-settings__header-actions">
          <Button variant="accent" type="submit" loading={busy} loadingLabel="Сохранение">Сохранить</Button>
        </div>
      </header>

      <div className="cms-category-settings__content">
        <section className="cms-category-settings__summary">
          <span className="cms-category-settings__kicker">Категория</span>
          <h1>Трансферы · направления</h1>
          <p>
            Направление — это информационный блок «Гудаури ↔ город»: время в пути, расстояние и заметка о дороге.
            Сейчас направлений {value.length}, карточек на них — {cardsTotal}. Изменения применяются ко всем карточкам направления сразу.
          </p>
        </section>

        <FieldGroup
          feeds="TransferRoutes"
          title="Направления"
          description="Машины подключаются к направлениям в своих карточках — здесь только информация самого маршрута."
        >
          <Repeater
            className="cms-route-settings__route"
            value={value}
            onChange={onChange}
            addLabel="+ Добавить направление"
            blank={{ origin_name: '', city: '', duration_label: '', distance_km: '', road_notice: '', published: true, offers_count: 0 }}
            renderRow={({ item, index, update, remove }) => <>
              <div className="cms-route-settings__route-head">
                <FormField label="Пункт направления" required error={errors[`route-${index}`]} hint="Второй конец маршрута — Гудаури всегда первый.">
                  <Input value={item.origin_name ?? ''} placeholder="Tbilisi Airport" onChange={(event) => update({ origin_name: event.target.value })} />
                </FormField>
                <FormField label="Ключ направления" hint={String(item.city ?? '').trim() ? 'Определяет вкладку в панели направлений.' : `Пусто — возьмём «${toSlug(String(item.origin_name ?? '').split(' ')[0]) || '…'}».`}>
                  <Input value={item.city ?? ''} placeholder="tbilisi" onChange={(event) => update({ city: event.target.value })} />
                </FormField>
                <FormField label="Время в пути"><Input value={item.duration_label ?? ''} placeholder="~2 hours" onChange={(event) => update({ duration_label: event.target.value })} /></FormField>
                <FormField label="Расстояние, км"><Input type="number" min="1" step="1" value={item.distance_km ?? ''} placeholder="120" onChange={(event) => update({ distance_km: event.target.value })} /></FormField>
              </div>
              <FormField label="Заметка о дороге" hint="Показывается на каждой карточке направления.">
                <Textarea rows={2} value={item.road_notice ?? ''} placeholder="Journey time can change with traffic and winter road conditions." onChange={(event) => update({ road_notice: event.target.value })} />
              </FormField>
              <div className="cms-route-settings__route-foot">
                <Checkbox label="Показывать направление" checked={item.published !== false} onChange={(event) => update({ published: event.target.checked })} />
                <span className="cms-route-settings__route-usage">{(item.offers_count ?? 0) > 0 ? `Карточек: ${item.offers_count}` : 'Пока без карточек'}</span>
                <Button variant="ghost" size="sm" onClick={() => removeRoute(item, remove)}>Убрать направление</Button>
              </div>
            </>}
          />
        </FieldGroup>

        <div className="cms-category-settings__footer-actions">
          <Button variant="accent" type="submit" loading={busy}>Сохранить настройки</Button>
          <Button variant="secondary" type="button" onClick={onBack} disabled={busy}>Назад к списку</Button>
        </div>
      </div>
    </form>
  </section>;
}
