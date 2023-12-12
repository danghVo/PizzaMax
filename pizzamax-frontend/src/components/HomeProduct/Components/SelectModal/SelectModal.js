import classNames from 'classnames/bind';

import Modal from '~/components/Modal';
import Image from '~/components/Image';
import ProductSelection from './Components/ProductSelection';
import modalStyles from './SelectModal.module.scss';
import styles from '../../HomeProduct.module.scss';
import { useEffect } from 'react';

const modalCs = classNames.bind(modalStyles);
const cs = classNames.bind(styles);

function SelectModal({ data, products, handleCloseModal }) {
    useEffect(() => {
        if (products.length === 0) {
            handleCloseModal();
        }
    }, [products]);

    return (
        <Modal onClose={handleCloseModal} className={`${cs('modal-wrapper')} ${modalCs('select-modal-wrapper')}`}>
            <div className={modalCs('select-modal-img-wrapper')}>
                <Image src={data.image} className={modalCs('select-modal-img')} />
            </div>

            <div className={modalCs('select-modal-product-list')}>
                {products.map((product, productIndex) => (
                    <ProductSelection product={product} key={productIndex}></ProductSelection>
                ))}
            </div>
        </Modal>
    );
}

export default SelectModal;
