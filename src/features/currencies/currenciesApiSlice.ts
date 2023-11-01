import { createEntityAdapter, EntityAdapter, EntityState } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'
import { ICurrency } from '../../types/ICurrency'
import { setCurrencies, setCurrency } from './currencySlice'


const currenciesAdapter: EntityAdapter<ICurrency> = createEntityAdapter({
    sortComparer: (a: ICurrency, b: ICurrency) => a?.base < (b?.base) ? 1 : -1,
})
const initialState = currenciesAdapter.getInitialState({
})

export const currenciesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCurrencies: builder.query<EntityState<ICurrency>, {}>({
            query: () => ({
                url: '/currencies',
                validateStatus: (response: { status: number }, result: { isError: boolean }) => {
                    return response.status === 200 && !result.isError
                },
            }),
            //перед началом работы currentCurrency дб уже в redux
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    let filteredCurrency = {} as ICurrency | undefined;
                    const { data } = await queryFulfilled
                    const currencies: (ICurrency | undefined)[] = data?.ids.map(id => data.entities[id]);
                    const filteredId = data.ids.find(id => data.entities[id]?.base === true)
                    if (localStorage.getItem('currentCurrency')) {
                        filteredCurrency = JSON.parse(localStorage.getItem('currentCurrency') ?? '')
                    } else {
                        if (filteredId) {
                            if (data.entities[filteredId]) filteredCurrency = data.entities[filteredId]
                        }
                    }

                    if (filteredCurrency) dispatch(setCurrency(filteredCurrency))
                    if (currencies) dispatch(setCurrencies(currencies))

                } catch (err) {
                    console.log(err)
                }
            },
            transformResponse: (responseData: ICurrency[]): EntityState<ICurrency> => {
                const loadedCurrencies = responseData.map(currency => {
                    currency.id = currency._id
                    return currency
                });
                return currenciesAdapter.setAll(initialState, loadedCurrencies)
            },

            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Currency', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Currency' as const, id }))
                    ]
                } else return [{ type: 'Currency', id: 'LIST' }]
            }
        }),
        getOneCurrency: builder.query<EntityState<ICurrency>, { id: string }>({
            query: ({ id }) => ({
                url: `/currencies/${id}`,
                validateStatus: (response: { status: number }, result: { isError: boolean }) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (responseData: ICurrency): EntityState<ICurrency> => {
                responseData.id = responseData._id

                return currenciesAdapter.setOne(initialState, responseData)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Currency', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Currency' as const, id }))
                    ]
                } else return [{ type: 'Currency', id: 'LIST' }]
            }
        }),
        addNewCurrency: builder.mutation<EntityState<ICurrency>,
            {
                title: string,
                code: string,
                value: string,
                base: boolean
            }
        >({
            query: initialNote => ({
                url: '/currencies',
                method: 'POST',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: [
                { type: 'Currency', id: "LIST" }
            ]
        }),
        updateCurrency: builder.mutation<EntityState<ICurrency>,
            {
                id: string | undefined,
                title: string | undefined,
                code: string | undefined,
                value: string | undefined,
                base: boolean | undefined
            }
        >({
            query: initialNote => ({
                url: '/currencies',
                method: 'PATCH',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Currency', id: arg.id }
            ]
        }),

        updateCurrencyValues: builder.mutation<{ message: string }, { values: [string, number][] }>({
            query: values => ({
                url: '/currencies/values',
                method: 'PATCH',
                body: { ...values },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Currency' }
            ]
        }),

        deleteCurrency: builder.mutation<EntityState<ICurrency>, { id: string }>({
            query: ({ id }) => ({
                url: `/currencies`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Currency', id: arg.id }
            ],
        }),
    })
})

export const {
    useGetCurrenciesQuery,
    useGetOneCurrencyQuery,
    useAddNewCurrencyMutation,
    useUpdateCurrencyMutation,
    useUpdateCurrencyValuesMutation,
    useDeleteCurrencyMutation } = currenciesApiSlice