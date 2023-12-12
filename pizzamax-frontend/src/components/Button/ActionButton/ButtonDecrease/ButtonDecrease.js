import Button from '~/components/Button';
import { forwardRef } from 'react';

import * as Icons from '~/components/Icons';

function ButtonDecrease({ product, className, handleDecrease }, ref) {
    return (
        <Button
            ref={ref}
            hover
            className={className}
            theme="primary"
            type="icon"
            size="small"
            animation
            handleClick={handleDecrease}
            icon={<Icons.minus />}
        />
    );
}

export default forwardRef(ButtonDecrease);
