
import { Container, Row, Col, } from 'react-bootstrap'
import { useGetProductsByCategoryIdQuery, useLazyGetAllProductsQuery } from '../features/products/productsApiSlice'
import { PulseLoader } from 'react-spinners'
import { EntityId, EntityState } from '@reduxjs/toolkit'
import { IProduct } from '../types/IProduct'
import Product from '../components/Product'
import { SetStateAction, SyntheticEvent, useEffect, useState } from 'react'
import CarouselElement from '../components/CarouselElement'
import Pagination from 'react-js-pagination';
import useTitle from '../hooks/useTitle'
import ProductCard from '../components/ProductCard'
import { Slider, Typography } from '@mui/material'
import "./lastHome.css"
import { useDebounceNumber } from '../hooks/useDebounceNumber'
import { useDebounce } from '../hooks/debounce'

const categories = {
    'All': '',
    'Cute Kittens': '64e9a5044cec0e9d0303c7cf',
    'Strange Stuff': '64e9a54a4cec0e9d0303c7df',

}



interface HomeProps {
    catCarousel: string;
}

const LastHome = ({ catCarousel }: HomeProps) => {
    useTitle('BIG SHOPE')

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [price, setPrice] = useState<Array<number>>([0, 2100]);
    const [category, setCategory] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>('')//search....

    const debouncedPrice = useDebounceNumber(price)
    const debouncedKeyward = useDebounce(keyword)


    const [showProducts, setShowProducts] = useState(false)


    let allContent

    // const {
    //     data: products,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error,
    // } = useGetProductsByCategoryIdQuery({ categoryId: cat, query: '?startProduct=0&limit=4' })

    const [getAllProducts, { data: productsAll,
        isLoading: isAllLoading,
        isSuccess: isAllSuccess,
    }] = useLazyGetAllProductsQuery()

    let count = productsAll?.filteredProductsCount ?? 0;

    const setCurrentPageNo = (e: SetStateAction<number>) => {
        setCurrentPage(e);
    };

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value)
        setCurrentPage(1)
    }

    const priceHandler = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
        setPrice(newValue as number[]);
        setCurrentPage(1)
    };
    const categoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value)
        setCurrentPage(1)
    }
    const ratingHandler = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
        setRating(newValue as number);
        setCurrentPage(1)
    };

    let queryStr: string;
    if (category === '') queryStr = `?keyword=${debouncedKeyward}&page=${currentPage}&price[gte]=${debouncedPrice[0]}&price[lte]=${debouncedPrice[1]}&rating[gte]=${rating}`
    else queryStr = `?keyword=${debouncedKeyward}&page=${currentPage}&price[gte]=${debouncedPrice[0]}&price[lte]=${debouncedPrice[1]}&category=${category}&rating[gte]=${rating}`

    let content;

    useEffect(() => {
        if ((showProducts && debouncedPrice.length === 2 && !debouncedKeyward.length) || (debouncedKeyward.length > 2)) {
            getAllProducts(queryStr);
        }

    }, [showProducts, debouncedKeyward, currentPage, debouncedPrice, category, rating]);

    // if (isLoading) content = <PulseLoader color={'#000'} className="pulse-loader" />;

    // if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

    // if (isSuccess) {
    //     const { ids, entities } = products as EntityState<IProduct>;
    //     content = ids?.length && ids.map((id: EntityId) =>
    //         <Product md={3} key={id} product={entities[id]} />
    //     );
    //     allContent = (<Row>
    //         {isSuccess && content}
    //     </Row>)
    // }

    const getAllProductsHandle = () => {
        setShowProducts(!showProducts);
        setKeyword('')
        setPrice([0, 2100])
        setRating(0)
    }


    if (isAllLoading) allContent = (<Row>
        <PulseLoader color={'#000'} className="pulse-loader" />
    </Row>)
    if (isAllSuccess) {
        // console.log('first', productsAll)
        content = productsAll && productsAll.products.map((product) =>
            <ProductCard md={3} key={product._id} product={product} />
        )
        allContent = (<Row>
            {isAllSuccess && content}
        </Row>)
    }

    return (
        <Container>
            <CarouselElement cat={catCarousel} />
            {!showProducts ? <Row>
                <Col md={12}>
                    <div className="products">
                        <h5 className="latest-product">LATEST PRODUCTS</h5>
                        <button onClick={() => getAllProductsHandle()} className="view-all" >SHOW ALL<span> </span></button>
                    </div>
                </Col>
            </Row> : <><Col md={12}>
                <div className="products">
                    <h5 className="latest-product"></h5>
                    <button onClick={() => setShowProducts(!showProducts)} className="view-all" >HIDE ALL<span> </span></button>
                    {showProducts && isAllSuccess &&
                        <div className="filterBox">
                            <select className="categoryBox" onChange={categoryHandler}>
                                {Object.entries(categories).map(([key, value]) => (
                                    <option value={value} className="category-link" key={key}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                            <Typography>Price
                                <Slider
                                    value={price}
                                    onChangeCommitted={priceHandler}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                    min={0}
                                    max={2100}
                                />
                            </Typography>
                            <fieldset>
                                <Typography component="legend">Ratings Above</Typography>
                                <Slider
                                    value={rating}
                                    onChangeCommitted={ratingHandler}
                                    aria-labelledby="continuous-slider"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={10}
                                />
                            </fieldset>
                            <fieldset>
                                <input type='text' placeholder='Search....' value={keyword} onChange={searchHandler} />
                            </fieldset>
                        </div>
                    }
                </div>
            </Col>
                {count ? allContent : <h1>No Found Products!</h1>}
            </>}

            {
                showProducts && isAllSuccess && (productsAll?.resultPerPage ?? 0) < count &&
                <div className="paginationBox">
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={productsAll?.resultPerPage}
                        totalItemsCount={count}
                        onChange={setCurrentPageNo}
                        nextPageText="Next"
                        prevPageText="Prev"
                        firstPageText="1st"
                        lastPageText="Last"
                        itemClass="page-item"
                        linkClass="page-link"
                        activeClass="pageItemActive"
                        activeLinkClass="pageLinkActive"
                    />
                </div>
            }

        </Container >
    )
}

export default LastHome