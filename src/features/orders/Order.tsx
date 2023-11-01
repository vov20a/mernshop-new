import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { IOrder } from '../../types/IOrder';
import { useSelector } from 'react-redux';
import { selectCurrentCurrency } from '../currencies/currencySlice';


type OrderProps = {
    order: IOrder;
}

const Order = ({ order }: OrderProps) => {

    // console.log(order.productsInfo[0]?.product?._id)
    const navigate = useNavigate();

    const currentCurrency = useSelector(selectCurrentCurrency)

    if (order) {
        // console.log('order', order)
        // console.log('product', products)
        const handleEdit = () => navigate(`/dash/orders/${order.id}`);

        return (
            <tr className="table__row user" >
                <td className={`table__cell`}> {order.fullName} </td>
                <td className={`table__cell`}> {order.email} </td>
                <td className={`table__cell`}> {order.phone} </td>
                <td className={`table__cell`}> {order.user.username} </td>
                <td className={`table__cell`}> {order.productsInfo.map((productInfo, index) =>
                    <span key={index}><Link to={`/dash/products/${productInfo?.product?._id}`}>{productInfo?.product?.title}:{productInfo?.count} .lbs</Link>, </span>
                )} </td>
                <td className={`table__cell`}> {new Date(order.createdAt).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })} </td>
                <td className={`table__cell`}> {new Date(order.updatedAt).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })} </td>
                <td className={`table__cell`}>{+(order.totalPrice * currentCurrency.value).toFixed(1)}</td>
                <td className={`table__cell`}>
                    <button className="icon-button table__button" onClick={handleEdit} >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr >

        );
    } else return null;
}

const memoizedProduct = memo(Order);
export default memoizedProduct