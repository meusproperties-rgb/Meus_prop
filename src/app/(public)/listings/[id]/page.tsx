import PropertyDetailPage, { generateMetadata } from '@/app/(public)/properties/[id]/page';

export { generateMetadata };

interface ListingDetailPageProps {
  params: { id: string };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  return <PropertyDetailPage params={params} />;
}
