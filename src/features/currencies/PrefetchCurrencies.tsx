import { useEffect, useState } from 'react'
import { useGetCurrencyLayersQuery } from './currencyLayersApiSlice'
import { useUpdateCurrencyValuesMutation } from './currenciesApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrencies } from './currencySlice'
import { PulseLoader } from 'react-spinners'
import { Outlet } from 'react-router-dom'
import { Alert } from 'react-bootstrap'


const PrefetchCurrencies = () => {
    const currencies = useSelector(selectCurrencies)

    const [isVisible, setVisible] = useState(true)

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

    if (isLayerError || isValuesError) content = <>
        {isVisible && <div className='container'> <p className="errmsg">Error: get new currencies</p></div>}
        <Outlet /></>;

    if (isLayerSuccuess) {

        currArr = Object.entries(currData!).map((item) => {
            item[0] = item[0].slice(3)
            return item
        })

        content = (
            <>
                {isVisible && <div className='container'>
                    <Alert variant="danger">
                        Currencies updated!
                    </Alert>
                </div>}

                <Outlet />
            </>
        );
    }

    useEffect(() => {
        updateCurrencyValues({ values: currArr })
    }, [currData])

    useEffect(() => {
        setTimeout(() => {
            setVisible(false)
        }, 10000)
    }, [isValuesSuccuess])

    return (
        <>
            {isValuesSuccuess && content}
        </>
    )
}

export default PrefetchCurrencies