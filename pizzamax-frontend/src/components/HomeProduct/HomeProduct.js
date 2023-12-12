import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import styles from './HomeProduct.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Message from './Components/Message';
import { cartSelector, cartThunk } from '~/store/cart';
import Image from '~/components/Image';
import { checkDiscountAvail } from '~/utils';
import ProductModal from './Components/ProductModal/ProductModal';
import SelectModal from './Components/SelectModal';
import ButtonLike from '~/components/Button/ButtonLike';
import ActionButton from '~/components/Button/ActionButton/ActionButton';
import { memo } from 'react';
import SuggestCartModal from '../Modal/SuggestCartModal';

const cs = classNames.bind(styles);

function HomeProduct({ data }) {
    const [openProductModal, setOpenProductModal] = useState(false);
    const [openSelectModal, setOpenSelectModal] = useState(false);
    const [openSuggestModal, setOpenSuggestModal] = useState(false);
    const [isMessage, setMessage] = useState(false);
    const [products, setProducts] = useState([]);

    const productModalRef = useRef({});

    const dispatch = useDispatch();
    const productsInCart = useSelector(cartSelector.currentProducts);
    const cartStatus = useSelector(cartSelector.statusId);

    let isDiscountAvailable;
    let saleOff;

    if (data?.Discount) {
        isDiscountAvailable = checkDiscountAvail(data.Discount);
        saleOff = isDiscountAvailable ? data.Discount.saleOff : 0;
    }

    useEffect(() => {
        setProducts(productsInCart.filter((item) => item.name === data.name));
    }, [productsInCart]);

    const handleCloseProductModal = () => {
        setOpenProductModal(false);
    };

    const handleCloseSelectModal = () => {
        setOpenSelectModal(false);
    };

    const addToCart = () => {
        dispatch(
            cartThunk.addToCart({
                price: data.price,
                name: data.name,
                selection: {},
                quantity: 1,
            }),
        );
    };

    const handleAddToCart = () => {
        if (cartStatus === 2) {
            openSuggestModal();
        } else if (data.discOptions.length > 0 && !openProductModal) {
            setOpenProductModal(true);
        } else addToCart();
    };

    const handleIncrease = () => {
        if (data.discOptions.length > 0) {
            setOpenProductModal(true);
        } else {
            dispatch(cartThunk.increase(products[0]));
            setMessage(true);
        }
    };

    const handleDecrease = () => {
        if (data.discOptions.length > 0 && products.length > 1) {
            setOpenSelectModal(true);
        } else {
            if (products[0].detail.quantity === 1) {
                dispatch(cartThunk.removeFromCart(products[0]));
            } else dispatch(cartThunk.decrease(products[0]));
        }
    };

    return (
        <>
            {!data.hide && (
                <>
                    <div className={cs('product-wrapper')}>
                        <div className={cs('product-inner')}>
                            <Link to={`/product/${data.type}/${data.name}`}>
                                <Image className={cs('product-img')} src={data.image} alt="" />
                            </Link>
                            {data.Discount && isDiscountAvailable && (
                                <div className={cs('product-saleOff')}>-{data.Discount.saleOff}% OFF</div>
                            )}
                            <div className={cs('product-infor')}>
                                <div className={cs('product-content')}>
                                    <h4 className={cs('product-name')}>{data.name}</h4>
                                    <p className={cs('product-description')}>{data.description}</p>
                                </div>

                                <ButtonLike className={cs('product-heart')} productId={data.id} />
                            </div>

                            <div className={cs('product-price')}>
                                <span className={cs('price')}>
                                    {data.price
                                        ? data.price.toLocaleString('vi-VN', {
                                              style: 'currency',
                                              currency: 'VND',
                                          })
                                        : 'Choose to see detail price'}
                                </span>
                                {isDiscountAvailable && data.price && (
                                    <span className={cs('price-saleOff')}>
                                        {(data.price - (data.price * saleOff) / 100).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </span>
                                )}
                            </div>

                            {products.length > 0 ? (
                                <ActionButton
                                    className={{
                                        increase: cs('increase-btn'),
                                        decrease: cs('decrease-btn'),
                                        wrapper: cs('product-cart'),
                                    }}
                                    handleDecrease={handleDecrease}
                                    handleIncrease={handleIncrease}
                                >
                                    <div className={cs('product-cart-quantity')}>
                                        {products.reduce((accu, curr) => accu + curr.detail.quantity, 0)}
                                    </div>
                                </ActionButton>
                            ) : (
                                <Button
                                    className={cs('product-btn', { 'modal-btn': openProductModal })}
                                    hover
                                    animation
                                    handleClick={handleAddToCart}
                                    theme="primary"
                                    size="small"
                                    icon={!openProductModal && <Icons.cart width="1.8rem" height="1.8rem" />}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                            )}
                        </div>
                    </div>

                    {!openProductModal && <Message isMessage={isMessage} setMessage={setMessage} />}

                    {openSelectModal && (
                        <SelectModal data={data} products={products} handleCloseModal={handleCloseSelectModal} />
                    )}

                    {openProductModal && data.discOptions && (
                        <ProductModal
                            ref={productModalRef}
                            data={data}
                            discount={isDiscountAvailable && data.Discount.saleOff}
                            handleCloseModal={handleCloseProductModal}
                        />
                    )}
                </>
            )}
            {openSuggestModal && <SuggestCartModal gestCartModal handleCloseModal={() => setOpenSuggestModal(false)} />}
        </>
    );
}

export default memo(HomeProduct);
