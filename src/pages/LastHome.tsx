
import { Container, Row, Col, } from 'react-bootstrap'
import { useGetProductsByCategoryIdQuery } from '../features/products/productsApiSlice'
import { PulseLoader } from 'react-spinners'
import { EntityId, EntityState } from '@reduxjs/toolkit'
import { IProduct } from '../types/IProduct'
import Product from '../components/Product'
import { useState } from 'react'
import CarouselElement from '../components/CarouselElement'
import useTitle from '../hooks/useTitle'

interface HomeProps {
    cat: string;
    catCarousel: string;
}

const LastHome = ({ cat, catCarousel }: HomeProps) => {
    useTitle('BIG SHOPE')

    const [showProducts, setShowProducts] = useState(false)
    let allContent;

    const {
        data: products,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetProductsByCategoryIdQuery({ categoryId: cat, query: '?startProduct=0&limit=4' })


    let content;

    if (isLoading) content = <PulseLoader color={'#000'} className="pulse-loader" />;

    if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

    if (isSuccess) {
        const { ids, entities } = products as EntityState<IProduct>;
        content = ids?.length && ids.map((id: EntityId) =>
            <Product md={3} key={id} product={entities[id]} />
        );
        allContent = (<Row>
            {isSuccess && content}
        </Row>)
    }


    return (
        <Container>
            <CarouselElement cat={catCarousel} />
            {!showProducts ? <Row>
                <Col md={12}>
                    <div className="products">
                        <h5 className="latest-product">LATEST PRODUCTS</h5>
                        <a onClick={() => setShowProducts(!showProducts)} className="view-all" >SHOW ALL<span> </span></a>
                    </div>
                </Col>
            </Row> : <><Col md={12}>
                <div className="products">
                    <h5 className="latest-product">LATEST PRODUCTS</h5>
                    <a onClick={() => setShowProducts(!showProducts)} className="view-all" >HIDE ALL<span> </span></a>
                </div>
            </Col>
                {allContent}
            </>}
        </Container >
    )
}

export default LastHome