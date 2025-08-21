import { useQueryClient } from '@tanstack/react-query';

/**
 * Utility hook that provides common TanStack Query operations
 */
export function useQueryUtils() {
  const queryClient = useQueryClient();

  /**
   * Invalidate and refetch queries by key pattern
   */
  const invalidateQueries = (queryKey: readonly unknown[]) => {
    return queryClient.invalidateQueries({ queryKey });
  };

  /**
   * Remove queries from cache by key pattern
   */
  const removeQueries = (queryKey: readonly unknown[]) => {
    return queryClient.removeQueries({ queryKey });
  };

  /**
   * Reset all queries in the cache
   */
  const resetQueries = () => {
    return queryClient.resetQueries();
  };

  /**
   * Get query data from cache
   */
  const getQueryData = <T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData<T>(queryKey);
  };

  /**
   * Set query data in cache
   */
  const setQueryData = <T>(queryKey: readonly unknown[], data: T) => {
    return queryClient.setQueryData<T>(queryKey, data);
  };

  /**
   * Prefetch a query
   */
  const prefetchQuery = async <T>(
    queryKey: readonly unknown[],
    queryFn: () => Promise<T>
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
  };

  /**
   * Cancel all queries
   */
  const cancelQueries = () => {
    return queryClient.cancelQueries();
  };

  /**
   * Get query state
   */
  const getQueryState = (queryKey: readonly unknown[]) => {
    return queryClient.getQueryState(queryKey);
  };

  /**
   * Check if query is fetching
   */
  const isFetching = (queryKey?: readonly unknown[]) => {
    return queryClient.isFetching(queryKey);
  };

  return {
    invalidateQueries,
    removeQueries,
    resetQueries,
    getQueryData,
    setQueryData,
    prefetchQuery,
    cancelQueries,
    getQueryState,
    isFetching,
  };
}

/**
 * Hook for managing optimistic updates with rollback capability
 */
export function useOptimisticUpdate<T>() {
  const queryClient = useQueryClient();

  const updateOptimistically = async <TData>(
    queryKey: readonly unknown[],
    updateFn: (oldData: TData | undefined) => TData,
    rollbackFn?: () => void
  ) => {
    try {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);
      
      // Optimistically update
      queryClient.setQueryData(queryKey, updateFn);
      
      return { previousData, success: true };
    } catch (error) {
      // Rollback on error
      if (rollbackFn) {
        rollbackFn();
      }
      return { previousData: undefined, success: false, error };
    }
  };

  const rollbackUpdate = <TData>(
    queryKey: readonly unknown[],
    previousData: TData | undefined
  ) => {
    if (previousData !== undefined) {
      queryClient.setQueryData(queryKey, previousData);
    }
  };

  return {
    updateOptimistically,
    rollbackUpdate,
  };
}

/**
 * Hook for managing query subscriptions
 */
export function useQuerySubscription() {
  const queryClient = useQueryClient();

  const subscribeToQuery = <T>(
    queryKey: readonly unknown[],
    callback: (data: T | undefined) => void
  ) => {
    return queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.query.queryKey === queryKey) {
        callback(event.query.state.data as T);
      }
    });
  };

  return {
    subscribeToQuery,
  };
}
