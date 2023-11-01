import { useGetCurrenciesQuery, useUpdateCurrencyValuesMutation } from './currenciesApiSlice';
import Currency from './Currency';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import { EntityId } from '@reduxjs/toolkit';


const CurrenciesList = () => {
    useTitle('Currencies List');
    const date = new Date().toLocaleString('ru-RU', {
        // day: 'numeric',
        // month: 'long',
        // year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    })

    const {
        data: currencies,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetCurrenciesQuery('currenciesList', {
        // pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });
    // console.log('first', categories)

    let content;

    if (isLoading) content = <PulseLoader color={'#000'} className="pulse-loader" />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }

    if (isSuccess) {
        const { ids, entities } = currencies;
        // console.log('orders', entities)

        const tableContent = ids?.length && ids.map((currecyId: EntityId) => <Currency key={currecyId} currency={entities[currecyId]} />);

        const arr: (string | undefined)[] = [];

        content = (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', justifyItems: 'center', marginTop: 10, lineHeight: '10px' }}>
                    <h1>Family Currencies</h1>
                    <span style={{ position: 'relative', top: 20 }}>{date}</span>
                </div>
                <table className="table table__currencies">
                    <thead className="table__thead">
                        <tr>
                            <th scope="col" className="table__th note__status">
                                Title
                            </th>
                            <th scope="col" className="table__th note__status">
                                Code
                            </th>
                            <th scope="col" className="table__th note__created">
                                Value
                            </th>
                            <th scope="col" className="table__th note__updated">
                                Base
                            </th>
                            <th scope="col" className="table__th">
                                Edit
                            </th>
                        </tr>
                    </thead>
                    <tbody>{tableContent}</tbody>
                </table>
            </>
        );
    }

    return <>
        {content}
    </>;
};
export default CurrenciesList;
