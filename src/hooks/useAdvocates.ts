import useSWR from 'swr';
import type { Advocate } from '@/types/global';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useAdvocates() {
  const { data, error, isLoading } = useSWR<{ data: Advocate[] }>('/api/advocates', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  return {
    advocates: data?.data || [],
    loading: isLoading,
    error,
  };
}
