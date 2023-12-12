import classNames from 'classnames/bind';

import Modal from '../Modal';
import styles from './SuggestCartModal.module.scss';
import Button from '~/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { cartSelector, cartThunk } from '~/store/cart';

const cs = classNames.bind(styles);

function SuggestCartModal({ handleCloseModal }) {
    const dispatch = useDispatch();

    const handleCreateNewCart = () => {
        dispatch(cartThunk.createNewCart());

        handleCloseModal();
    };

    return (
        <Modal onClose={handleCloseModal} className={cs('wrapper')}>
            <div className={cs('header')}>Đơn hàng của bạn đang chờ</div>
            <div className={cs('header')}>Bạn có muốn tạo đơn hàng mới không?</div>
            <div className={cs('btn-group')}>
                <Button className={cs('btn')} animation={true} hover size="small" handleClick={handleCloseModal}>
                    Không
                </Button>
                <Button className={cs('btn')} animation={true} hover size="small" handleClick={handleCreateNewCart}>
                    Có
                </Button>
            </div>
        </Modal>
    );
}

export default SuggestCartModal;
