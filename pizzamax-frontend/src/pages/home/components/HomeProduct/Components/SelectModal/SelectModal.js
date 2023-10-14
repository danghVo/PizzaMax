import classNames from 'classnames/bind';

import Modal from '~/components/Modal';
import Button from '~/components/Button';
import Image from '~/components/Image';
import ProductSelection from './Components/ProductSelection';
import modalStyles from './SelectModal.module.scss';
import styles from '../../HomeProduct.module.scss';

const modalCs = classNames.bind(modalStyles);
const cs = classNames.bind(styles);

function SelectModal({ children, data, products, handleChooseProduct, handleCloseModal }) {
    const handleNewOrder = () => {
        handleChooseProduct(null);
    };

    return (
        <Modal onClose={handleCloseModal} className={`${cs('modal-wrapper')} ${modalCs('select-modal-wrapper')}`}>
            <div className={modalCs('select-modal-img-wrapper')}>
                <Image src={data.image} className={modalCs('select-modal-img')} />
            </div>

            <div className={modalCs('select-modal-product-list')}>
                {products.map((product, productIndex) => (
                    <ProductSelection
                        product={product}
                        handleChooseProduct={handleChooseProduct}
                        key={productIndex}
                    ></ProductSelection>
                ))}
            </div>

            <Button
                className={modalCs('select-modal-new-btn')}
                handleClick={handleNewOrder}
                animation
                hover
                size="small"
            >
                New order
            </Button>
        </Modal>
    );
}

export default SelectModal;
