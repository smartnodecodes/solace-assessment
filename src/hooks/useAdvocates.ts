import useSWR from 'swr';
import { useState, useEffect } from 'react';
import type { Advocate } from '@/types/global';
import { ALL_SPECIALTIES } from '@/lib/format';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ApiResponse {
  data: Advocate[];
  pagination: PaginationData;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useAdvocates(page: number = 1, limit: number = 10, selectedSpecialties: string[] = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); 

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    `/api/advocates?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearchTerm)}&specialties=${encodeURIComponent(JSON.stringify(selectedSpecialties))}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

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
      
      mutate(
        { 
          data: [...(data?.data || []), newAdvocate.data],
          pagination: data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            itemsPerPage: limit
          }
        },
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
    pagination: data?.pagination || {
      currentPage: page,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: limit
    },
    loading: isLoading,
    error,
    createAdvocate,
    searchTerm,
    setSearchTerm,
  };
}
