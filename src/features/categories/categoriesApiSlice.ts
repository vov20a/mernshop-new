import { createEntityAdapter, EntityState, EntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'
import { ICategory } from '../../types/ICategory'


const categoriesAdapter: EntityAdapter<ICategory> = createEntityAdapter({
    // sortComparer:()=>
})
const initialState = categoriesAdapter.getInitialState({})

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query<EntityState<ICategory>, {}>({
            query: () => ({
                url: '/categories',
                validateStatus: (response: { status: number }, result: { isError: boolean }) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (responseData: ICategory[]) => {
                const loadedCategories = responseData.map(category => {
                    category.id = category._id
                    return category
                });
                return categoriesAdapter.setAll(initialState, loadedCategories)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Category', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Category' as const, id }))
                    ]
                } else return [{ type: 'Category', id: 'LIST' }]
            }
        }),
        getOneCategory: builder.query<EntityState<ICategory>, { title: string }>({
            query: ({ title }) => ({
                url: `/categories/${title}`,
                validateStatus: (response: any, result: any) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (responseData: ICategory) => {
                responseData.id = responseData._id

                return categoriesAdapter.setOne(initialState, responseData)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Category', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Category' as const, id }))
                    ]
                } else return [{ type: 'Category', id: 'LIST' }]
            }
        }),
        addNewCategory: builder.mutation
            <
                EntityState<ICategory>,
                {
                    title: string;
                    parentCategory: null | string;
                }
            >
            ({
                query: initialData => ({
                    url: '/categories',
                    method: 'POST',
                    body: {
                        ...initialData,
                    }
                }),
                invalidatesTags: [
                    { type: 'Category', id: "LIST" }
                ]
            }),
        updateCategory: builder.mutation
            <
                EntityState<ICategory>,
                {
                    id: string | undefined;
                    title: string | undefined;
                    parentCategory: null | string;
                }
            >
            ({
                query: initialData => ({
                    url: '/categories',
                    method: 'PATCH',
                    body: {
                        ...initialData,
                    }
                }),
                invalidatesTags: (result, error, arg) => [
                    { type: 'Category', id: arg.id }
                ]
            }),
        deleteCategory: builder.mutation<EntityState<ICategory>, { id: string | undefined }>({
            query: ({ id }) => ({
                url: `/categories`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Category', id: arg.id }
            ]
        }),
    })
})

export const { useGetCategoriesQuery, useGetOneCategoryQuery, useAddNewCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoriesApiSlice