import React from 'react'
import Table from 'react-bootstrap/Table';
import { ISipmleProductsInfo } from '../types/IOrder';

interface TableProductModalProps {
    simpleProducts: ISipmleProductsInfo[];
    setOptions: (options: ISipmleProductsInfo[]) => void
}

const TableProductModal = ({ simpleProducts, setOptions }: TableProductModalProps) => {
    // console.log(simpleProducts)
    const [smpProducts, setSmpProducts] = React.useState<ISipmleProductsInfo[]>(simpleProducts)

    const onPlusProduct = (product: ISipmleProductsInfo) => {
        const foundProduct = smpProducts.find((item) => item.value === product.value)
        if (foundProduct) {
            foundProduct.count++;
            setSmpProducts([...smpProducts])
        }
    }
    const onMinusProduct = (product: ISipmleProductsInfo) => {
        const foundProduct = smpProducts.find((item) => item.value === product.value)
        if (foundProduct) {
            foundProduct.count--;
            setSmpProducts([...smpProducts])
        }
    }

    React.useEffect(() => {
        setSmpProducts([...simpleProducts])
        // console.log(smpProducts)
    }, [simpleProducts])

    React.useEffect(() => {
        setOptions(smpProducts)
        // console.log(smpProducts)
    }, [smpProducts])

    return (
        <>
            {smpProducts.length ?
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>IMG</th>
                                <th style={{ textAlign: 'center' }}>TITLE</th>
                                <th style={{ textAlign: 'center' }}>COUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {smpProducts.map((product) =>
                                <tr key={product.value}>
                                    <td style={{ textAlign: 'center' }}>
                                        <img alt="img" src={process.env.REACT_APP_API_URL + '/uploads/' + product.img} width={30} />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{product.title} </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button style={{ border: "none" }} disabled={product.count === 1} onClick={() => onMinusProduct(product)} className="button button--outline button--circle cart__item-count-minus">
                                            <svg width="18px" height="18px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                        </button>
                                        {product.count}
                                        <button style={{ border: "none" }} onClick={() => onPlusProduct(product)} className="button button--outline button--circle cart__item-count-plus">
                                            <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V17M7 12H17M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div> :
                <h3>No selected products</h3>
            }
        </>
    );
}
export default TableProductModal;