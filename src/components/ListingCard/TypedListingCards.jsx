import { Badge } from '../UI/Badge/Badge';
import { ListingCardFrame, ListingCardAction, ListingCardPill, Price, Rating } from './ListingCard';

function Tags({ items = [] }) {
  return items.filter(Boolean).slice(0, 3).map((item) => <ListingCardPill key={item}>{item}</ListingCardPill>);
}

function sharedProps(item, props = {}) {
  const title = item.title ?? item.name;
  return {
    className: props.className,
    layout: props.layout,
    headingLevel: props.headingLevel,
    loading: props.loading,
    image: item.image,
    imageAlt: title,
    title,
    description: item.description ?? item.excerpt
  };
}

function CommerceFooter({ item }) {
  return <>{item.rating ? <Rating rating={item.rating} reviews={item.reviews} /> : null}{item.price ? <Price price={item.price} suffix={item.priceSuffix ?? item.unit} /> : null}</>;
}

/** @typedef {{slug:string,title?:string,name?:string,image?:string,description?:string,category?:string,rating?:number|string,reviews?:number|string,price?:string,priceSuffix?:string,tags?:string[]}} ActivityCardData */
/** @param {{item: ActivityCardData, basePath?: string, layout?: 'vertical'|'horizontal'|'featured', headingLevel?: number, className?: string, loading?: 'lazy'|'eager'}} props */
export function ActivityCard({ item, basePath = '/activities', ...props }) {
  return <ListingCardFrame {...sharedProps(item, props)} to={`${basePath}/${item.slug}`} mediaTop={<ListingCardPill>{item.category ?? 'Activity'}</ListingCardPill>} mediaBottom={<Tags items={item.tags} />} footer={<CommerceFooter item={item} />} />;
}

/** @typedef {{slug:string,title?:string,name?:string,image?:string,description?:string,category?:string,equipmentType?:string,rating?:number|string,reviews?:number|string,price?:string,priceSuffix?:string,unit?:string,availability?:string,tags?:string[]}} RentalCardData */
/** @param {{item: RentalCardData, basePath?: string, layout?: 'vertical'|'horizontal'|'featured', headingLevel?: number, className?: string, loading?: 'lazy'|'eager'}} props */
export function RentalCard({ item, basePath = '/rental', ...props }) {
  return <ListingCardFrame {...sharedProps(item, props)} to={`${basePath}/${item.slug}`} mediaTop={<ListingCardPill>{item.equipmentType ?? item.category ?? 'Rental'}</ListingCardPill>} mediaBottom={item.availability ? <Badge tone="success" mediaOverlay>{item.availability}</Badge> : <Tags items={item.tags} />} footer={<CommerceFooter item={item} />} />;
}

/** @typedef {{slug:string,title?:string,name?:string,image?:string,description?:string,category?:string,route?:string,duration?:string,vehicle?:string,rating?:number|string,reviews?:number|string,price?:string,priceSuffix?:string,tags?:string[]}} TransferCardData */
/** @param {{item: TransferCardData, basePath?: string, layout?: 'vertical'|'horizontal'|'featured', headingLevel?: number, className?: string, loading?: 'lazy'|'eager'}} props */
export function TransferCard({ item, basePath = '/transfers', ...props }) {
  const tags = item.tags?.length ? item.tags : [item.duration, item.vehicle];
  return <ListingCardFrame {...sharedProps(item, props)} to={`${basePath}/${item.slug}`} mediaTop={<ListingCardPill>{item.route ?? item.category ?? 'Transfer'}</ListingCardPill>} mediaBottom={<Tags items={tags} />} footer={<CommerceFooter item={item} />} />;
}

/** @typedef {{slug:string,title?:string,name?:string,image?:string,description?:string,category?:string,rating?:number|string,reviews?:number|string,price?:string,priceSuffix?:string,tags?:string[]}} StayCardData */
/** @param {{item: StayCardData, basePath?: string, layout?: 'vertical'|'horizontal'|'featured', headingLevel?: number, className?: string, loading?: 'lazy'|'eager'}} props */
export function StayCard({ item, basePath = '/stays', ...props }) {
  return <ListingCardFrame {...sharedProps(item, props)} to={`${basePath}/${item.slug}`} mediaTop={<ListingCardPill>{item.category ?? 'Stay'}</ListingCardPill>} mediaBottom={<Tags items={item.tags} />} footer={<CommerceFooter item={item} />} />;
}

/** @typedef {{slug:string,name:string,image?:string,description?:string,cardFocus?:string,certificate?:string,rating?:number|string,reviews?:number|string,experienceYears?:number,languages?:Array<{code:string,name:string}>,sports?:Array<{slug:string,name:string,icon?:string}>,tags?:string[]}} InstructorCardData */
/** @param {{item?: InstructorCardData, instructor?: InstructorCardData, basePath?: string, layout?: 'vertical'|'horizontal'|'featured', headingLevel?: number, className?: string, loading?: 'lazy'|'eager'}} props */
export function InstructorCard({ item, instructor, basePath = '/instructors', ...props }) {
  const data = item ?? instructor;
  const focus = data.cardFocus || data.tags?.filter((tag) => !/private|intermediate|advanced/i.test(tag)).slice(0, 2).join(' · ') || data.description;
  const normalized = { ...data, description: focus };
  return <ListingCardFrame {...sharedProps(normalized, props)} mediaPosition="top" to={`${basePath}/${data.slug}`} titleMeta={data.certificate ? <Badge size="sm" title={data.certificate}>Verified</Badge> : null} mediaTop={<>{(data.languages ?? []).map((language) => <ListingCardPill key={language.code} title={language.name}>{language.code}</ListingCardPill>)}</>} mediaBottom={<>{(data.sports ?? []).map((sport) => <ListingCardPill icon={sport.icon} key={sport.slug}>{sport.name}</ListingCardPill>)}</>} footer={<><Rating rating={data.rating} reviews={`${data.experienceYears || 1}+ years`} /><ListingCardAction>View profile</ListingCardAction></>} />;
}

/** @typedef {{slug:string,title?:string,name?:string,image?:string,excerpt?:string,description?:string,category?:string,readingTime?:string,readTime?:string,publishedAt?:string}} EditorialCardData */
/** @param {{item: EditorialCardData, basePath?: string, layout?: 'vertical'|'horizontal'|'featured', headingLevel?: number, className?: string, loading?: 'lazy'|'eager'}} props */
export function EditorialCard({ item, basePath = '/articles', ...props }) {
  return <ListingCardFrame {...sharedProps(item, props)} to={`${basePath}/${item.slug}`} mediaTop={<ListingCardPill>{item.category ?? 'Article'}</ListingCardPill>} mediaBottom={item.publishedAt ? <ListingCardPill>{item.publishedAt}</ListingCardPill> : null} footer={<ListingCardAction>{item.readingTime ?? item.readTime ?? 'Read article'}</ListingCardAction>} />;
}
