import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button';
import { userSelector, userThunk } from '~/store/user';
import * as Icons from '~/components/Icons';

function ButtonLike({ productId, className }) {
    const isFavorite = useSelector(userSelector.isFavorite(productId));
    const dispatch = useDispatch();

    const handleFavorite = () => {
        const payload = {
            productId,
        };

        if (isFavorite) {
            dispatch(userThunk.removeFavor(payload));
        } else dispatch(userThunk.addFavor(payload));
    };

    return (
        <Button
            className={className}
            icon={isFavorite ? <Icons.heartFull /> : <Icons.heart />}
            type="icon"
            theme="default"
            handleClick={handleFavorite}
        />
    );
}

export default ButtonLike;
