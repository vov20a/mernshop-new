import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { ICurrency } from '../../types/ICurrency';

interface CurrencyProps {
    currency: ICurrency | undefined;
}

const Currency = ({ currency }: CurrencyProps) => {

    const navigate = useNavigate();

    if (currency) {
        const handleEdit = () => navigate(`/dash/currencies/${currency.id}`);

        return (
            <tr className="table__row user" >
                <td className={`table__cell`}> {currency.title} </td>
                <td className={`table__cell`}> {currency.code} </td>
                <td className={`table__cell`}> {currency.value} </td>
                <td className={`table__cell`}> {currency.base ? "TRUE" : "FALSE"} </td>

                <td className={`table__cell`}>
                    <button className="icon-button table__button" onClick={handleEdit} >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr >

        );
    } else return null;


}

const memoizedCurrency = memo(Currency);

export default memoizedCurrency;