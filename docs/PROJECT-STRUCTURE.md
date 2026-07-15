# Project Structure

```text
.
├── assets/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   ├── PROJECT-STRUCTURE.md
│   └── STYLING.md
├── pages/                  # legacy static HTML (kept for reference)
├── scripts/                # legacy JS (kept for reference)
├── styles/                 # legacy CSS (kept for reference)
├── src/
│   ├── app/
│   │   └── App.jsx
│   ├── components/
│   │   ├── UI/
│   │   │   ├── Button/
│   │   │   ├── Container/
│   │   │   ├── Pill/
│   │   │   └── SectionHeading/
│   │   ├── CalculatorBanner/
│   │   ├── FaqAccordion/
│   │   ├── InstructorCard/
│   │   ├── SiteFooter/
│   │   ├── SiteNavbar/
│   │   ├── layout/
│   │   │   └── MainLayout/
│   │   ├── index.js
│   │   └── UI/index.js
│   ├── data/
│   │   ├── faqItems.js
│   │   ├── instructors.js
│   │   ├── navCategories.js       # compatibility re-export
│   │   └── siteCategories.js      # canonical seven-category taxonomy
│   ├── pages/
│   │   ├── BookingFlowPage/
│   │   ├── HomePage/
│   │   ├── InstructorsPage/
│   │   ├── ProfilePage/
│   │   └── SummaryPage/
│   ├── styles/
│   │   ├── base/
│   │   ├── tokens/
│   │   └── globals.scss
│   ├── utils/
│   │   └── cn.js
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```
