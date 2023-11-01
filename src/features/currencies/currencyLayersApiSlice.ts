
import { ICurrValue, ICurrencyLayers } from '../../types/ICurrLayers';
import { apiLayersSlice } from '../../app/api/apiLayersSlice';


export const currentLayersApiSlice = apiLayersSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencyLayers: builder.query<ICurrValue, string>({
      query: (currencies: string) => ({
        url: 'currency_data/live',
        params: {
          // q: `source=USD&currencies=${currencies.EUR}%2C${currencies.RUB}`,
          q: `source=USD&currencies=${currencies}`,
        },
      }),
      transformResponse: (response: ICurrencyLayers) => response.quotes,

    }),
  }),
});
export const { useGetCurrencyLayersQuery, } = currentLayersApiSlice;
