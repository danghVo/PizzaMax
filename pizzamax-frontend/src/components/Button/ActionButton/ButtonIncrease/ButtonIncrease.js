import { useDispatch } from 'react-redux';
import Button from '~/components/Button';
import { forwardRef } from 'react';

import * as Icons from '~/components/Icons';
import { cartThunk } from '~/store/cart';

function ButtonIncrease({ product, className, handleIncrease }, ref) {
    return (
        <Button
            ref={ref}
            hover
            className={className}
            theme="primary"
            type="icon"
            size="small"
            animation
            handleClick={handleIncrease}
            icon={<Icons.plus />}
        />
    );
}

export default forwardRef(ButtonIncrease);
