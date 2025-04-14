import { createSelector, createEntityAdapter, EntityState, EntityId } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'
import { IProduct } from '../../types/IProduct'
import { RootState } from "../../app/store"


export interface ProductsResponse {
    // ids: EntityId[],
    // entities: Dictionary<IProduct>
    products: IProduct[];
};
export type IProductsCount = EntityState<IProduct> & { count: number }
export type IAllProducts = EntityState<IProduct> & { products: IProduct[] } & { productsCount: number } & { resultPerPage: number } & { filteredProductsCount: number };
export type IAllProductsEnter = { products: IProduct[] } & { productsCount: number } & { resultPerPage: number } & { filteredProductsCount: number };
export type ICategoryIdQuery = { categoryId: string | undefined; query: string }

const productsAdapter = createEntityAdapter({
    // sortComparer: (a: IProductsCount, b: IProductsCount) => a.entities[ids[0]]?.title.localeCompare(b.entities[ids[0]]?.title),
})
const initialState = productsAdapter.getInitialState<IProductsCount>({
    ids: [],
    entities: {},
    count: 0
})
const initialAllState = productsAdapter.getInitialState<IAllProducts>({
    ids: [],
    entities: {},
    products: [],
    productsCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0
})

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCount: builder.query<IProductsCount, (string & string)>({
            query: (categoryId = '', query = '') => ({
                url: categoryId !== 'productsList' ? `/products/count/${categoryId}` : `/products/count/${query}`,
                validateStatus: (response: { status: number; }, result: { isError: Boolean; }) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (count: number): IProductsCount => {
                initialState.count = count;
                return productsAdapter.setOne(initialState, { count })
            },
            providesTags: ['Product'],
        }),
        getProducts: builder.query<IProductsCount, string>({
            query: (query = '') => ({
                url: query !== 'productsList' ? `/products/${query}` : `/products`,
                validateStatus: (response: { status: number; }, result: { isError: Boolean; }) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (responseData: IProduct[]): IProductsCount => {
                const loadedProducts = responseData.map(product => {
                    product.id = product._id
                    return product
                });
                return productsAdapter.setAll(initialState, loadedProducts)
            },
            providesTags: (result: IProductsCount | undefined, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Product', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Product' as const, id }))
                    ]
                } else return [{ type: 'Product', id: 'LIST' }]
            }
        }),
        getProductsByCategoryId: builder.query<IProductsCount, ICategoryIdQuery>({
            query: ({ categoryId, query }) => ({
                url: `/products/${categoryId}/${query}`,
                validateStatus: (response: { status: number; }, result: { isError: Boolean; }) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (responseData: IProduct[]): IProductsCount => {
                const loadedProducts = responseData.map(product => {
                    product.id = product._id
                    return product
                });
                return productsAdapter.setAll(initialState, loadedProducts)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Product', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Product' as const, id }))
                    ]
                } else return [{ type: 'Product', id: 'LIST' }]
            }
        }),
        //     query: (query) => ({
        //         url: `/products/search/${query}`,
        //         validateStatus: (response: any, result: any) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     }),
        //     transformResponse: (responseData: IProduct[]): IProductsCount => {
        //         const loadedProducts = responseData.map(product => {
        //             product.id = product._id
        //             return product
        //         });
        //         return productsAdapter.setAll(initialState, loadedProducts)
        //     },
        //     providesTags: (result, error, arg) => {
        //         if (result?.ids) {
        //             return [
        //                 { type: 'Product', id: 'LIST' },
        //                 ...result.ids.map(id => ({ type: 'Product' as const, id }))
        //             ]
        //         } else return [{ type: 'Product', id: 'LIST' }]
        //     }
        // }),
        addNewProduct: builder.mutation({
            query: (initialProductData) => {
                // const body = new FormData();
                // body.append('Content-Type', initialProductData.file.type);
                // body.append('productImg', initialProductData.file);
                // body.append('title', initialProductData.title);
                // body.append('description', initialProductData.description);
                // body.append('price', initialProductData.price.toString());
                // body.append('rating', initialProductData.rating.toString());
                // body.append('category', initialProductData.category);
                return {
                    // headers: {
                    //     "Content-Type": "multipart/form-data",
                    // },
                    url: '/products',
                    method: 'POST',
                    body: initialProductData,
                }
            },
            invalidatesTags: [
                { type: 'Product', id: "LIST" }
            ]
        }),
        updateProduct: builder.mutation({
            query: (initialProductData) => {

                return {
                    url: '/products',
                    method: 'PATCH',
                    body: initialProductData,
                }
            },
            invalidatesTags: (result, error, arg) => [
                { type: 'Product', id: arg.id }
            ]
        }),
        deleteProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/products`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Product', id: arg.id }
            ]
        }),
        createProductReview: builder.mutation({
            query: (myForm) => ({
                url: `/products/review`,
                method: 'PATCH',
                body: myForm,
            }),
            invalidatesTags: [
                { type: 'Product', id: "LIST" }
            ]
        }),
        deleteProductReview: builder.mutation({
            query: ({ productId, reviewId }) => ({
                url: `/products/reviews/${productId}?id=${reviewId}`,
                method: 'delete',
                body: { productId },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Product', id: arg.productId }
            ]
        }),
        getAllProducts: builder.query<IAllProducts, string>({
            query: (query = '') => ({
                url: `/products/all/products/${query}`,
                validateStatus: (response: { status: number; }, result: { isError: Boolean; }) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // transformResponse: (responseData: IAllProductsEnter): IAllProducts => {
            //     const loadedProduct = responseData?.products.map((product: IProduct) => {
            //         product.id = product._id
            //         return product
            //     });


            //     return productsAdapter.setAll(initialAllState, {
            //         ids: loadedProduct.map(product => product._id),
            //         entities: loadedProduct.forEach(product => {
            //             return { product: product }
            //         }),
            //         productsCount: responseData.productsCount,
            //         resultPerPage: responseData.resultPerPage,
            //         filteredProductsCount: responseData.filteredProductsCount,

            //     })
            // },
            providesTags: (result: IAllProducts | undefined, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Product', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Product' as const, id }))
                    ]
                } else return [{ type: 'Product', id: 'LIST' }]
            }
        }),
    }),
})

export const { useGetProductsQuery, useAddNewProductMutation,
    useUpdateProductMutation, useGetCountQuery,
    useDeleteProductMutation, useGetProductsByCategoryIdQuery, useCreateProductReviewMutation,
    useDeleteProductReviewMutation, useGetAllProductsQuery, useLazyGetAllProductsQuery
} = productsApiSlice

// returns the query result object
//@ts-ignore
export const selectProductsResult = productsApiSlice.endpoints.getProducts.select()

// creates memoized selector
const selectProductsData = createSelector(
    selectProductsResult,
    productsResult => productsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    selectIds: selectProductIds,
    // Pass in a selector that returns the users slice of state
} = productsAdapter.getSelectors((state: RootState) => selectProductsData(state) ?? initialState)