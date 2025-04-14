import React from 'react'
import { Col } from 'react-bootstrap'
import { IProduct } from '../types/IProduct'
import { Link, useNavigate } from 'react-router-dom';
import { useActions } from '../hooks/actions';
import CurrencyConvertor from './CurrencyConvertor';
import { Rating } from '@mui/material';

interface ProductProps {
    product: IProduct | undefined;
    md: number
}

const ProductCard = ({ product, md }: ProductProps) => {
    const { addProduct } = useActions()
    // const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const addCartClick = () => {
        // dispatch(addProduct({ ...product } as unknown as IProduct))
        addProduct({ ...product } as unknown as IProduct)
        navigate(`/cart`);
    }

    return (
        <Col lg={md}>
            <div className="content_box">
                <Link to={`/products/${product?._id}`}>
                    <div className="left-grid-view grid-view-left">
                        {product?.productImg && <img width="200px" src={process.env.REACT_APP_API_URL + '/uploads/' + product.productImg} className="img-responsive watch-right" alt="" />}
                        {product?.images && <img width="200px" src={product.images ? product.images[0]?.url : ''} alt='' className="img-responsive watch-right" />}
                        <div className="mask">
                            <div className="info">Quick View</div>
                        </div>
                    </div>
                </Link>
                <div>
                    <h4 className='title'> {product?.title}</h4>
                    <p className='description'>{product?.description}</p>
                    <span> <CurrencyConvertor price={product?.price} /></span>
                    <Rating
                        // onChange={(event: React.SyntheticEvent<Element, Event>, value: number | null) => setRating(value!)}
                        value={product?.rating ?? 0}
                        size="large"
                        name="half-rating-read"
                        readOnly
                        precision={0.5}
                    />
                </div>
            </div>


            <div className="cart-b">

                <div className="left-n "> <CurrencyConvertor price={product?.price} /></div>
                <div className="now-get get-cart-in" onClick={addCartClick}>ADD TO CART</div>
            </div>
        </Col>
    )

}

export default ProductCard