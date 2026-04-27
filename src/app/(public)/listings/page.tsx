import PropertiesPage, { metadata } from '@/app/(public)/properties/page';

export { metadata };

interface ListingsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  return <PropertiesPage searchParams={searchParams} />;
}
