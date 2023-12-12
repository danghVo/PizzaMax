import classNames from 'classnames/bind';

import Modal from '~/components/Modal';
import * as Icons from '~/components/Icons';
import styles from './LoadingModal.module.scss';
import Waiting from '~/components/Waiting';

const cs = classNames.bind(styles);

const emptyFunc = () => {};

function LoadingModal({ type = 'loading', noContent = true, handleCloseModal = emptyFunc }) {
    return (
        <Modal onClose={handleCloseModal} initial={{ scale: 1, opacity: 1 }} className={cs('wrapper')} noCloseBtn>
            {type === 'loading' && <Icons.loading stroke="rgb(239, 55, 6)" width="50px" height="50px" />}
            {type === 'dot' && <Waiting />}

            {!noContent && <h1 className={cs('loading')}>Waiting for paying</h1>}
        </Modal>
    );
}

export default LoadingModal;
