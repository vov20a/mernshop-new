import React from 'react'
import useTitle from '../../hooks/useTitle';
import { useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { useGetCurrenciesQuery } from './currenciesApiSlice';
import EditCurrencyForm from './EditCurrencyForm';
import useAuth from '../../hooks/useAuth';
import { ICurrency } from '../../types/ICurrency';

const EditCurrency = () => {
    useTitle('Edit Currency');

    const { id } = useParams();
    const { isManager, isAdmin } = useAuth();

    const { currency, isLoading, isSuccess, isError, error } = useGetCurrenciesQuery('currenciesList', {
        selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
            currency: data?.entities[id ?? ''],
            isLoading, isSuccess, isError, error
        }),
    });

    if (!isManager && !isAdmin) {
        return <p className="errmsg">No access</p>;
    }

    let content;

    if (isLoading) content = <PulseLoader color={'#000'} className='pulse-loader' />;
    if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
    if (isSuccess) content = <EditCurrencyForm currency={currency} />;

    return <>{content}</>;
}

export default EditCurrency