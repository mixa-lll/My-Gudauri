import { Badge } from '../UI/Badge/Badge';
import { ListingCardFrame, ListingCardAction, Price, Rating } from './ListingCard';

function Tags({ items = [] }) {
  return items.slice(0, 3).map((item) => <Badge key={item} size="sm" mediaOverlay>{item}</Badge>);
}

/** @typedef {{slug:string,title:string,image?:string,description?:string,rating:number,reviews?:number|string,price:string,priceSuffix?:string,tags?:string[]}} ActivityCardData */
/** @param {{item: ActivityCardData, basePath?: string}} props */
export function ActivityCard({ item, basePath = '/activities' }) {
  return <ListingCardFrame to={`${basePath}/${item.slug}`} image={item.image} imageAlt={item.title} title={item.title} description={item.description} mediaTop={<Badge mediaOverlay>{item.category ?? 'Activity'}</Badge>} mediaBottom={<Tags items={item.tags} />} footer={<><Rating rating={item.rating} reviews={item.reviews} /><Price price={item.price} suffix={item.priceSuffix} /></>} />;
}

/** @typedef {{slug:string,title:string,image?:string,description?:string,price:string,unit:string,equipmentType:string,availability?:string}} RentalCardData */
/** @param {{item: RentalCardData, basePath?: string}} props */
export function RentalCard({ item, basePath = '/rental' }) {
  return <ListingCardFrame to={`${basePath}/${item.slug}`} image={item.image} imageAlt={item.title} title={item.title} description={item.description} mediaTop={<Badge mediaOverlay>{item.equipmentType}</Badge>} mediaBottom={item.availability ? <Badge tone="success" mediaOverlay>{item.availability}</Badge> : null} footer={<><Price price={item.price} suffix={item.unit} /><ListingCardAction>View equipment</ListingCardAction></>} />;
}

/** @typedef {{slug:string,title:string,image?:string,description?:string,price:string,route:string,duration:string,vehicle?:string}} TransferCardData */
/** @param {{item: TransferCardData, basePath?: string}} props */
export function TransferCard({ item, basePath = '/transfer' }) {
  return <ListingCardFrame to={`${basePath}/${item.slug}`} image={item.image} imageAlt={item.title} title={item.title} description={item.description} mediaTop={<Badge mediaOverlay>{item.route}</Badge>} mediaBottom={<Tags items={[item.duration, item.vehicle].filter(Boolean)} />} footer={<><Price price={item.price} suffix="per vehicle" /><ListingCardAction>Transfer details</ListingCardAction></>} />;
}

/** @typedef {{slug:string,title:string,image?:string,excerpt?:string,category:string,readingTime:string,publishedAt?:string}} EditorialCardData */
/** @param {{item: EditorialCardData, basePath?: string}} props */
export function EditorialCard({ item, basePath = '/articles' }) {
  return <ListingCardFrame to={`${basePath}/${item.slug}`} image={item.image} imageAlt={item.title} title={item.title} description={item.excerpt} mediaTop={<Badge mediaOverlay>{item.category}</Badge>} mediaBottom={item.publishedAt ? <Badge mediaOverlay>{item.publishedAt}</Badge> : null} footer={<ListingCardAction>{item.readingTime}</ListingCardAction>} />;
}
