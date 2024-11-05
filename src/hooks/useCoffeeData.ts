import { useQuery } from '@tanstack/react-query';
import { Coffee } from '../types/coffee';

const fetchCoffeeData = async (): Promise<Coffee[]> => {
    const resp = await fetch('https://api.sampleapis.com/coffee/hot').then(res => res.json());
    return resp;
};

export const useCoffeeData = () => {
    return useQuery({
        queryKey: ['coffeeData'],
        queryFn: fetchCoffeeData,
        staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
        retry: 3, // Will retry failed requests 3 times
    });
}; 