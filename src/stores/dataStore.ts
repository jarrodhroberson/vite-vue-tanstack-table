import { defineStore } from 'pinia';
import {computed, ref} from 'vue';
import axios from 'axios';

interface Money {
    amount: number
    currency: string
}

// Define the type of data you're working with
interface Allocation {
    creator_id: string
    amount: Money
    created_at: string
}

export const useDataStore = defineStore('data', () => {
    const data = ref<Allocation[]>([]);
    const isLoading = ref(false);
    const error = ref<any>(null);
    const isLoaded = computed(() => data.value.length > 0)

    function fetchData() {
        isLoading.value = true;
        error.value = null;
        try {
            data.value = [];
            const eventSource = new EventSource('http://localhost:5173/allocations');

            eventSource.addEventListener('allocation', (event) => {
                const allocation = JSON.parse(event.data);
                data.value.push(allocation);
                console.log('loaded allocation: ', allocation.creator_id);
                console.log('data loaded',data.value.length);
            });

            eventSource.addEventListener('error', (error) => {
                throw error;
            });

            eventSource.addEventListener('complete', () => {
                eventSource.close();
                isLoading.value = false;
                console.log('finally: data loaded',data.value.length);
            });

        } catch (error: any) {
            error.value = error;
            console.error('Error fetching data:', error);
        }
    }

    return {
        data,
        isLoading,
        isLoaded,
        error,
        fetchData,
    };
});