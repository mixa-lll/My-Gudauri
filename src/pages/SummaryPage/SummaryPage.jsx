import { Container } from '../../components/UI/Container/Container';
import { SectionHeading } from '../../components/UI/SectionHeading/SectionHeading';
import { Button } from '../../components/UI/Button/Button';
import './SummaryPage.scss';

export function SummaryPage() {
  return (
    <div className="summary-page">
      <Container>
        <section className="summary-page__content">
          <SectionHeading as="h1" kicker="Summary" title="Booking summary" />

          <div className="summary-page__card">
            <p>Instructor: Mikhail Andreev</p>
            <p>Hours: 4</p>
            <p>People: 2</p>
            <p>Total: 1380 GEL</p>
          </div>

          <Button variant="dark" size="md">
            Confirm and pay
          </Button>
        </section>
      </Container>
    </div>
  );
}
