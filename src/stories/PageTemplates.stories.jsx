import { Route, Routes } from 'react-router-dom';
import { AboutGudauriPage } from '../pages/AboutGudauriPage/AboutGudauriPage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage/ArticleDetailPage';
import { ArticlesPage } from '../pages/ArticlesPage/ArticlesPage';
import { BookingFlowPage } from '../pages/BookingFlowPage/BookingFlowPage';
import { ContactsPage } from '../pages/ContactsPage/ContactsPage';
import { DestinationCatalogPage } from '../pages/DestinationCatalogPage/DestinationCatalogPage';
import { DestinationDetailPage } from '../pages/DestinationDetailPage/DestinationDetailPage';
import { HomePage } from '../pages/HomePage/HomePage';
import { InstructorMatchPage } from '../pages/InstructorMatchPage/InstructorMatchPage';
import { ARTICLES, getDestination } from '../data/destinations';

const activity = getDestination('activities').items[0];
const article = ARTICLES[0];

export default {
  title: 'Product Stories/Public Pages',
  parameters: {
    fullscreen: true,
    controls: { disable: true },
    a11y: { test: 'todo' }
  }
};

export const MarketingHome = {
  parameters: { route: '/' },
  render: () => <HomePage />
};

export const DestinationCatalog = {
  parameters: { route: '/activities' },
  render: () => <DestinationCatalogPage section="activities" />
};

export const DestinationDetail = {
  parameters: { route: `/activities/${activity.slug}` },
  render: () => <Routes><Route path="/:section/:slug" element={<DestinationDetailPage />} /></Routes>
};

export const EditorialIndex = {
  parameters: { route: '/articles' },
  render: () => <ArticlesPage />
};

export const EditorialDetail = {
  parameters: { route: `/articles/${article.slug}` },
  render: () => <Routes><Route path="/articles/:slug" element={<ArticleDetailPage />} /></Routes>
};

export const InformationLanding = {
  parameters: { route: '/about-gudauri' },
  render: () => <AboutGudauriPage />
};

export const Contacts = {
  parameters: { route: '/contacts' },
  render: () => <ContactsPage />
};

export const InstructorMatchWizard = {
  parameters: { route: '/instructors/match' },
  render: () => <InstructorMatchPage />
};

export const BookingWizard = {
  parameters: { route: '/booking' },
  render: () => <BookingFlowPage />
};
