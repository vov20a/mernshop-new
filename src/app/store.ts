import { apiSlice } from "./api/apiSlice";
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import authReducer from '../features/auth/authSlice'
import currencyReducer from '../features/currencies/currencySlice'
import { apiLayersSlice } from "./api/apiLayersSlice";
import { cartReducer } from '../features/cart/cartSlice'
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [apiLayersSlice.reducerPath]: apiLayersSlice.reducer,
        auth: authReducer,
        cart: cartReducer,
        currency: currencyReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware).concat(apiLayersSlice.middleware),
    // devTools: true
    devTools: false
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();