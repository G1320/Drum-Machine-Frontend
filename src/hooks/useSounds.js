//  Query V3
// import { useQuery } from 'react-query';
// import { useDispatch } from 'react-redux';
// import { getKitSounds } from '../services/kit-service';
// import { setError } from '../slices/errorSlice';

// export const useSounds = (kitId) => {
//   const dispatch = useDispatch();
//   return useQuery(['sounds', kitId], async () => await getKitSounds(kitId), {
//     placeholderData: [],
//     refetchOnMount: false,
//     onError: (error) => {
//       dispatch(setError(error?.response?.data || 'Error fetching sounds'));
//       console.error('Error fetching sounds:', error);
//     },
//   });
// };

//Query V3 Experimental persistance
import { QueryClient } from 'react-query';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { getKitSounds } from '../services/kit-service';
import { setError } from '../slices/errorSlice';

const cacheTime = 1000 * 60 * 60 * 24; // 24 hours

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
    },
  },
});

const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
  maxAge: cacheTime,
  hydrateOptions: {},
});

export const useSounds = (kitId) => {
  const dispatch = useDispatch();

  const persistedData = queryClient.getQueryData(['sounds', kitId]);

  return useQuery(['sounds', kitId], async () => await getKitSounds(kitId), {
    placeholderData: persistedData || [], // Use persisted data as placeholder if available
    onError: (error) => {
      dispatch(setError(error?.response?.data || 'Error fetching sounds'));
      console.error('Error fetching sounds:', error);
    },
  });
};

//  Query V4
// import { useQuery } from '@tanstack/react-query';
// import { getKitSounds } from '../services/kit-service';

// export const useSounds = (kitId) => {
//   return useQuery(['sounds', kitId], () => getKitSounds(kitId), {
//     initialData: [],
//   });
// };

//Query V5
// import { useQueryClient, useQuery } from '@tanstack/react-query';
// import { getKitSounds } from '../services/kit-service';

// export const useSounds = (kitId) => {
//   const queryClient = useQueryClient();

//   return useQuery(['sounds', kitId], () => getKitSounds(kitId), {
//     initialData: [],
//     queryClient,
//   });
// };

// import { useQueryClient, useQuery } from '@tanstack/react-query';
// import { getKitSounds } from '../services/kit-service';

// export const useSounds = (kitId) => {
//   const queryClient = useQueryClient();

//   return useQuery(['sounds', kitId], () => getKitSounds(kitId), {
//     initialData: [],
//     queryFn: () => getKitSounds(kitId),
//     queryClient,
//   });
// };
