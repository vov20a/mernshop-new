import React, { memo } from 'react'
import { IProduct } from '../../types/IProduct'
import { useSelector } from 'react-redux';
import { selectCurrentCurrency } from '../currencies/currencySlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';


interface ProductAllProp {
    product: IProduct,
    categoryHandler: (cat: string) => void
}

const ProductAll = ({ product, categoryHandler }: ProductAllProp) => {

    const currentCurrency = useSelector(selectCurrentCurrency)

    const navigate = useNavigate();

    if (product) {
        const handleEdit = () => navigate(`/dash/products/${product._id}`);

        return (
            <tr className="table__row user" >
                <td className={`table__cell`}> {product.title} </td>
                <td className={`table__cell`}>
                    {product.productImg && <img width='50px' src={process.env.REACT_APP_API_URL + '/uploads/' + product.productImg} alt='img' />}
                    {product?.images && product?.images.map((image, index) => (
                        <div key={index} style={{ float: 'left' }}>
                            <img width='50px' src={image.url as string} alt="Product Preview" />
                        </div>
                    ))}

                </td>
                <td className={`table__cell`}> {product.description} </td>
                <td className={`table__cell`}> {+(product.price * currentCurrency.value).toFixed(1)} </td>
                <td className={`table__cell`}> {product.rating.toFixed(1)} </td>
                <td className={`table__cell`}> {product.Stock} </td>
                <td className={`table__cell`}><button onClick={() => categoryHandler(product.category._id)}> {product.category.title}</button> </td>
                <td className={`table__cell`}> {new Date(product.createdAt).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })} </td>
                <td className={`table__cell`}> {new Date(product.updatedAt).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })} </td>
                <td className={`table__cell`}>
                    <button className="icon-button table__button" onClick={handleEdit} >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr >
        );
    } else return null;
}

const memoizedProductAll = memo(ProductAll);

export default memoizedProductAll;