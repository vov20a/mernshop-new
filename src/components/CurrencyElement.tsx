import React, { useEffect, useState } from 'react'
import { ICurrency } from '../types/ICurrency';
import { useActions } from '../hooks/actions';
import { useGetCurrenciesQuery } from '../features/currencies/currenciesApiSlice';
import CurrenciesOptions from './CurrenciesOptions';



interface CurrencyElementProps {
    background: string
}


const CurrencyElement = ({ background }: CurrencyElementProps) => {
    const { setCurrency, setCurrencies } = useActions()

    const { currencies, isSuccessCurr, } = useGetCurrenciesQuery('currenciesList', {
        selectFromResult: ({ data, isSuccess, }) => ({
            currencies: data?.ids.map(id => data.entities[id]),
            isSuccessCurr: isSuccess,
        })
    })

    const [titleCurrency, setTitleCurrency] = useState('')

    const onCurrencyChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setTitleCurrency(e.target.value)

    useEffect(() => {
        const filteredCurrency = currencies?.find((curr) => curr?.title === titleCurrency)
        if (filteredCurrency) setCurrency(filteredCurrency)
    }, [titleCurrency])

    let contentCurrenciesOptions;
    let currentCurrency: ICurrency = {} as ICurrency;
    if (isSuccessCurr) {
        //установка currentCurrency в шапке    
        const currString = localStorage.getItem('currentCurrency')
        if (currString) currentCurrency = JSON.parse(currString)

        contentCurrenciesOptions = <CurrenciesOptions currencies={currencies} />
    }
    return (
        // <div className="button-dash" title="Change currency">
        <select style={{ backgroundColor: background }}
            id="currencies"
            name="currencies"
            className="form__select"
            value={currentCurrency.title ?? titleCurrency}
            onChange={onCurrencyChanged}
        >
            {/* <option value='' disabled>SELECT...</option> */}
            {contentCurrenciesOptions}
        </select>
        // </div>
    )
}

export default CurrencyElement