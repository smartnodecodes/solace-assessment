import useSWR from 'swr';
import type { Advocate } from '@/types/global';
import { ALL_SPECIALTIES } from '@/lib/format';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useAdvocates() {
  const { data, error, isLoading, mutate } = useSWR<{ data: Advocate[] }>('/api/advocates', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  // Log unknown specialties
  if (data?.data) {
    const allSpecialties = new Set<string>();
    data.data.forEach(advocate => {
      advocate.specialties?.forEach(specialty => {
        allSpecialties.add(specialty);
      });
    });

    const unknownSpecialties = Array.from(allSpecialties).filter(
      specialty => !ALL_SPECIALTIES.includes(specialty as any)
    );

    if (unknownSpecialties.length > 0) {
      console.log('Unknown specialties found in database:', unknownSpecialties);
    }
  }

  const createAdvocate = async (advocateData: Omit<Advocate, 'id'>) => {
    try {
      const response = await fetch('/api/advocates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(advocateData),
      });

      if (!response.ok) {
        throw new Error('Failed to create advocate');
      }

      const newAdvocate = await response.json();
      
      // Update the local data with the new advocate
      mutate(
        { data: [...(data?.data || []), newAdvocate.data] },
        { revalidate: false }
      );

      return newAdvocate;
    } catch (error) {
      console.error('Error creating advocate:', error);
      throw error;
    }
  };

  return {
    advocates: data?.data || [],
    loading: isLoading,
    error,
    createAdvocate,
  };
}
