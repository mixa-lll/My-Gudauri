import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaqAccordion } from '../../components/FaqAccordion/FaqAccordion';
import { SiteFooter } from '../../components/SiteFooter/SiteFooter';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { MediaPlaceholder } from '../../components/MediaPlaceholder/MediaPlaceholder';
import { Container } from '../../components/UI/Container/Container';
import { ARTICLES } from '../../data/destinations';
import './AboutGudauriPage.scss';

const ABOUT_FAQ = [
  { question: 'When is the ski season?', answer: 'The usual season runs from December to around mid-April. Exact opening dates, lift access and snow coverage vary, so check the Mountain Trails Agency before travel.' },
  { question: 'Is Gudauri good for beginners?', answer: 'Yes. Gudauri has marked beginner terrain and learning areas. A lesson early in the trip helps new skiers understand lift use, piste signs and mountain etiquette.' },
  { question: 'How do I get to Gudauri?', answer: 'Most international guests arrive through Tbilisi and travel roughly 120 km by road. The drive often takes 2–2.5 hours in normal conditions and longer during winter restrictions or heavy traffic.' },
  { question: 'What can I do without skiing?', answer: 'Depending on season and weather, options include scenic gondola rides, paragliding with a professional operator, spas, Georgian food, hiking and a road trip toward Stepantsminda and Gergeti.' }
];

export function AboutGudauriPage() {
  useEffect(() => { document.title = 'About Gudauri — My Gudauri'; }, []);

  return (
    <div className="about-page">
      <SiteNavbar className="destination-nav-host" />
      <main>
        <Container className="destination-shell">
          <section className="about-hero">
            <div><p className="destination-eyebrow">Greater Caucasus · Georgia</p><h1>About<br />Gudauri</h1><p>A high-mountain resort with open alpine terrain, broad views and direct road access from Tbilisi.</p></div>
            <img
              className="about-hero__image"
              src="/assets/about-gudauri/gudauri-panorama.jpg"
              alt="Panoramic winter view of Gudauri ski resort, lifts and the Greater Caucasus"
              width="1536"
              height="1024"
              decoding="async"
              fetchPriority="high"
            />
            <div className="about-hero__stats"><span><strong>2,196 m</strong>Village altitude</span><span><strong>3,276 m</strong>Highest lift</span><span><strong>~120 km</strong>From Tbilisi</span></div>
          </section>

          <section className="about-intro">
            <p className="destination-eyebrow">The resort</p>
            <div><h2>Big mountain days,<br />with room to improvise.</h2><p>Gudauri lies in Kazbegi Municipality on the southern side of the Greater Caucasus, beside the Georgian Military Highway. The resort base begins at about 1,989 metres and the lift network reaches 3,276 metres. Open, largely treeless terrain defines the skiing; Georgian mountain food and the route toward Stepantsminda shape the time away from the pistes.</p></div>
          </section>

          <section className="about-seasons">
            <article className="about-seasons__winter"><span>Usually December — mid-April</span><h2>Winter</h2><p>Marked pistes for different levels, high alpine views and guided snow activities. Operations always depend on snow, wind and visibility.</p><Link to="/activities">Explore winter activities →</Link></article>
            <article className="about-seasons__summer"><span>June — October</span><h2>Summer</h2><p>Hiking, paragliding, quiet roads and cool evenings above the valley.</p><Link to="/activities">Explore summer activities →</Link></article>
          </section>

          <section className="about-zones">
            <div className="about-section-heading"><p className="destination-eyebrow">Know the mountain</p><h2>Four areas, four different rhythms</h2></div>
            <div className="about-zones__grid">
              {[['New Gudauri', 'A compact base around the GoodAura gondola, with apartments, rentals and a dense cluster of food options.'], ['Central Gudauri', 'Established hotels and several mountain access points spread along the main road.'], ['Upper Gudauri', 'Quieter accommodation higher on the road; verify the real walk or shuttle route to an operating lift.'], ['Kobi connection', 'A lift-served link across the pass toward Kobi. Check both sides’ status and return times before crossing.']].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </section>

          <section className="about-trail-map" id="trail-map" aria-labelledby="trail-map-title">
            <div className="about-trail-map__heading">
              <p className="destination-eyebrow">Plan your ski day</p>
              <div>
                <h2 id="trail-map-title">Gudauri trail map</h2>
                <p>See the main lifts, marked pistes, Kobi connection and mountain facilities in one overview.</p>
              </div>
            </div>
            <figure>
              <a href="/assets/about-gudauri/map-gudauri-ski-resort.jpg" target="_blank" rel="noreferrer" aria-label="Open the Gudauri trail map at full size">
                <img
                  src="/assets/about-gudauri/map-gudauri-ski-resort.jpg"
                  alt="Gudauri ski resort trail map showing lifts, pistes, Kobi connection and mountain facilities"
                  width="3499"
                  height="3933"
                  loading="lazy"
                  decoding="async"
                />
                <span>Open full-size map ↗</span>
              </a>
              <figcaption>Use this map for orientation. Lift status, piste openings and patrol instructions can change with weather and always take priority.</figcaption>
            </figure>
          </section>

          <section className="about-practical">
            <div><p className="destination-eyebrow">Good to know</p><h2>Mountain essentials</h2></div>
            <div>
              {[['Getting here', 'Tbilisi is the most practical gateway for most visitors. Allow roughly 2–2.5 hours by road in normal conditions and extra time in winter.'], ['Live information', 'Check the official MTA lift status and Roads Department notices. Saved maps and social posts may be out of date.'], ['Mountain safety', 'Stay on open marked pistes unless you have the skills, rescue equipment and a qualified guide for uncontrolled terrain.'], ['Emergency plan', 'Save your accommodation details offline. Georgia’s single emergency number is 112.']].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </section>

          <section className="about-sources" aria-labelledby="about-sources-title">
            <div><p className="destination-eyebrow">Verified essentials</p><h2 id="about-sources-title">Check live information</h2></div>
            <div>
              <a href="https://status.mta.ski/en/gudauri/gudauri" target="_blank" rel="noreferrer"><strong>Lift status & weather</strong><span>Mountain Trails Agency ↗</span></a>
              <a href="https://www.georoad.ge/?lang=eng" target="_blank" rel="noreferrer"><strong>Road restrictions</strong><span>Roads Department of Georgia ↗</span></a>
              <a href="https://georgia.travel/resorts/gudauri" target="_blank" rel="noreferrer"><strong>Destination facts</strong><span>Official Georgia Travel guide ↗</span></a>
            </div>
            <p>Facts reviewed in July 2026. Lift operations, opening dates and road conditions are live information and should be rechecked before setting out.</p>
          </section>

          <section className="about-related">
            <div className="about-section-heading"><p className="destination-eyebrow">Plan your trip</p><h2>Useful next reads</h2></div>
            <div>{ARTICLES.slice(0, 3).map((article) => <Link to={`/articles/${article.slug}`} key={article.slug}><MediaPlaceholder label={article.title} /><span>{article.category}</span><h3>{article.title}</h3></Link>)}</div>
          </section>

          <section className="destination-faq"><FaqAccordion items={ABOUT_FAQ} /></section>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
