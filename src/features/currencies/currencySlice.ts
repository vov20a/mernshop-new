import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from "../../app/store"
import { ICurrency } from '../../types/ICurrency'

interface CurrencySliceState {
    currency: ICurrency
}
const initialState: CurrencySliceState = {
    currency: {} as ICurrency,
}
const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<ICurrency>) => {
            localStorage.setItem('currentCurrency', JSON.stringify(action.payload))
            state.currency = action.payload;
        },

        deleteCurrency: (state) => {
            localStorage.removeItem('currentCurrency')
            state.currency = {} as ICurrency
        },

    }
})
export const { setCurrency, deleteCurrency } = currencySlice.actions
export const selectCurrentCurrency = (state: RootState) => state.currency.currency

export const currencyActions = currencySlice.actions;

export default currencySlice.reducer