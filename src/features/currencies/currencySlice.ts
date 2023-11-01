import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from "../../app/store"
import { ICurrency } from '../../types/ICurrency'


interface CurrencySliceState {
    currency: ICurrency
    currencies: (ICurrency | undefined)[]
}

const initialState: CurrencySliceState = {
    currency: JSON.parse(localStorage.getItem('currentCurrency')!),
    currencies: JSON.parse(localStorage.getItem('currencies')!)
}
const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<ICurrency>) => {
            localStorage.setItem('currentCurrency', JSON.stringify(action.payload))
            state.currency = action.payload;
        },
        setCurrencies: (state, action: PayloadAction<(ICurrency | undefined)[]>) => {
            localStorage.setItem('currencies', JSON.stringify(action.payload))
            if (action.payload) state.currencies = action.payload;
        },

        deleteCurrency: (state, action: PayloadAction<ICurrency>) => {

            const currencies = state.currencies
            if (state.currency.id === action.payload.id) {
                const baseCurr = currencies.find(currency => {
                    if (currency?.base === true) return currency
                })
                if (baseCurr) state.currency = baseCurr

                localStorage.setItem('currentCurrency', JSON.stringify(baseCurr))
            }

        }
    }
})
export const { setCurrency, setCurrencies, deleteCurrency } = currencySlice.actions
export const selectCurrentCurrency = (state: RootState) => state.currency.currency
export const selectCurrencies = (state: RootState) => state.currency.currencies

export const currencyActions = currencySlice.actions;

export default currencySlice.reducer