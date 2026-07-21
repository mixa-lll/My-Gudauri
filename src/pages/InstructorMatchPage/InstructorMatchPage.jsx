import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, FilterChip, SiteNavbar } from '../../design-system';
import { useLanguage } from '../../i18n/LanguageContext';
import { createInstructorRequest } from '../../services/instructorRequestsApi';
import './InstructorMatchPage.scss';

const SLOT_OPTIONS = [
  { id: 'morning', label: '10–12' },
  { id: 'midday', label: '12:30–14:30' },
  { id: 'afternoon', label: '15–17' }
];

const COPY = {
  en: {
    pageTitle: 'Personal instructor matching — My Gudauri', back: 'Back', title: 'Request a lesson', titleStrong: "we'll match an instructor",
    steps: ['When would you like to go?', 'Company', 'What are you into', 'Contact details'],
    dateHelp: 'Choose your preferred days. Exact time is optional — the operator will suggest suitable slots and check the weather.',
    startDate: 'First date', endDate: 'Last date', dateInputHint: 'Choose the first and last day — the calendar will mark the whole range.',
    addTime: '+ Add time', optional: 'optional', collapse: '− Collapse', timePerDay: 'Time per day', day: 'Day', slot: 'slot', slotHint: 'Select or remove a slot. × removes a day from your request.',
    next: 'Next', edit: 'Edit ↗', who: "Who's coming", company: { Family: 'Family', Friends: 'Friends', Solo: 'Solo' },
    participants: 'Participants', kids: 'Kids under 12', languages: 'Languages the instructor should speak', languageLabels: { Russian: 'Russian', English: 'English', Georgian: 'Georgian' },
    activity: 'Activity', activities: { Ski: 'Winter sports', Sightseeing: 'Sightseeing', Freeride: 'Freeride', Snowboard: 'Snowboard' },
    pace: 'Pace', paces: { Relaxed: 'Relaxed', Medium: 'Medium', Adrenaline: 'Adrenaline' }, skill: 'Skill level (average)',
    skills: { Beginner: 'Beginner', Intermediate: 'Intermediate', Advanced: 'Advanced' }, budget: 'Budget per person',
    budgets: { Economy: 'Economy', 'Mid-range': 'Medium', Premium: 'Premium' }, notes: 'Anything else', notesHint: 'goals, kids, equipment', notesPlaceholder: '2 beginners and a child, rental needed',
    contactHelp: 'Where should the operator send the confirmed option?', name: 'Contact name', phone: 'Phone number', email: 'Email', emailHint: 'confirmation goes here', messenger: 'Preferred messenger',
    privacy: 'Payment happens after confirmation. The operator replies within an hour to confirm the instructor, weather and meeting point.', send: 'Send request', sending: 'Sending…',
    summary: 'Your request', dates: 'Dates', people: 'People', preferences: 'Preferences', contact: 'Contact', timeMissing: 'time not specified',
    pricePending: 'Price will be confirmed by the operator', priceWait: 'Price appears after hours and participants', priceFor: 'for selected hours',
    success: 'Your request is sent', requestId: 'Request ID', saveId: 'Save your request ID — it is useful if you contact support.', nextTitle: 'What happens next',
    nextItems: ['The operator selects an instructor and program for your request.', 'We contact you within an hour and confirm the weather and meeting point.', 'You receive a secure prepayment link after confirmation.'],
    matching: 'Being matched', preferredDays: 'Preferred days', copied: 'Copied', copy: 'Copy request ID', flexible: 'flexible', requestError: 'Unable to send your request. Please try again.'
  },
  ru: {
    pageTitle: 'Персональный подбор инструктора — My Gudauri', back: 'Назад', title: 'Заявка на занятие', titleStrong: 'мы подберём инструктора',
    steps: ['Когда вы хотите поехать?', 'Компания', 'Что вам интересно', 'Контактные данные'],
    dateHelp: 'Выберите предпочтительные дни. Точное время можно не указывать — оператор предложит подходящие слоты и проверит погоду.',
    startDate: 'Первая дата', endDate: 'Последняя дата', dateInputHint: 'Выберите первый и последний день — календарь отметит весь диапазон.',
    addTime: '+ Указать время', optional: 'необязательно', collapse: '− Свернуть', timePerDay: 'Время на каждый день', day: 'День', slot: 'слот', slotHint: 'Добавляйте и убирайте слоты. × удаляет день из заявки.',
    next: 'Далее', edit: 'Изменить ↗', who: 'Кто едет', company: { Family: 'Семья', Friends: 'Друзья', Solo: 'Один' },
    participants: 'Участники', kids: 'Дети до 12 лет', languages: 'Языки инструктора', languageLabels: { Russian: 'Русский', English: 'Английский', Georgian: 'Грузинский' },
    activity: 'Активность', activities: { Ski: 'Зимние виды', Sightseeing: 'Экскурсии', Freeride: 'Фрирайд', Snowboard: 'Сноуборд' },
    pace: 'Темп', paces: { Relaxed: 'Спокойно', Medium: 'Средне', Adrenaline: 'Адреналин' }, skill: 'Средний уровень',
    skills: { Beginner: 'Новичок', Intermediate: 'Средний', Advanced: 'Продвинутый' }, budget: 'Бюджет на человека',
    budgets: { Economy: 'Эконом', 'Mid-range': 'Средний', Premium: 'Премиум' }, notes: 'Что ещё учесть', notesHint: 'цели, дети, снаряжение', notesPlaceholder: '2 новичка и ребёнок, нужен прокат',
    contactHelp: 'Куда оператору отправить подтверждённый вариант?', name: 'Имя', phone: 'Телефон', email: 'Email', emailHint: 'сюда придёт подтверждение', messenger: 'Предпочтительный мессенджер',
    privacy: 'Оплата после подтверждения. Оператор ответит в течение часа — подтвердит инструктора, погоду и место встречи.', send: 'Отправить заявку', sending: 'Отправляем…',
    summary: 'Ваша заявка', dates: 'Даты', people: 'Участники', preferences: 'Пожелания', contact: 'Контакт', timeMissing: 'время не указано',
    pricePending: 'Цену подтвердит оператор', priceWait: 'Цена появится после часов и участников', priceFor: 'за выбранные часы',
    success: 'Заявка отправлена', requestId: 'Номер заявки', saveId: 'Сохраните номер заявки — он пригодится при обращении в поддержку.', nextTitle: 'Что дальше',
    nextItems: ['Оператор подберёт инструктора и программу под ваш запрос.', 'Мы свяжемся в течение часа и подтвердим погоду и место встречи.', 'После подтверждения вы получите защищённую ссылку на предоплату.'],
    matching: 'Подбирается', preferredDays: 'Предпочтительные дни', copied: 'Скопировано', copy: 'Скопировать номер заявки', flexible: 'гибко', requestError: 'Не удалось отправить заявку. Попробуйте ещё раз.'
  },
  ka: {
    pageTitle: 'ინსტრუქტორის პერსონალური შერჩევა — My Gudauri', back: 'უკან', title: 'გაკვეთილის მოთხოვნა', titleStrong: 'ჩვენ შეგირჩევთ ინსტრუქტორს',
    steps: ['როდის გსურთ ჩამოსვლა?', 'ჯგუფი', 'რა გაინტერესებთ', 'საკონტაქტო ინფორმაცია'],
    dateHelp: 'აირჩიეთ სასურველი დღეები. ზუსტი დრო სავალდებულო არ არის — ოპერატორი შემოგთავაზებთ სლოტებს და გადაამოწმებს ამინდს.',
    startDate: 'პირველი თარიღი', endDate: 'ბოლო თარიღი', dateInputHint: 'აირჩიეთ პირველი და ბოლო დღე — კალენდარი მონიშნავს მთელ პერიოდს.',
    addTime: '+ დროის მითითება', optional: 'არასავალდებულო', collapse: '− დაკეცვა', timePerDay: 'დრო თითოეულ დღეს', day: 'დღე', slot: 'სლოტი', slotHint: 'დაამატეთ ან წაშალეთ სლოტი. × მოთხოვნიდან დღეს წაშლის.',
    next: 'შემდეგი', edit: 'შეცვლა ↗', who: 'ვინ მოდის', company: { Family: 'ოჯახი', Friends: 'მეგობრები', Solo: 'მარტო' },
    participants: 'მონაწილეები', kids: '12 წლამდე ბავშვები', languages: 'ინსტრუქტორის ენები', languageLabels: { Russian: 'რუსული', English: 'ინგლისური', Georgian: 'ქართული' },
    activity: 'აქტივობა', activities: { Ski: 'ზამთრის სპორტი', Sightseeing: 'ექსკურსიები', Freeride: 'ფრირაიდი', Snowboard: 'სნოუბორდი' },
    pace: 'ტემპი', paces: { Relaxed: 'მშვიდი', Medium: 'საშუალო', Adrenaline: 'ადრენალინი' }, skill: 'საშუალო დონე',
    skills: { Beginner: 'დამწყები', Intermediate: 'საშუალო', Advanced: 'გამოცდილი' }, budget: 'ბიუჯეტი ერთ ადამიანზე',
    budgets: { Economy: 'ეკონომი', 'Mid-range': 'საშუალო', Premium: 'პრემიუმი' }, notes: 'კიდევ რა გავითვალისწინოთ', notesHint: 'მიზნები, ბავშვები, აღჭურვილობა', notesPlaceholder: '2 დამწყები და ბავშვი, გვჭირდება გაქირავება',
    contactHelp: 'სად გამოგიგზავნოთ დადასტურებული ვარიანტი?', name: 'სახელი', phone: 'ტელეფონი', email: 'Email', emailHint: 'დადასტურება აქ მოვა', messenger: 'სასურველი მესენჯერი',
    privacy: 'გადახდა ხდება დადასტურების შემდეგ. ოპერატორი ერთ საათში დაგიკავშირდებათ.', send: 'მოთხოვნის გაგზავნა', sending: 'იგზავნება…',
    summary: 'თქვენი მოთხოვნა', dates: 'თარიღები', people: 'მონაწილეები', preferences: 'სურვილები', contact: 'კონტაქტი', timeMissing: 'დრო მითითებული არ არის',
    pricePending: 'ფასს ოპერატორი დაადასტურებს', priceWait: 'ფასი გამოჩნდება საათებისა და მონაწილეების შემდეგ', priceFor: 'არჩეული საათებისთვის',
    success: 'მოთხოვნა გაგზავნილია', requestId: 'მოთხოვნის ნომერი', saveId: 'შეინახეთ მოთხოვნის ნომერი მხარდაჭერასთან დასაკავშირებლად.', nextTitle: 'შემდეგ რა მოხდება',
    nextItems: ['ოპერატორი შეგირჩევთ ინსტრუქტორსა და პროგრამას.', 'ერთ საათში დაგიკავშირდებით და დავადასტურებთ დეტალებს.', 'დადასტურების შემდეგ მიიღებთ დაცულ წინასწარი გადახდის ბმულს.'],
    matching: 'მიმდინარეობს შერჩევა', preferredDays: 'სასურველი დღეები', copied: 'დაკოპირდა', copy: 'მოთხოვნის ნომრის კოპირება', flexible: 'მოქნილი', requestError: 'მოთხოვნის გაგზავნა ვერ მოხერხდა. სცადეთ ხელახლა.'
  }
};

const LANGUAGES = ['Russian', 'English', 'Georgian'];
const ACTIVITIES = ['Ski', 'Sightseeing', 'Freeride', 'Snowboard'];
const PACES = ['Relaxed', 'Medium', 'Adrenaline'];
const SKILLS = ['Beginner', 'Intermediate', 'Advanced'];
const BUDGETS = ['Economy', 'Mid-range', 'Premium'];
const MESSENGERS = ['WhatsApp', 'Telegram', 'Viber'];
const LOCALES = { en: 'en-GB', ru: 'ru-RU', ka: 'ka-GE' };

function toDateKey(date) {
  if (!date) return '';
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function fromDateKey(value) {
  const [year, month, day] = String(value || '').split('-').map(Number);
  if (!year || !month || !day) return undefined;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function daysInRange(range) {
  if (!range?.from) return [];
  const start = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate());
  const end = range.to ? new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate()) : start;
  const days = [];
  for (const day = start; day <= end; day.setDate(day.getDate() + 1)) days.push(new Date(day));
  return days;
}

function formatDay(date, language, options = { day: 'numeric', month: 'long' }) {
  return new Intl.DateTimeFormat(LOCALES[language], options).format(date);
}

function formatDateRange(days, language) {
  if (!days.length) return '—';
  if (days.length === 1) return formatDay(days[0], language);
  const first = days[0];
  const last = days[days.length - 1];
  if (first.getMonth() === last.getMonth()) return `${first.getDate()}–${formatDay(last, language)}`;
  return `${formatDay(first, language)} – ${formatDay(last, language)}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function calendarCells(month) {
  const first = startOfMonth(month);
  const mondayOffset = (first.getDay() + 6) % 7;
  const dayCount = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return [...Array.from({ length: mondayOffset }, () => null), ...Array.from({ length: dayCount }, (_, index) => new Date(first.getFullYear(), first.getMonth(), index + 1))];
}

function MatchCalendar({ language, label, month, range, excludedDates, today, onMonthChange, onRangeChange }) {
  const cells = useMemo(() => calendarCells(month), [month]);
  const weekdayLabels = useMemo(() => {
    const monday = new Date(2026, 0, 5);
    return Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(LOCALES[language], { weekday: 'short' }).format(new Date(2026, 0, 5 + index)));
  }, [language]);
  const firstAllowedMonth = startOfMonth(today);
  const lastAllowedMonth = new Date(today.getFullYear() + 1, 11, 1);

  const selectDay = (date) => {
    if (!range?.from || range.to) {
      onRangeChange({ from: date, to: undefined });
      return;
    }
    if (date < range.from) onRangeChange({ from: date, to: range.from });
    else onRangeChange({ from: range.from, to: date });
  };

  const selectWithPointer = (event, date) => {
    event.preventDefault();
    selectDay(date);
  };

  return (
    <section className="match-calendar" aria-label={label}>
      <header>
        <button type="button" aria-label="Previous month" disabled={month <= firstAllowedMonth} onClick={() => onMonthChange(addMonths(month, -1))}>‹</button>
        <strong>{formatDay(month, language, { month: 'long', year: 'numeric' })}</strong>
        <button type="button" aria-label="Next month" disabled={month >= lastAllowedMonth} onClick={() => onMonthChange(addMonths(month, 1))}>›</button>
      </header>
      <div className="match-calendar__weekdays" aria-hidden="true">{weekdayLabels.map((weekday) => <span key={weekday}>{weekday}</span>)}</div>
      <div className="match-calendar__grid">
        {cells.map((date, index) => {
          if (!date) return <span className="match-calendar__empty" key={`empty-${index}`} />;
          const key = toDateKey(date);
          const disabled = date < today;
          const excluded = excludedDates.includes(key);
          const selected = Boolean(range?.from && date >= range.from && date <= (range.to || range.from));
          const edge = selected && (toDateKey(date) === toDateKey(range?.from) || toDateKey(date) === toDateKey(range?.to || range?.from));
          return <button type="button" data-date={key} className={`${selected ? 'is-selected' : ''} ${edge ? 'is-edge' : ''} ${excluded ? 'is-excluded' : ''}`.trim()} disabled={disabled} aria-pressed={selected && !excluded} aria-label={formatDay(date, language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} onPointerDown={(event) => selectWithPointer(event, date)} onClick={(event) => { if (event.detail === 0) selectDay(date); }} key={key}>{date.getDate()}</button>;
        })}
      </div>
    </section>
  );
}

function initialForm() {
  return {
    dateRange: undefined, excludedDates: [], slotsByDate: {}, companyType: 'Family', adultsCount: 1, childrenCount: 0,
    languages: ['Russian'], activities: ['Ski'], pace: 'Medium', skillLevel: 'Beginner', budget: 'Mid-range', notes: '',
    contactName: '', contactPhone: '', contactEmail: '', messenger: 'WhatsApp', website: ''
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function Choice({ label, options, value, labels, onChange, multiple = false, segmented = false }) {
  const isSelected = (option) => multiple ? value.includes(option) : value === option;
  return (
    <fieldset className={`match-choice ${segmented ? 'match-choice--segmented' : ''}`}>
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <FilterChip size="sm" selected={isSelected(option)} onClick={() => onChange(option)} key={option}>
            {labels?.[option] || option}
          </FilterChip>
        ))}
      </div>
    </fieldset>
  );
}

function Counter({ label, value, min, max, onChange }) {
  return (
    <div className="match-counter">
      <span>{label}</span>
      <div><button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`Decrease ${label}`}>−</button><strong>{value}</strong><button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}>+</button></div>
    </div>
  );
}

export function InstructorMatchPage() {
  const { language } = useLanguage();
  const c = COPY[language] || COPY.en;
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [timeExpanded, setTimeExpanded] = useState(false);
  const [submitState, setSubmitState] = useState({ status: 'idle', error: '', requestCode: '' });
  const [copyState, setCopyState] = useState('idle');
  const headingRef = useRef(null);
  const today = useMemo(() => { const value = new Date(); value.setHours(0, 0, 0, 0); return value; }, []);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const allDays = useMemo(() => daysInRange(form.dateRange), [form.dateRange]);
  const activeDays = useMemo(() => allDays.filter((day) => !form.excludedDates.includes(toDateKey(day))), [allDays, form.excludedDates]);
  const totalHours = useMemo(() => activeDays.reduce((sum, day) => sum + (form.slotsByDate[toDateKey(day)]?.length || 0) * 2, 0), [activeDays, form.slotsByDate]);
  const people = form.adultsCount;
  const isSuccess = submitState.status === 'success';

  useEffect(() => {
    document.title = c.pageTitle;
    document.body.classList.add('instructor-match-body');
    return () => document.body.classList.remove('instructor-match-body');
  }, [c.pageTitle]);

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [isSuccess, step]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleList = (key, value) => setForm((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
  const selectRange = (range) => {
    const keys = new Set(daysInRange(range).map(toDateKey));
    setForm((current) => ({ ...current, dateRange: range, excludedDates: [], slotsByDate: Object.fromEntries(Object.entries(current.slotsByDate).filter(([key]) => keys.has(key))) }));
  };
  const selectStartDate = (value) => {
    const from = fromDateKey(value);
    if (!from) { selectRange(undefined); return; }
    const currentTo = form.dateRange?.to;
    selectRange({ from, to: currentTo && currentTo >= from ? currentTo : undefined });
    setCalendarMonth(startOfMonth(from));
  };
  const selectEndDate = (value) => {
    const to = fromDateKey(value);
    const from = form.dateRange?.from;
    if (!from || !to) return;
    selectRange({ from, to: to >= from ? to : from });
    setCalendarMonth(startOfMonth(to));
  };
  const removeDay = (key) => setForm((current) => {
    const { [key]: removed, ...remainingSlots } = current.slotsByDate;
    const remainingDays = daysInRange(current.dateRange).filter((day) => ![...current.excludedDates, key].includes(toDateKey(day)));
    if (!remainingDays.length) return { ...current, dateRange: undefined, excludedDates: [], slotsByDate: {} };
    return { ...current, excludedDates: [...new Set([...current.excludedDates, key])], slotsByDate: remainingSlots };
  });
  const toggleSlot = (date, slot) => setForm((current) => {
    const selected = current.slotsByDate[date] || [];
    return { ...current, slotsByDate: { ...current.slotsByDate, [date]: selected.includes(slot) ? selected.filter((item) => item !== slot) : [...selected, slot] } };
  });

  const stepValid = useMemo(() => ({
    1: activeDays.length > 0,
    2: people >= 1 && form.childrenCount <= people && form.languages.length > 0,
    3: form.activities.length > 0 && Boolean(form.pace && form.skillLevel && form.budget),
    4: Boolean(form.contactName.trim() && form.contactPhone.trim().length >= 6 && isValidEmail(form.contactEmail) && form.messenger)
  }), [activeDays.length, form.activities.length, form.budget, form.childrenCount, form.contactEmail, form.contactName, form.contactPhone, form.languages.length, form.messenger, form.pace, form.skillLevel, people]);

  const goNext = () => {
    if (!stepValid[step] || step >= 4) return;
    const next = step + 1;
    setStep(next);
    setFurthestStep((current) => Math.max(current, next));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!stepValid[4] || submitState.status === 'submitting') return;
    const activeKeys = activeDays.map(toDateKey);
    const sessionSlots = Object.fromEntries(activeKeys.map((key) => [key, form.slotsByDate[key] || []]).filter(([, slots]) => slots.length));
    setSubmitState({ status: 'submitting', error: '', requestCode: '' });
    try {
      const result = await createInstructorRequest({
        requestType: 'manager_match', instructorSlug: '', instructorName: '',
        dateRangeStart: activeKeys[0], dateRangeEnd: activeKeys[activeKeys.length - 1],
        preferredDates: activeDays.map((day) => formatDay(day, language, { day: 'numeric', month: 'long', year: 'numeric' })).join(', '),
        sessionSlots, timePreferences: [...new Set(Object.values(sessionSlots).flat())], totalHours,
        companyType: form.companyType, adultsCount: Math.max(0, people - form.childrenCount), childrenCount: form.childrenCount, participantCount: people,
        languages: form.languages, activities: form.activities, pace: form.pace, skillLevel: form.skillLevel, budget: form.budget, notes: form.notes,
        contactName: form.contactName, contactPhone: form.contactPhone, contactEmail: form.contactEmail, messenger: form.messenger, website: form.website
      });
      setSubmitState({ status: 'success', error: '', requestCode: result?.requestCode || 'MG-RECEIVED' });
    } catch (error) {
      setSubmitState({ status: 'error', error: error.message || c.requestError, requestCode: '' });
    }
  };

  const summaries = [
    `${formatDateRange(activeDays, language)}${totalHours ? ` · ${totalHours} h` : ` · ${c.timeMissing}`}`,
    `${c.company[form.companyType]} · ${people}`,
    `${form.activities.map((item) => c.activities[item]).join(', ')} · ${c.paces[form.pace]}`,
    `${form.contactName || '—'} · ${form.messenger}`
  ];

  const copyRequestId = async () => {
    try { await navigator.clipboard.writeText(submitState.requestCode); setCopyState('copied'); }
    catch { setCopyState('idle'); }
  };

  const renderStep = (stepNumber) => {
    if (step !== stepNumber) {
      const available = stepNumber <= furthestStep;
      return <button className="match-step-summary" type="button" disabled={!available} onClick={() => setStep(stepNumber)}><strong>{stepNumber}. {c.steps[stepNumber - 1]}</strong><span>{available ? summaries[stepNumber - 1] : ''}{available ? <em>{c.edit}</em> : null}</span></button>;
    }

    return (
      <section className="match-step" aria-labelledby={`match-step-${stepNumber}`}>
        <h2 id={`match-step-${stepNumber}`} ref={headingRef} tabIndex="-1">{stepNumber}. {c.steps[stepNumber - 1]}</h2>
        {stepNumber === 1 ? <>
          <p>{c.dateHelp}</p>
          <div className="match-date-inputs">
            <label><span>1. {c.startDate}</span><input type="date" min={toDateKey(today)} max={`${today.getFullYear() + 1}-12-31`} value={toDateKey(form.dateRange?.from)} onChange={(event) => selectStartDate(event.target.value)} /></label>
            <label><span>2. {c.endDate}</span><input type="date" min={toDateKey(form.dateRange?.from || today)} max={`${today.getFullYear() + 1}-12-31`} value={toDateKey(form.dateRange?.to)} disabled={!form.dateRange?.from} onChange={(event) => selectEndDate(event.target.value)} /></label>
          </div>
          <small className="match-date-inputs__hint">{c.dateInputHint}</small>
          <MatchCalendar language={language} label={c.dates} month={calendarMonth} range={form.dateRange} excludedDates={form.excludedDates} today={today} onMonthChange={setCalendarMonth} onRangeChange={selectRange} />
          {activeDays.length ? <div className="match-date-caption">{formatDateRange(activeDays, language)} · {activeDays.length}</div> : null}
          {!timeExpanded && activeDays.length ? <button className="match-time-toggle" type="button" onClick={() => setTimeExpanded(true)} aria-expanded="false">{c.addTime} <small>{c.optional}</small></button> : null}
          {timeExpanded && activeDays.length ? <div className="match-slots">
            <header><span>{c.timePerDay} <small>{c.optional}</small></span><button type="button" onClick={() => setTimeExpanded(false)}>{c.collapse}</button></header>
            <div className="match-slots__labels" aria-hidden="true"><span />{SLOT_OPTIONS.map((slot, index) => <span key={slot.id}>{c.slot} {index + 1} · 2h</span>)}</div>
            {activeDays.map((day, index) => { const key = toDateKey(day); const selected = form.slotsByDate[key] || []; return <div className="match-day" key={key}><div className="match-day__label"><span><button type="button" onClick={() => removeDay(key)} aria-label={`Remove ${formatDay(day, language)}`}>×</button><strong>{c.day} {index + 1}</strong></span><small>{formatDay(day, language, { day: '2-digit', month: '2-digit', year: '2-digit' })}</small></div><div className="match-day__slots">{SLOT_OPTIONS.map((slot) => <button type="button" className={selected.includes(slot.id) ? 'is-selected' : ''} aria-pressed={selected.includes(slot.id)} onClick={() => toggleSlot(key, slot.id)} key={slot.id}>{slot.label}</button>)}</div></div>; })}
            <p>{c.slotHint}</p>
          </div> : null}
        </> : null}
        {stepNumber === 2 ? <div className="match-fields"><Choice label={c.who} options={['Family', 'Friends', 'Solo']} value={form.companyType} labels={c.company} segmented onChange={(value) => update('companyType', value)} /><div className="match-counter-grid"><Counter label={c.participants} value={form.adultsCount} min={1} max={10} onChange={(value) => { update('adultsCount', value); if (form.childrenCount > value) update('childrenCount', value); }} /><Counter label={c.kids} value={form.childrenCount} min={0} max={form.adultsCount} onChange={(value) => update('childrenCount', value)} /></div><Choice label={c.languages} options={LANGUAGES} value={form.languages} labels={c.languageLabels} multiple onChange={(value) => toggleList('languages', value)} /></div> : null}
        {stepNumber === 3 ? <div className="match-fields"><Choice label={c.activity} options={ACTIVITIES} value={form.activities} labels={c.activities} multiple onChange={(value) => toggleList('activities', value)} /><Choice label={c.pace} options={PACES} value={form.pace} labels={c.paces} segmented onChange={(value) => update('pace', value)} /><Choice label={c.skill} options={SKILLS} value={form.skillLevel} labels={c.skills} segmented onChange={(value) => update('skillLevel', value)} /><Choice label={c.budget} options={BUDGETS} value={form.budget} labels={c.budgets} segmented onChange={(value) => update('budget', value)} /><label className="match-field"><span>{c.notes} <small>{c.notesHint}</small></span><textarea rows="3" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder={c.notesPlaceholder} /></label></div> : null}
        {stepNumber === 4 ? <><p>{c.contactHelp}</p><div className="match-fields"><label className="match-field"><span>{c.name}</span><input required autoComplete="name" value={form.contactName} onChange={(event) => update('contactName', event.target.value)} /></label><div className="match-contact-grid"><label className="match-field"><span>{c.phone}</span><input required type="tel" autoComplete="tel" value={form.contactPhone} onChange={(event) => update('contactPhone', event.target.value)} placeholder="+995 …" /></label><label className="match-field"><span>{c.email} <small>{c.emailHint}</small></span><input required type="email" autoComplete="email" value={form.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} /></label></div><Choice label={c.messenger} options={MESSENGERS} value={form.messenger} onChange={(value) => update('messenger', value)} /><label className="match-honeypot" aria-hidden="true">Website<input tabIndex="-1" autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label><small className="match-privacy">{c.privacy}</small>{submitState.status === 'error' ? <p className="match-error" role="alert">{submitState.error}</p> : null}</div></> : null}
        <footer className="match-step__actions">{stepNumber > 1 ? <Button variant="secondary" size="md" onClick={() => setStep(stepNumber - 1)}>← {c.back}</Button> : <span />}{stepNumber < 4 ? <Button variant="primary" size="md" disabled={!stepValid[stepNumber]} onClick={goNext}>{c.next} →</Button> : <Button variant="primary" size="md" type="submit" disabled={!stepValid[4]} loading={submitState.status === 'submitting'} loadingLabel={c.sending}>{c.send} →</Button>}</footer>
      </section>
    );
  };

  const summary = <aside className="match-summary" aria-label={c.summary}><span className="match-summary__eyebrow">{c.summary}</span>{isSuccess ? <header><span className="match-summary__avatar">?</span><div><small>Instructor</small><strong>{c.matching}</strong></div></header> : null}<div className="match-summary__item"><span>{isSuccess ? c.preferredDays : c.dates}</span><strong>{formatDateRange(activeDays, language)}</strong><small>{totalHours ? `${totalHours} h` : c.timeMissing}</small></div><div className="match-summary__item"><span>{c.people}</span><strong>{furthestStep >= 2 ? `${c.company[form.companyType]} · ${people}` : '—'}</strong>{furthestStep >= 2 && form.childrenCount ? <small>{form.childrenCount} · {c.kids}</small> : null}</div>{furthestStep >= 3 ? <div className="match-summary__item"><span>{c.preferences}</span><strong>{form.activities.map((item) => c.activities[item]).join(', ')}</strong><small>{c.paces[form.pace]} · {c.skills[form.skillLevel]}</small></div> : null}{furthestStep >= 4 ? <div className="match-summary__item"><span>{c.contact}</span><strong>{form.contactName || '—'}</strong><small>{form.messenger}</small></div> : null}<div className="match-summary__price">{furthestStep >= 3 && totalHours ? <><strong>847 GEL</strong><small>{c.priceFor}</small></> : <span>{totalHours ? c.pricePending : c.priceWait}</span>}</div></aside>;

  return (
    <div className="instructor-match-page">
      <SiteNavbar className="instructor-match-navbar" />
      <main>
        <Container width="detail">
          <header className="instructor-match-heading"><Link className="instructor-match-back" to="/instructors" aria-label={c.back}>←</Link><h1>{c.title} — <strong>{c.titleStrong}</strong></h1></header>
          <form onSubmit={submit} noValidate>
            <div className="instructor-match-layout">
              {isSuccess ? <section className="match-success" aria-labelledby="match-success-title"><div className="match-success__mark" aria-hidden="true">✓</div><h2 id="match-success-title" ref={headingRef} tabIndex="-1">{c.success}</h2><span>{c.requestId}</span><div className="match-success__code"><strong>{submitState.requestCode}</strong><button type="button" aria-label={c.copy} onClick={copyRequestId}>⧉</button>{copyState === 'copied' ? <small role="status">{c.copied}</small> : null}</div><p>{c.saveId}</p><div className="match-success__next"><h3>{c.nextTitle}</h3><ol>{c.nextItems.map((item) => <li key={item}>{item}</li>)}</ol></div></section> : <div className="instructor-match-steps">{[1, 2, 3, 4].map(renderStep)}</div>}
              {summary}
            </div>
          </form>
        </Container>
      </main>
    </div>
  );
}
