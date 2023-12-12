import classNames from 'classnames/bind';

import Modal from '../Modal';
import styles from './ConfirmDeleteModal.module.scss';
import Button from '~/components/Button';

const cs = classNames.bind(styles);

function ConfirmDeleteModal({ onNo = () => {}, onYes = () => {}, handleCloseModal }) {
    const handleSelectYes = () => {
        onYes();
        handleCloseModal();
    };

    const handleSelectNo = () => {
        onNo();
        handleCloseModal();
    };

    return (
        <Modal onClose={handleCloseModal} className={cs('wrapper')}>
            <div className={cs('header')}>Bạn có chắc chắn muốn xóa không ?</div>
            <div className={cs('btn-group')}>
                <Button className={cs('btn')} animation={true} hover size="small" handleClick={handleSelectNo}>
                    Không
                </Button>
                <Button className={cs('btn')} animation={true} hover size="small" handleClick={handleSelectYes}>
                    Có
                </Button>
            </div>
        </Modal>
    );
}

export default ConfirmDeleteModal;
