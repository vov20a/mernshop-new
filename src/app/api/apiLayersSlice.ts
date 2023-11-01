import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


export const apiLayersSlice = createApi({
    reducerPath: 'currentLayers/api',
    baseQuery: fetchBaseQuery({
        headers: {
            apikey: 'TE8Q9VjGAD82MncNDnGtUECXlXLWcP4O',
        },
        baseUrl: 'https://api.apilayer.com',
    }),
    tagTypes: ['LayersCurrency'],
    endpoints: (builder) => ({}),
});