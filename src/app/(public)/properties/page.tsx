import type { Metadata } from 'next';
import ListingsClientPage from '@/components/property/ListingsClientPage';

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Browse luxury properties for sale and rent in Dubai. Villas, penthouses, apartments and more.',
};

export default function PropertiesPage() {
  return <ListingsClientPage />;
}
