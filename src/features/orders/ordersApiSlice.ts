import { createSelector, createEntityAdapter, EntityState, EntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { IOrder, IProductInfo } from '../../types/IOrder';
import { RootState } from '../../app/store';


// export interface ProductsResponse {
//     ids: string[],
//     entities: { id: string }
// };

const ordersAdapter: EntityAdapter<IOrder> = createEntityAdapter({
    // sortComparer:()=>
});
const initialState = ordersAdapter.getInitialState({});

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<EntityState<IOrder>, {}>({
            query: () => ({
                url: '/orders',
                validateStatus: (response: { status: number }, result: { isError: boolean }) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData: IOrder[]) => {
                const loadedOrders = responseData.map((order) => {
                    order.id = order._id;
                    return order;
                });
                return ordersAdapter.setAll(initialState, loadedOrders);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Order', id: 'LIST' },
                        ...result.ids.map((id) => ({ type: 'Order' as const, id })),
                    ];
                } else return [{ type: 'Order', id: 'LIST' }];
            },
        }),
        getOrdersByUserId: builder.query<EntityState<IOrder>, { userId: string }>({
            query: ({ userId }) => ({
                url: `/orders/${userId}`,
                validateStatus: (response: { status: number }, result: { isError: boolean }) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: (responseData: IOrder[]) => {
                const loadedOrders = responseData.map((order) => {
                    order.id = order._id;
                    return order;
                });
                return ordersAdapter.setAll(initialState, loadedOrders);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Order', id: 'LIST' },
                        ...result.ids.map((id) => ({ type: 'Order' as const, id })),
                    ];
                } else return [{ type: 'Order', id: 'LIST' }];
            },
        }),
        addNewOrder: builder.mutation
            <EntityState<IOrder>,
                {
                    fullName: string;
                    email: string;
                    phone: string;
                    user: string;
                    totalPrice: number;
                    productsInfo: IProductInfo[];
                }
            >
            ({
                query: (initialOrderData) => ({
                    url: '/orders',
                    method: 'POST',
                    body: {
                        ...initialOrderData,
                    },
                }),
                invalidatesTags: [{ type: 'Order', id: 'LIST' }],
            }),
        updateOrder: builder.mutation<
            EntityState<IOrder>,
            {
                id: string | undefined;
                fullName: string | undefined;
                email: string | undefined;
                phone: string | undefined;
                user: string | undefined;
                totalPrice: number | undefined;
                productsInfo: IProductInfo[] | undefined;
            }
        >({
            query: (initialOrderData) => ({
                url: '/orders',
                method: 'PATCH',
                body: {
                    ...initialOrderData,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }],
        }),
        deleteOrder: builder.mutation<EntityState<IOrder>, { id: string | undefined }>({
            query: ({ id }) => ({
                url: `/orders`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useAddNewOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useGetOrdersByUserIdQuery,
} = ordersApiSlice;

// returns the query result object

export const selectOrdersResult = ordersApiSlice.endpoints.getOrders.select({});

// creates memoized selector
const selectOrdersData = createSelector(
    selectOrdersResult,
    (ordersResult) => ordersResult.data, // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllOrders,
    selectById: selectOrderById,
    selectIds: selectOrderIds,
    // Pass in a selector that returns the users slice of state
} = ordersAdapter.getSelectors((state: RootState) => selectOrdersData(state) ?? initialState);
