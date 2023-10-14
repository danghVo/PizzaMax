import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import styles from './HomeProduct.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Message from './Components/Message';
import { cartSelector, cartThunk } from '~/store/cart';
import { userThunk } from '~/store/user';
import Image from '~/components/Image';
import { checkDiscountAvail } from '~/utils';
import ProductModal from './Components/ProductModal/ProductModal';
import SelectModal from './Components/SelectModal';

const cs = classNames.bind(styles);

function HomeProduct({ data, favorite }) {
    const [openProductModal, setOpenProductModal] = useState(false);
    const [openSelectModal, setOpenSelectModal] = useState(false);
    const [isMessage, setMessage] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(data.price);
    const [productsInCart, setProductsInCart] = useState([]);
    const [selection, setSelection] = useState(
        data.discOptions?.reduce(
            (accu, curr) => ({ ...accu, [curr.name]: { name: '', type: '', price: 0, indexSelection: -1 } }),
            {},
        ) || {},
    );
    const [productSelected, setProductSelected] = useState(null);

    const productModalRef = useRef({});

    const dispatch = useDispatch();
    const cartStore = useSelector(cartSelector.cart);

    let isDiscountAvailable = checkDiscountAvail(data.Discount);
    let saleOff = isDiscountAvailable ? data.Discount.saleOff : 0;

    useEffect(() => {
        setProductsInCart(cartStore.products.filter((item) => item.name === data.name));
    }, [cartStore]);

    useEffect(() => {
        if (productSelected) {
            setProductSelected(productsInCart.find((product) => product.detail.uuid === productSelected.detail.uuid));
        } else if (productsInCart.length > 0) {
            setProductSelected(productsInCart[productsInCart.length - 1]);
        } else setProductSelected(null);
    }, [productsInCart]);

    useEffect(() => {
        if (productSelected) {
            setPrice(productSelected.detail.price);
            setQuantity(productSelected.detail.quantity);
            setSelection(
                productSelected.Selection.reduce((accu, curr) => {
                    let indexSelection;
                    data.discOptions.find((discOption) => {
                        if (discOption.type === curr.type) {
                            indexSelection = discOption.subOptions.findIndex(
                                (subOption) => subOption.name === curr.name,
                            );

                            return true;
                        }
                        return false;
                    });

                    return {
                        ...accu,
                        [curr.section]: {
                            price: curr.price,
                            name: curr.name,
                            type: curr.price,
                            indexSelection,
                        },
                    };
                }, {}),
            );
        } else {
            setQuantity(1);
            setPrice(data.price);
            setSelection(
                data.discOptions?.reduce(
                    (accu, curr) => ({ ...accu, [curr.name]: { name: '', type: '', price: 0, indexSelection: -1 } }),
                    {},
                ) || {},
            );
        }
    }, [productSelected]);

    useEffect(() => {
        if (!productSelected)
            setPrice(
                Object.keys(selection).reduce(
                    (accu, currentSection) =>
                        selection[currentSection].price ? accu + selection[currentSection].price : accu,
                    data.price,
                ) * quantity,
            );
    }, [selection]);

    useEffect(() => {
        if (!openProductModal) {
            setProductSelected(null);
        }
    }, [openProductModal]);

    const handleCloseProductModal = () => {
        setOpenProductModal(false);
    };

    const handleChooseProduct = (product) => {
        setProductSelected(product);

        if (product === null) {
        }

        setOpenSelectModal(false);
        setOpenProductModal(true);
    };

    const handleCloseSelectModal = () => {
        setOpenSelectModal(false);
    };

    const handleAddToCartModal = () => {
        if (productSelected) {
            setOpenProductModal(false);
            setMessage(true);
            return;
        }
        if (productModalRef.current.checkSelectionChoosen()) {
            setMessage(true);
            addToCart();
            handleCloseProductModal();
        }
    };

    const addToCart = () => {
        dispatch(
            cartThunk.addToCart({
                name: data.name,
                selection,
                quantity: quantity,
            }),
        );
    };

    const handleAddToCart = () => {
        if (data.discOptions.length > 0 && !openProductModal) {
            setOpenProductModal(true);
        } else addToCart();
    };

    const increaseQuantity = () => {
        if (data.discOptions.length > 0) {
            if (productsInCart.length > 0) {
                setOpenSelectModal(true);
            } else setOpenProductModal(true);
        } else {
            dispatch(cartThunk.increase(productSelected));
            setMessage(true);
        }
    };

    const increaseQuantityModal = () => {
        if (productModalRef.current.checkSelectionChoosen() && !productSelected) {
            dispatch(
                cartThunk.addToCart({
                    name: data.name,
                    selection,
                    quantity: quantity + 1,
                }),
            );
        } else dispatch(cartThunk.increase(productSelected));
    };

    const decreaseQuantity = () => {
        if (data.discOptions?.length > 0 && !productSelected) {
            setOpenSelectModal(true);
        } else if (quantity === 1) {
            if (productSelected) dispatch(cartThunk.removeFromCart(productSelected));

            if (openProductModal) setOpenProductModal(false);
        } else dispatch(cartThunk.decrease(productSelected));
    };

    const handleFavorite = () => {
        const payload = {
            productId: data.id,
        };

        if (favorite) {
            dispatch(userThunk.removeFavor(payload));
        } else dispatch(userThunk.addFavor(payload));
    };

    const actionsCartElement = (
        <>
            <Button
                hover
                className={cs('decrease-btn')}
                theme="primary"
                type="icon"
                size="small"
                animation
                handleClick={decreaseQuantity}
                icon={<Icons.minus />}
            />

            {openProductModal ? (
                <input onChange={() => {}} className={cs('modal-cart-quantity')} value={quantity} />
            ) : (
                <div className={cs('product-cart-quantity')}>
                    {productsInCart.reduce((accu, curr) => accu + curr.detail.quantity, 0)}
                </div>
            )}

            <Button
                hover
                className={cs('increse-btn')}
                theme="primary"
                type="icon"
                size="small"
                animation
                handleClick={openProductModal ? increaseQuantityModal : increaseQuantity}
                icon={<Icons.plus />}
            />
        </>
    );

    const addToCartBtn = (
        <Button
            className={cs('product-btn', { 'modal-btn': openProductModal })}
            hover
            animation
            handleClick={openProductModal ? handleAddToCartModal : handleAddToCart}
            theme="primary"
            size="small"
            icon={!openProductModal && <Icons.cart width="1.8rem" height="1.8rem" />}
        >
            {openProductModal ? 'Add To Cart' : 'ADD TO CART'}
        </Button>
    );

    return (
        <>
            <div className={cs('product-wrapper')}>
                <div className={cs('product-inner')}>
                    <Image className={cs('product-img')} src={data.image} alt="" />
                    {data.Discount && isDiscountAvailable && (
                        <div className={cs('product-saleOff')}>-{data.Discount.saleOff}% OFF</div>
                    )}
                    <div className={cs('product-infor')}>
                        <div className={cs('product-content')}>
                            <h4 className={cs('product-name')}>{data.name}</h4>
                            <p className={cs('product-description')}>{data.description}</p>
                        </div>

                        <Button
                            className={cs('product-heart')}
                            icon={favorite ? <Icons.heartFull /> : <Icons.heart />}
                            type="icon"
                            theme="default"
                            handleClick={handleFavorite}
                        />
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
                        {isDiscountAvailable && price && (
                            <span className={cs('price-saleOff')}>
                                {(price - (price * saleOff) / 100).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </span>
                        )}
                    </div>

                    {productsInCart.length > 0 && quantity ? (
                        <div className={cs('product-cart')}>{actionsCartElement}</div>
                    ) : (
                        addToCartBtn
                    )}
                </div>
            </div>

            {!openProductModal && <Message isMessage={isMessage} setMessage={setMessage} />}

            {openSelectModal && (
                <SelectModal
                    data={data}
                    products={productsInCart}
                    handleCloseModal={handleCloseSelectModal}
                    handleChooseProduct={handleChooseProduct}
                ></SelectModal>
            )}

            {openProductModal && data.discOptions && (
                <ProductModal
                    ref={productModalRef}
                    data={data}
                    selection={selection}
                    discount={isDiscountAvailable && data.Discount.saleOff}
                    productSelection={productSelected?.Selection || []}
                    handleSelection={setSelection}
                    handleCloseModal={handleCloseProductModal}
                >
                    <div className={cs('modal-actions')}>
                        <div className={cs('modal-cart')}>{actionsCartElement}</div>

                        <div className={cs('modal-price')}>
                            {price.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </div>
                        {addToCartBtn}
                    </div>
                </ProductModal>
            )}
        </>
    );
}

export default HomeProduct;
