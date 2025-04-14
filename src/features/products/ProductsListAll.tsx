import React, { useState, SyntheticEvent, SetStateAction } from 'react'
import { useGetAllProductsQuery } from './productsApiSlice'
import { useDebounceNumber } from '../../hooks/useDebounceNumber';
import { useDebounce } from '../../hooks/debounce';
import { PulseLoader } from 'react-spinners';
import { selectCurrentCurrency } from '../currencies/currencySlice';
import { useSelector } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import { IProduct } from '../../types/IProduct';
import ProductAll from './ProductAll';
import Pagination from 'react-js-pagination';
import '../../pages/lastHome.css'
import { Slider, Typography } from '@mui/material';

const ProductsListAll = () => {

    const currentCurrency = useSelector(selectCurrentCurrency)

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [price, setPrice] = useState<Array<number>>([0, 2100]);
    const [category, setCategory] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>('')//search....


    const debouncedPrice = useDebounceNumber(price)
    const debouncedKeyward = useDebounce(keyword)



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
    const categoryHandler = (cat: string) => {
        setCategory(cat);
        setCurrentPage(1)
    }
    const ratingHandler = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
        setRating(newValue as number);
        setCurrentPage(1)
    };

    let queryStr: string;
    if (category === '') queryStr = `?keyword=${debouncedKeyward}&page=${currentPage}&price[gte]=${debouncedPrice[0]}&price[lte]=${debouncedPrice[1]}&rating[gte]=${rating}`
    else queryStr = `?keyword=${debouncedKeyward}&page=${currentPage}&price[gte]=${debouncedPrice[0]}&price[lte]=${debouncedPrice[1]}&category=${category}&rating[gte]=${rating}`

    const { data: productsAll,
        isLoading,
        isSuccess, isError, error
    } = useGetAllProductsQuery(queryStr)

    let count = productsAll?.filteredProductsCount ?? 0;

    // useEffect(() => {
    //     if ((debouncedPrice.length === 2 && !debouncedKeyward.length) || (debouncedKeyward.length > 2)) {
    //         getAllProducts(queryStr);
    //     }

    // }, [debouncedKeyward, currentPage, debouncedPrice, category, rating]);

    let content;

    if (isLoading) content = <PulseLoader color={'#000'} className='pulse-loader' />;

    if (isError) {

        content = <p className="errmsg">{error?.data?.message}</p>;
    }

    if (isSuccess) {

        const tableContent = productsAll.products.map((product: IProduct) => <ProductAll key={product._id} product={product} categoryHandler={categoryHandler} />);

        content = (
            <>
                <Row >
                    <Col md={8} className='mt-3' >
                        <h3>Products of all categories</h3>
                    </Col>
                    <Col md={4} className='mb-2'>
                        <div className="search">
                            <input
                                type="text"
                                className="search"
                                placeholder="Search products..."
                                value={keyword}
                                onChange={searchHandler}
                            />
                        </div>
                    </Col>

                </Row>
                {isSuccess && productsAll.products.length ?
                    <>
                        <table className="table table__products">
                            <thead className="table__thead">
                                <tr>
                                    <th scope="col" className={`table__th th_cursor`}>
                                        Title
                                    </th>
                                    <th scope="col" className="table__th">
                                        Image
                                    </th>
                                    <th scope="col" className="table__th">
                                        Description
                                    </th>
                                    <th scope="col" className={`table__th th_cursor`}>
                                        Price,{currentCurrency.code}
                                    </th>
                                    <th scope="col" className={`table__th th_cursor `}>
                                        Rating
                                    </th>
                                    <th scope="col" className={`table__th`}>
                                        Stock
                                    </th>
                                    <th scope="col" className="table__th">
                                        Category
                                    </th>
                                    <th scope="col" className="table__th">
                                        CreatedAt
                                    </th>
                                    <th scope="col" className="table__th">
                                        UpdatedAt
                                    </th>
                                    <th scope="col" className="table__th">
                                        Edit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{tableContent}</tbody>
                        </table>

                        <Container>
                            <Row>
                                <Col md={12}>
                                    <div className="filterBox">

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

                                    </div>
                                </Col>
                            </Row>
                        </Container>

                        {(productsAll?.resultPerPage ?? 0) < count &&
                            <Row >
                                <Col md={8} className='mt-3' >
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
                                </Col>
                            </Row>}
                    </> :
                    <h1>No Products Found</h1>
                }
            </>
        );
    }
    return <>{content}</>
}

export default ProductsListAll