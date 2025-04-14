import React from 'react'
import { useGetOrdersByUserIdQuery } from '../features/orders/ordersApiSlice';
import useTitle from '../hooks/useTitle';
import { PulseLoader } from 'react-spinners';
import useAuth from '../hooks/useAuth';
import { EntityId } from '@reduxjs/toolkit';
import { IOrder } from '../types/IOrder';
import MyOneOrder from './MyOneOrder';

const MyOrders: React.FC = () => {
    useTitle('My OrderList');

    const { id: userId, username } = useAuth();

    const {
        data: orders,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetOrdersByUserIdQuery({ userId });

    let content;

    if (isLoading) content = <PulseLoader color={'#000'} className='pulse-loader' />

    if (isError) {
        content = <p className="errmsg ">{error?.data?.message}</p>
    }
    if (isSuccess) {

        const { ids, entities } = orders;
        // console.log('orders', entities)

        const tableContent = ids?.length && ids.map((orderId: EntityId) => <MyOneOrder key={orderId} order={entities[orderId] ?? {} as IOrder} />);

        content = (
            <>
                <h1 className='title__table__orders-my'>Orders By {username}</h1>
                <table className="table table__orders-my">
                    <thead className="table__thead">
                        <tr>
                            <th scope="col" className="table__th">
                                Ordered by
                            </th>
                            <th scope="col" className="table__th">
                                Email
                            </th>
                            <th scope="col" className="table__th">
                                Phone
                            </th>
                            <th scope="col" className="table__th">
                                User
                            </th>
                            <th scope="col" className="table__th">
                                Products
                            </th>
                            <th scope="col" className="table__th">
                                CreatedAt
                            </th>
                            <th scope="col" className="table__th">
                                UpdatedAt
                            </th>
                            <th scope="col" className="table__th">
                                Total Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </>
        )
    }

    return <>{content}</>
}

export default MyOrders