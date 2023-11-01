import React from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentCurrency } from '../features/currencies/currencySlice';

interface CurrencyConvertorProps {
    price: number | undefined;
}

const CurrencyConvertor = ({ price }: CurrencyConvertorProps) => {
    const currentCurrency = useSelector(selectCurrentCurrency)

    return (
        <>{currentCurrency.code}{price ? +(currentCurrency.value * price).toFixed(1) : 0}</>
    )
}

export default CurrencyConvertor