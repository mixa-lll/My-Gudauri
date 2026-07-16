import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'my-gudauri-language';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', shortLabel: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'ru', shortLabel: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'ka', shortLabel: 'KA', label: 'ქართული', flag: '🇬🇪' }
];

const copy = {
  en: {
    nav: {
      homeLabel: 'My Gudauri home',
      mainLabel: 'Main navigation',
      mobileLabel: 'Mobile navigation',
      siteLabel: 'Site navigation',
      categories: 'Categories',
      articles: 'Articles',
      about: 'About Gudauri',
      contacts: 'Contacts',
      offer: 'Offer a service',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      language: 'Language',
      promoLabel: 'Featured category',
      promoTitle: 'Find the right ski instructor',
      promoButton: 'Browse instructors'
    },
    categories: {
      instructors: { title: 'Instructors', description: 'Verified ski and snowboard coaches' },
      activities: { title: 'Activities', description: 'Routes, freeride and mountain adventures' },
      services: { title: 'Services', description: 'Photo, video, childcare and local professionals' },
      rental: { title: 'Rental', description: 'Equipment for every level and riding style' },
      transfers: { title: 'Transfers', description: 'Tbilisi, Kutaisi, Batumi and regional routes' },
      stays: { title: 'Stays', description: 'Apartments, hotels and chalets close to the slopes' },
      places: { title: 'Places', description: 'Restaurants, wellness and local essentials' }
    },
    footer: {
      tagline: 'One trusted local guide for instructors, mountain experiences, stays and everything around Gudauri.',
      services: 'Services',
      instructors: 'Instructors',
      activities: 'Activities',
      rental: 'Rental',
      transfers: 'Transfers',
      localServices: 'Local services',
      explore: 'Explore',
      stays: 'Stays',
      places: 'Places',
      articles: 'Articles',
      about: 'About Gudauri',
      contact: 'Contact',
      location: 'Gudauri, Georgia',
      professional: 'Are you a local professional?',
      offer: 'Offer a service',
      contacts: 'Contacts',
      privacy: 'Privacy',
      cookies: 'Cookies',
      independent: 'Independent local platform'
    },
    contacts: {
      pageTitle: 'Contacts — My Gudauri',
      kicker: 'Contact My Gudauri',
      title: 'Here when you need a local answer.',
      intro: 'Questions about a service, a booking or cooperation? Contact the My Gudauri team directly. We keep communication clear and connect you with the right local specialist.',
      status: 'Working locally in Gudauri, Georgia',
      emailTitle: 'General enquiries',
      emailNote: 'Questions about the platform and services',
      phoneTitle: 'Phone',
      phoneNote: 'For time-sensitive questions',
      locationTitle: 'Service area',
      locationNote: 'Gudauri and the Kazbegi Municipality',
      detailsKicker: 'Platform details',
      detailsTitle: 'Who you are contacting',
      detailsText: 'The essential details in one place. Official company information can be requested before entering into an agreement.',
      brandLabel: 'Brand and platform',
      brandValue: 'My Gudauri',
      formatLabel: 'Service format',
      formatValue: 'Independent local information and services platform',
      regionLabel: 'Operating region',
      regionValue: 'Gudauri, Kazbegi Municipality, Georgia',
      legalLabel: 'Legal entity and registered address',
      legalValue: 'Request official details',
      trustKicker: 'Built for clarity',
      trustTitle: 'A straightforward way to work with us',
      verifiedTitle: 'Clear provider profiles',
      verifiedText: 'We structure service information so you can compare the important details before contacting a provider.',
      directTitle: 'Direct communication',
      directText: 'You can reach the platform team by email or phone without searching through multiple channels.',
      localTitle: 'Local focus',
      localText: 'The platform is dedicated to Gudauri and the surrounding mountain region.',
      responseKicker: 'Need help?',
      responseTitle: 'Tell us what happened — we will point you in the right direction.',
      responseText: 'Include the service, provider name and relevant date so we can understand your question faster.',
      write: 'Write to us'
    }
  },
  ru: {
    nav: {
      homeLabel: 'Главная My Gudauri', mainLabel: 'Основная навигация', mobileLabel: 'Мобильная навигация', siteLabel: 'Навигация сайта',
      categories: 'Категории', articles: 'Статьи', about: 'О Гудаури', contacts: 'Контакты', offer: 'Предложить услугу',
      openMenu: 'Открыть меню', closeMenu: 'Закрыть меню', language: 'Язык', promoLabel: 'Рекомендуемая категория',
      promoTitle: 'Найдите подходящего лыжного инструктора', promoButton: 'Смотреть инструкторов'
    },
    categories: {
      instructors: { title: 'Инструкторы', description: 'Проверенные инструкторы по лыжам и сноуборду' },
      activities: { title: 'Активности', description: 'Маршруты, фрирайд и горные приключения' },
      services: { title: 'Услуги', description: 'Фото, видео, няни и местные специалисты' },
      rental: { title: 'Прокат', description: 'Снаряжение для любого уровня и стиля катания' },
      transfers: { title: 'Трансферы', description: 'Тбилиси, Кутаиси, Батуми и региональные маршруты' },
      stays: { title: 'Проживание', description: 'Апартаменты, отели и шале рядом со склонами' },
      places: { title: 'Места', description: 'Рестораны, wellness и всё необходимое' }
    },
    footer: {
      tagline: 'Один надежный местный гид по инструкторам, горным впечатлениям, проживанию и всему, что связано с Гудаури.',
      services: 'Услуги', instructors: 'Инструкторы', activities: 'Активности', rental: 'Прокат', transfers: 'Трансферы', localServices: 'Местные услуги',
      explore: 'Гудаури', stays: 'Проживание', places: 'Места', articles: 'Статьи', about: 'О Гудаури', contact: 'Связь', location: 'Гудаури, Грузия',
      professional: 'Вы местный специалист?', offer: 'Предложить услугу', contacts: 'Контакты', privacy: 'Конфиденциальность', cookies: 'Cookies', independent: 'Независимая местная платформа'
    },
    contacts: {
      pageTitle: 'Контакты — My Gudauri', kicker: 'Контакты My Gudauri', title: 'Местный ответ, когда он вам нужен.',
      intro: 'Есть вопрос об услуге, бронировании или сотрудничестве? Свяжитесь напрямую с командой My Gudauri. Мы помогаем разобраться и найти нужного местного специалиста.',
      status: 'Работаем локально в Гудаури, Грузия', emailTitle: 'Общие вопросы', emailNote: 'Вопросы о платформе и услугах', phoneTitle: 'Телефон', phoneNote: 'Для срочных вопросов',
      locationTitle: 'Регион работы', locationNote: 'Гудаури и муниципалитет Казбеги', detailsKicker: 'О платформе', detailsTitle: 'С кем вы связываетесь',
      detailsText: 'Основная информация собрана в одном месте. Официальные реквизиты организации можно запросить до заключения договора.',
      brandLabel: 'Бренд и платформа', brandValue: 'My Gudauri', formatLabel: 'Формат работы', formatValue: 'Независимая местная информационно-сервисная платформа',
      regionLabel: 'Регион работы', regionValue: 'Гудаури, муниципалитет Казбеги, Грузия', legalLabel: 'Юридическое лицо и адрес', legalValue: 'Запросить официальные реквизиты',
      trustKicker: 'Понятные правила', trustTitle: 'Простой и прозрачный способ работать с нами', verifiedTitle: 'Понятные профили исполнителей',
      verifiedText: 'Мы структурируем информацию об услугах, чтобы важные детали можно было сравнить до обращения к исполнителю.', directTitle: 'Прямая связь',
      directText: 'С командой платформы можно связаться по почте или телефону, не разыскивая контакты в разных каналах.', localTitle: 'Локальная специализация',
      localText: 'Платформа посвящена Гудаури и окружающему горному региону.', responseKicker: 'Нужна помощь?',
      responseTitle: 'Расскажите, что произошло, — мы подскажем, куда обратиться.', responseText: 'Укажите услугу, имя исполнителя и дату — так мы быстрее разберемся в вопросе.', write: 'Написать нам'
    }
  },
  ka: {
    nav: {
      homeLabel: 'My Gudauri მთავარი', mainLabel: 'მთავარი ნავიგაცია', mobileLabel: 'მობილური ნავიგაცია', siteLabel: 'საიტის ნავიგაცია',
      categories: 'კატეგორიები', articles: 'სტატიები', about: 'გუდაურის შესახებ', contacts: 'კონტაქტები', offer: 'სერვისის შეთავაზება',
      openMenu: 'მენიუს გახსნა', closeMenu: 'მენიუს დახურვა', language: 'ენა', promoLabel: 'რჩეული კატეგორია',
      promoTitle: 'იპოვეთ შესაფერისი სათხილამურო ინსტრუქტორი', promoButton: 'ინსტრუქტორების ნახვა'
    },
    categories: {
      instructors: { title: 'ინსტრუქტორები', description: 'სანდო სათხილამურო და სნოუბორდის ინსტრუქტორები' },
      activities: { title: 'აქტივობები', description: 'მარშრუტები, ფრირაიდი და მთის თავგადასავლები' },
      services: { title: 'სერვისები', description: 'ფოტო, ვიდეო, ბავშვების მოვლა და ადგილობრივი სპეციალისტები' },
      rental: { title: 'გაქირავება', description: 'აღჭურვილობა ყველა დონისა და სტილისთვის' },
      transfers: { title: 'ტრანსფერები', description: 'თბილისი, ქუთაისი, ბათუმი და რეგიონული მარშრუტები' },
      stays: { title: 'განთავსება', description: 'აპარტამენტები, სასტუმროები და შალეები ტრასებთან ახლოს' },
      places: { title: 'ადგილები', description: 'რესტორნები, ველნესი და საჭირო სერვისები' }
    },
    footer: {
      tagline: 'ერთი სანდო ადგილობრივი გზამკვლევი ინსტრუქტორებისთვის, მთის გამოცდილებისთვის, განთავსებისა და ყველაფრისთვის გუდაურში.',
      services: 'სერვისები', instructors: 'ინსტრუქტორები', activities: 'აქტივობები', rental: 'გაქირავება', transfers: 'ტრანსფერები', localServices: 'ადგილობრივი სერვისები',
      explore: 'გუდაური', stays: 'განთავსება', places: 'ადგილები', articles: 'სტატიები', about: 'გუდაურის შესახებ', contact: 'კონტაქტი', location: 'გუდაური, საქართველო',
      professional: 'ადგილობრივი სპეციალისტი ხართ?', offer: 'სერვისის შეთავაზება', contacts: 'კონტაქტები', privacy: 'კონფიდენციალურობა', cookies: 'Cookies', independent: 'დამოუკიდებელი ადგილობრივი პლატფორმა'
    },
    contacts: {
      pageTitle: 'კონტაქტები — My Gudauri', kicker: 'My Gudauri-ის კონტაქტები', title: 'ადგილობრივი პასუხი, როცა გჭირდებათ.',
      intro: 'გაქვთ კითხვა სერვისზე, ჯავშანზე ან თანამშრომლობაზე? დაუკავშირდით My Gudauri-ის გუნდს. ჩვენ დაგეხმარებით საკითხის გარკვევაში და შესაბამის ადგილობრივ სპეციალისტთან დაკავშირებაში.',
      status: 'ვმუშაობთ ადგილობრივად გუდაურში, საქართველოში', emailTitle: 'ზოგადი კითხვები', emailNote: 'კითხვები პლატფორმასა და სერვისებზე', phoneTitle: 'ტელეფონი', phoneNote: 'გადაუდებელი კითხვებისთვის',
      locationTitle: 'მომსახურების არეალი', locationNote: 'გუდაური და ყაზბეგის მუნიციპალიტეტი', detailsKicker: 'პლატფორმის შესახებ', detailsTitle: 'ვის უკავშირდებით',
      detailsText: 'ძირითადი ინფორმაცია ერთ სივრცეშია თავმოყრილი. ორგანიზაციის ოფიციალური რეკვიზიტები შეგიძლიათ მოითხოვოთ შეთანხმების გაფორმებამდე.',
      brandLabel: 'ბრენდი და პლატფორმა', brandValue: 'My Gudauri', formatLabel: 'მუშაობის ფორმატი', formatValue: 'დამოუკიდებელი ადგილობრივი საინფორმაციო და სერვისების პლატფორმა',
      regionLabel: 'სამუშაო რეგიონი', regionValue: 'გუდაური, ყაზბეგის მუნიციპალიტეტი, საქართველო', legalLabel: 'იურიდიული პირი და მისამართი', legalValue: 'ოფიციალური რეკვიზიტების მოთხოვნა',
      trustKicker: 'გასაგები წესები', trustTitle: 'ჩვენთან მუშაობის მარტივი და გამჭვირვალე გზა', verifiedTitle: 'გასაგები პროვაიდერის პროფილები',
      verifiedText: 'სერვისების ინფორმაციას ვაწყობთ ისე, რომ მნიშვნელოვანი დეტალების შედარება დაკავშირებამდე შეძლოთ.', directTitle: 'პირდაპირი კავშირი',
      directText: 'პლატფორმის გუნდს შეგიძლიათ დაუკავშირდეთ ელფოსტით ან ტელეფონით.', localTitle: 'ადგილობრივი ფოკუსი', localText: 'პლატფორმა ეძღვნება გუდაურსა და მის გარშემო მთიან რეგიონს.',
      responseKicker: 'დახმარება გჭირდებათ?', responseTitle: 'მოგვწერეთ რა მოხდა — სწორ მიმართულებას გიჩვენებთ.', responseText: 'მიუთითეთ სერვისი, პროვაიდერის სახელი და თარიღი, რათა საკითხი სწრაფად გავიგოთ.', write: 'მოგვწერეთ'
    }
  }
};

const LanguageContext = createContext(null);

function readInitialLanguage() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return SUPPORTED_LANGUAGES.some((item) => item.code === stored) ? stored : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t(path, fallback = path) {
      const valueAtPath = path.split('.').reduce((result, key) => result?.[key], copy[language]);
      return typeof valueAtPath === 'string' ? valueAtPath : fallback;
    }
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
