import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll using IntersectionObserver
 * @param {Function} onLoadMore - Callback when bottom is reached
 * @param {boolean} isLoading - Is data currently loading
 * @param {boolean} hasMore - Are there more items to load
 * @param {string} rootMargin - How much before reaching bottom to trigger
 */
export const useInfiniteScroll = (
    onLoadMore,
    isLoading = false,
    hasMore = true,
    rootMargin = '500px' // Trigger 500px before reaching bottom
) => {
    const observerTarget = useRef(null);
    const isLoadingRef = useRef(isLoading);

    // Update ref when loading state changes
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        // Don't set up observer if no more data
        if (!hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // ✨ When bottom loader becomes visible
                    if (entry.isIntersecting && !isLoadingRef.current) {
                        console.log('📡 Bottom reached, loading more...');
                        onLoadMore();
                    }
                });
            },
            {
                root: null, // viewport
                rootMargin: rootMargin,
                threshold: 0 // trigger as soon as any part is visible
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        // Cleanup
        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
            observer.disconnect();
        };
    }, [hasMore, onLoadMore]);

    return observerTarget;
};

export default useInfiniteScroll;
