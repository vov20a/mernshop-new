import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useGetProductsQuery, useCreateProductReviewMutation } from '../features/products/productsApiSlice';
import { PulseLoader } from 'react-spinners';
import { IProduct } from '../types/IProduct';
// import { Dictionary, EntityId, EntityState } from '@reduxjs/toolkit';
import { Col, Container, Row } from 'react-bootstrap';
import Category from '../components/Category';
// import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
// import { ICategory } from '../types/ICategory';
// import { useDispatch } from 'react-redux';
// import { addProduct } from '../features/cart/cartSlice';
import CurrencyConvertor from '../components/CurrencyConvertor';
import { Rating, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewCard from '../components/ReviewCard';
import { useActions } from '../hooks/actions';


const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 4000,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true
};
const SingleProductPage = () => {

    const { addProduct } = useActions();
    // const dispatch = useDispatch()
    const navigate = useNavigate()
    const { productId } = useParams();

    const { product, isLoading, isSuccess, isError, error } = useGetProductsQuery('productsList', {
        selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
            product: productId ? data?.entities[productId] : undefined,
            isLoading,
            isSuccess, isError, error
        })
    })
    const [addNewProductReview, { isLoading: isLoadingReview, isError: isErrorReview, error: errorReview }] = useCreateProductReviewMutation()
    const options = {
        // onChange={(event: React.SyntheticEvent<Element, Event>, value: number | null) => setRating(value!)}
        value: product?.rating ?? 0,
        size: "large" as ("large" | "small" | "medium"),
        readOnly: true,
        precision: 0.5,
    }

    const [open, setOpen] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');


    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set('rating', rating.toString());
        myForm.set('comment', comment);
        myForm.set('productId', productId ?? '');

        addNewProductReview(myForm);

        setOpen(false);
    };

    // const { parentCategory } = useGetCategoriesQuery('categoriesList', {
    //     selectFromResult: ({ data }) => ({
    //         // parentCategoryId: category?.parentCategory ? data?.ids.find((id) => id === '648418342d713c1d194e38c1') as EntityId : undefined,
    //         parentCategory: data?.entities[] as unknown as EntityId] as ICategory
    //     })
    // })


    let content;
    if (isLoading) {
        content = <PulseLoader color={'#000'} className='pulse-loader' />;
    }

    if (isError) {

        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isErrorReview) {

        content = <p className="errmsg">{errorReview?.data?.message}</p>;
    }

    if (isSuccess) {
        // console.log(product)
        const addCartClick = () => {
            addProduct({ ...product } as unknown as IProduct)
            navigate(`/cart`);
        }

        content = <Container>
            <Row>
                <Col md={{ span: 6, offset: 4 }}>
                    <h4 className='breadcrumbs'><Link to="/home">Home </Link>/<Link to={`/categories/${product?.category?._id}`}>{product?.category?.title}</Link>/<span>{`${product?.title}`}</span></h4>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Category />
                </Col>
                <Col md={8}>
                    <Row className='single-product'>
                        <Col md={4}>
                            {product?.productImg &&
                                <div className="left-grid-view grid-view-left">
                                    <img src={`${process.env.REACT_APP_API_URL}/uploads/${product?.productImg}`} className="img-responsive watch-right" alt="" />
                                </div>}
                            {product?.images &&
                                <Slider {...settings}>
                                    {product?.images.map((image, index) => (
                                        <div key={index} className="left-grid-view grid-view-left">
                                            <img src={image.url as string} alt="Product Preview" />
                                        </div>
                                    ))}
                                </Slider>
                            }
                        </Col>
                        <Col md={8}>
                            <h4>{`${product?.title}`}</h4>
                            <div className="cart-b">
                                <div className="left-n "> <CurrencyConvertor price={product?.price} /></div>
                                <div className="now-get get-cart-in" onClick={addCartClick}>ADD TO CART</div>
                            </div>
                            <p>{`${product?.description}`}</p>
                            <Rating {...options} />
                            <div className="now-get get-cart-in" onClick={submitReviewToggle}>SET RATING</div>
                        </Col>

                        <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={submitReviewToggle}>
                            <DialogTitle>Submit Review</DialogTitle>
                            <DialogContent className="submitDialog">
                                <Rating
                                    onChange={(event: React.SyntheticEvent<Element, Event>, value: number | null) => setRating(value!)}
                                    value={+rating}
                                    size="large"
                                    name={product?.title}
                                />

                                <textarea
                                    className="submitDialogTextArea"
                                    cols={30}
                                    rows={5}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}></textarea>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={submitReviewToggle} color="secondary">
                                    Cancel
                                </Button>
                                <Button onClick={reviewSubmitHandler} color="primary">
                                    Submit
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Row>
                </Col>

            </Row>
            <Row>
                <Col md={12} style={{ marginTop: '30px' }}>
                    {isLoadingReview ? <PulseLoader color={'#000'} className='pulse-loader' /> :
                        product?.reviews && product?.reviews[0] ? (
                            <div className="reviews" style={{ display: "flex", gap: '30' }}>
                                {product.reviews &&
                                    product.reviews.map((review) => <ReviewCard key={review?._id} review={review} productId={productId} />)}
                            </div>
                        ) : (
                            <p className="noReviews">No Reviews Yet</p>
                        )
                    }
                </Col>
            </Row>
        </Container>
    }
    return (
        <>{content}</>
    )
}

export default SingleProductPage