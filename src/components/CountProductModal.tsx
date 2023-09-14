import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ISipmleProductsInfo } from '../types/IOrder';
import TableProductModal from './TableProductModal';


interface CountModalProps {
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    simpleProducts: ISipmleProductsInfo[];
    setSimpleProducts: (options: ISipmleProductsInfo[]) => void
}

const CountProductModal: React.FC<CountModalProps> = ({ isVisible, setVisible, simpleProducts, setSimpleProducts }) => {
    const [options, setOptions] = useState<ISipmleProductsInfo[]>([])


    const handleClose = () => {
        setSimpleProducts(options)
        setVisible(false);
    }

    return (
        <Modal show={isVisible} onHide={handleClose} backdrop="static" size="lg">
            <Modal.Header closeButton>
                <Modal.Title>SELECT COUNT OF PRODUCTS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableProductModal simpleProducts={simpleProducts} setOptions={setOptions} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>
    );
}
export default CountProductModal;