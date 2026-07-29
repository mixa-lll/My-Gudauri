import { useEffect, useId, useRef, useState } from 'react';
import { Button, FieldMessage, Input, MediaPlaceholder } from '../../../components';
import { cn } from '../../../utils/cn';
import { downscaleImage } from '../../../utils/downscaleImage';
import './MediaUploadField.scss';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/gif';
const SHAPES = ['portrait', 'landscape', 'square'];

const isBlank = (value) => !String(value ?? '').trim();

/**
 * Drop-in image field for any CMS editor.
 *
 * The block stays presentational: it never talks to the API itself, it calls
 * the `onUpload` and `onRemove` callbacks the host page provides. That keeps
 * instructors, activities and future collections on one component while each
 * page decides where its files are stored.
 */
export function MediaUploadField({
  label,
  value,
  onChange,
  onUpload,
  onRemove,
  hint,
  error,
  shape = 'portrait',
  placeholderKind = 'generic',
  placeholderLabel,
  disabled = false,
  allowUrl = true,
}) {
  if (!SHAPES.includes(shape)) throw new Error(`MediaUploadField: unknown shape “${shape}”.`);
  const inputId = useId();
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [broken, setBroken] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => setBroken(false), [value]);

  const accept = async (file) => {
    if (!file || !onUpload) return;
    setFailure('');
    setBusy(true);
    try {
      const prepared = await downscaleImage(file);
      const uploaded = await onUpload(prepared);
      const nextUrl = typeof uploaded === 'string' ? uploaded : uploaded?.url;
      if (!nextUrl) throw new Error('Сервис не вернул ссылку на файл.');
      const previous = value;
      onChange(nextUrl);
      if (previous && previous !== nextUrl) onRemove?.(previous);
    } catch (uploadError) {
      setFailure(uploadError.message || 'Не удалось загрузить файл.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const clear = () => {
    const previous = value;
    onChange('');
    setFailure('');
    if (previous) onRemove?.(previous);
  };

  const drop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (disabled || busy) return;
    accept(event.dataTransfer.files?.[0]);
  };

  const message = failure || error;
  const showsPlaceholder = isBlank(value) || broken;

  return <div className={cn('media-upload-field', disabled && 'is-disabled', message && 'is-invalid')}>
    <span className="media-upload-field__label" id={`${inputId}-label`}>{label}</span>

    <div className="media-upload-field__body">
      <div
        className={cn('media-upload-field__drop', dragging && 'is-dragging', busy && 'is-busy')}
        data-shape={shape}
        onDragOver={(event) => { event.preventDefault(); if (!disabled && !busy) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
      >
        {showsPlaceholder
          ? <MediaPlaceholder compact kind={placeholderKind} label={placeholderLabel || label} />
          : <img src={value} alt="" onError={() => setBroken(true)} />}
        {busy ? <span className="media-upload-field__progress" role="status">Загружаем…</span> : null}
      </div>

      <div className="media-upload-field__controls">
        <p className="media-upload-field__hint">
          {broken && !isBlank(value)
            ? 'Файл не открывается — на сайте покажем заглушку.'
            : isBlank(value)
              ? (hint ?? 'Перетащите фото сюда или выберите файл. Пусто — покажем заглушку.')
              : 'Фото загружено. Его можно заменить или убрать.'}
        </p>

        <input
          ref={fileRef}
          id={inputId}
          className="media-upload-field__input"
          type="file"
          accept={ACCEPT}
          disabled={disabled || busy || !onUpload}
          aria-labelledby={`${inputId}-label`}
          onChange={(event) => accept(event.target.files?.[0])}
        />

        <div className="media-upload-field__actions">
          <Button variant="secondary" size="md" disabled={disabled || busy || !onUpload} onClick={() => fileRef.current?.click()}>
            {isBlank(value) ? 'Выбрать файл' : 'Заменить'}
          </Button>
          {isBlank(value) ? null : <Button variant="ghost" size="md" disabled={disabled || busy} onClick={clear}>Убрать</Button>}
          {allowUrl ? <Button variant="ghost" size="md" aria-expanded={showUrl} onClick={() => setShowUrl((current) => !current)}>
            {showUrl ? 'Скрыть ссылку' : 'Указать ссылку'}
          </Button> : null}
        </div>

        {allowUrl && showUrl
          ? <Input
            className="media-upload-field__url"
            value={value ?? ''}
            placeholder="/assets/instructors/photo.jpg или https://…"
            aria-label={`${label} — ссылка`}
            disabled={disabled || busy}
            onChange={(event) => onChange(event.target.value)}
          />
          : null}

        {message ? <FieldMessage tone="error">{message}</FieldMessage> : null}
      </div>
    </div>
  </div>;
}
