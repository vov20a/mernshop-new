import { useEffect } from 'react'
import { useGetCurrencyLayersQuery } from './currencyLayersApiSlice'
import { useUpdateCurrencyValuesMutation } from './currenciesApiSlice'
import CurrenciesList from './CurrenciesList'
import { useSelector } from 'react-redux'
import { selectCurrencies } from './currencySlice'
import { PulseLoader } from 'react-spinners'


const PreCurrenciesList = () => {
    const currencies = useSelector(selectCurrencies)

    let currs: string = ``
    currencies.map((currency) => {
        if (currency?.title === "USD") currs = currs.concat(`${currency.title}`)
        else currs = currs.concat('%2C', `${currency?.title}`)
    })

    // console.log(currs)
    const { isLoading: isLayerLoading, isSuccess: isLayerSuccuess, isError: isLayerError, data: currData, error } = useGetCurrencyLayersQuery(currs)
    const [updateCurrencyValues, { isError: isValuesError, isLoading: isLoadingValues, isSuccess: isValuesSuccuess, data: valuesData }] = useUpdateCurrencyValuesMutation()

    let content;
    let currArr: [string, number][] = []
    if (isLayerLoading) content = <PulseLoader color={'#000'} className="pulse-loader" />;

    if (isLayerError || isValuesError) content = <p className="errmsg">Error get value</p>;

    if (isLayerSuccuess) {

        currArr = Object.entries(currData!).map((item) => {
            item[0] = item[0].slice(3)
            return item
        })

        content = (
            <CurrenciesList />
        );
    }

    useEffect(() => {
        updateCurrencyValues({ values: currArr })
    }, [currData])


    return (
        <>
            {isValuesSuccuess && content}
        </>
    )
}

export default PreCurrenciesList