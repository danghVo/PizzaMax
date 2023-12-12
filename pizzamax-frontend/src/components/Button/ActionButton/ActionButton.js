import { forwardRef, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import ButtonDecrease from './ButtonDecrease';
import ButtonIncrease from './ButtonIncrease';
import { cartSelector } from '~/store/cart';
import SuggestCartModal from '~/components/Modal/SuggestCartModal';

function ActionButton({
    children,
    className = { decrease: '', increase: '', wrapper: '' },
    handleIncrease,
    handleDecrease,
}) {
    const [openSuggestNewCartModal, setOpenSuggestNewCartModal] = useState(false);
    const cartStatus = useSelector(cartSelector.statusId);

    const increaseRef = useRef(null);
    const decreaseRef = useRef(null);

    const handleCheckStatus = (e) => {
        if (cartStatus !== 1 && (e.target === increaseRef.current || e.target === decreaseRef.current)) {
            setOpenSuggestNewCartModal(true);
        }
    };

    return (
        <>
            <span onClick={handleCheckStatus} className={className.wrapper}>
                <ButtonDecrease ref={decreaseRef} handleDecrease={handleDecrease} className={className.decrease} />
                {children}
                <ButtonIncrease ref={increaseRef} handleIncrease={handleIncrease} className={className.increase} />
            </span>

            {openSuggestNewCartModal && <SuggestCartModal handleCloseModal={() => setOpenSuggestNewCartModal(false)} />}
        </>
    );
}

export default ActionButton;
