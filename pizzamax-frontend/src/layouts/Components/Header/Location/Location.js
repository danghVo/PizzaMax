import classNames from 'classnames/bind';
import headerStyles from '../Header.module.scss';
import modalStyles from './LocationModal.module.scss';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import images from '~/assets/images';
import { InputOption } from '~/components/Option/';
import Input from '~/components/Input';
import Form from '~/components/Form';
import { number, required } from '~/rules';
import { addressThunk, addressSelector, addressSlice } from '~/store/address';
import { userSelector } from '~/store/user';
import { addressService, districtService } from '~/services';
import { cartSelector, cartThunk } from '~/store/cart';
import SuggestCartModal from '~/components/Modal/SuggestCartModal';
import { systemSlice } from '~/store/system';
import { cart } from '~/utils/dataTransform';

const headerCs = classNames.bind(headerStyles);
const modalCs = classNames.bind(modalStyles);

const cityOption = ['Cần Thơ', 'Hồ Chí Minh'];

function Location({ user }) {
    const [openModal, setOpenModal] = useState(false);
    const [orderType, setOrderType] = useState(1);
    const [location, setLocation] = useState('');
    const [addressForm, setAddress] = useState({
        street: '',
        alley: '',
        district: '',
        houseNumber: '',
        ward: '',
        city: '',
    });
    const [addLocation, setAddLocation] = useState(false);
    const [districtOption, setDistrictOption] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentOptionData, setCurrentOptionData] = useState();
    const [openSuggestModal, setOpenSuggestModal] = useState(false);

    const addressRef = useRef();

    const shopAddress = useSelector(addressSelector.shopAddress);
    const userAddress = useSelector(addressSelector.userAddress);
    const currentOrderType = useSelector(addressSelector.orderType);
    const currentAddress = useSelector(addressSelector.currentAddress);
    const formStatusApi = useSelector(addressSelector.formStatusApi);
    const cartStatus = useSelector(cartSelector.statusId);
    const isLogin = useSelector(userSelector.isLogin);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addressThunk.getAllShopAddress());
        setOrderType(currentOrderType);
    }, []);

    useEffect(() => {
        setOrderType(currentOrderType);
    }, [currentOrderType]);

    useEffect(() => {
        if (user) dispatch(addressThunk.getAllUserAddress({ uuid: user.uuid }));
    }, [isLogin]);

    useEffect(() => {
        if (formStatusApi.status === 'success') {
            dispatch(addressSlice.actions.setApiStart(''));
            setLoading(false);
            setAddLocation(false);
        } else if (formStatusApi.status === 'error') {
            setLoading(false);
            setErrMessage(formStatusApi.errorMessage);
            dispatch(addressSlice.actions.setApiStart(''));
        }
    }, [formStatusApi]);

    useEffect(() => {
        if (location) {
            let locationExist;
            if (orderType === 2) {
                locationExist = userAddress.find((item) => item.address === location);

                if (locationExist) {
                    dispatch(cartThunk.getDeliveryCharge(locationExist.id));
                }
            } else locationExist = shopAddress.find((item) => item.address === location);

            const payload = {
                address: location,
                id: locationExist ? locationExist.id : currentAddress[orderType].id,
                orderType,
            };

            if (openModal) {
                dispatch(addressSlice.actions.setCurrentAddress(payload));
            } else dispatch(addressSlice.actions.setCurrentAddress({ ...payload, orderType: currentOrderType }));
        }
    }, [location]);

    useEffect(() => {
        setCurrentOptionData(
            orderType === 2 ? userAddress.map((item) => item.address) : shopAddress.map((item) => item.address),
        );
        if (currentAddress[orderType].address) {
            setLocation(currentAddress[orderType].address);
        } else if (shopAddress.length > 0 && orderType === 1) {
            setLocation(shopAddress[0].address);
        } else {
            setLocation('');
        }
    }, [orderType, userAddress, shopAddress, currentAddress]);

    const getDistrictOfCity = async (selection) => {
        const districts = await districtService.getDistricts(selection);

        setDistrictOption(districts || []);
    };

    const handleChooseLocation = (selection) => {
        setLocation(selection);
    };

    const handleChooseCityOption = (selection) => {
        setAddress((prev) => ({ ...prev, city: selection }));
        getDistrictOfCity(selection);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setAddLocation(false);
    };

    const handleChooseDelivery = () => {
        addressRef.current?.clearOption();
        setAddLocation(false);
        setOrderType(2);
    };

    const handleChoosePickUp = () => {
        addressRef.current?.clearOption();
        setAddLocation(false);
        setOrderType(1);
    };

    const handleSetOption = (setSelectionToState, currentSelectForState) => {
        setSelectionToState(currentSelectForState);
    };

    const handleClickSelectBtn = () => {
        if (location) {
            dispatch(addressSlice.actions.setOrderType({ orderType }));
        }

        handleCloseModal();
    };

    const handleAddLocaltion = () => {
        if (user) {
            setLoading(true);
            dispatch(
                addressThunk.addAddressByUser({
                    uuid: user.uuid,
                    ...addressForm,
                    alley: parseInt(addressForm),
                }),
            );
        } else setErrMessage('Bạn cần đăng nhập trước');
    };

    const handleError = () => {
        setErrMessage('Hoàn thành Form');
    };

    const handleSetAddLocation = () => {
        setAddLocation(true);
    };

    const handleSetChooseLocation = () => {
        setAddLocation(false);
    };

    const handelCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const address = await addressService.currentLocation({ latitude, longitude });
            if (address.error) {
                setErrMessage(address.error);
            } else setAddress(address);
        });
    };

    const handleOpen = () => {
        if (cartStatus === 2) {
            setOpenSuggestModal(true);
        } else setOpenModal(true);
    };

    return (
        <>
            <Button
                className={headerCs('location')}
                handleClick={handleOpen}
                theme="default"
                animation
                icon={<Icons.location />}
                header={currentOrderType === 1 ? 'Mua mang về' : 'Giao hàng'}
            >
                {currentAddress[currentOrderType].address && <span>{currentAddress[currentOrderType].address}</span>}
            </Button>

            {openModal && (
                <Modal
                    className={modalCs('location-modal', {
                        larger: addLocation,
                    })}
                    onClose={handleCloseModal}
                >
                    <div className={modalCs('modal-logo')}>
                        <img src={images.logo} alt="logo" />
                    </div>

                    <div className={modalCs('modal-type')}>
                        <p className={modalCs('title')}>Hình thức mua hàng</p>

                        <div className={modalCs('actions')}>
                            <Button
                                animation
                                className={modalCs('actions-btn', { disable: orderType == 2 })}
                                theme="primary"
                                size="small"
                                handleClick={handleChoosePickUp}
                            >
                                Mua mang về
                            </Button>

                            <Button
                                animation
                                className={modalCs('actions-btn', { disable: orderType == 1 })}
                                theme="primary"
                                size="small"
                                handleClick={handleChooseDelivery}
                            >
                                Giao hàng
                            </Button>
                        </div>
                    </div>

                    <div className={modalCs('modal-location')}>
                        <p className={modalCs('title')}>
                            {orderType == 1 ? 'Cửa hàng nào gần bạn nhất ?' : 'Chọn địa chỉ giao hàng'}
                        </p>

                        {orderType == 2 && (
                            <div className="flex">
                                <Button
                                    className={modalCs('modal-location-btn')}
                                    icon={<Icons.locationModal />}
                                    theme="default"
                                    handleClick={addLocation ? handleSetChooseLocation : handleSetAddLocation}
                                >
                                    {addLocation ? 'Vị trí của tôi' : 'Thêm vị trí'}
                                </Button>
                                {addLocation && (
                                    <Button
                                        className={modalCs('modal-location-btn')}
                                        icon={<Icons.locationModal />}
                                        theme="default"
                                        handleClick={handelCurrentLocation}
                                    >
                                        Vị trí hiện tại
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={modalCs('modal-infor')}>
                        {!addLocation ? (
                            <>
                                <InputOption
                                    ref={addressRef}
                                    selecting={{
                                        currentSelectForState: location,
                                        handleSetOption,
                                        setSelectionToState: handleChooseLocation,
                                    }}
                                    className={modalCs('infor-selection')}
                                    placeholder="Chọn địa chỉ"
                                    optionData={currentOptionData}
                                />

                                <Button
                                    theme="primary"
                                    size="small"
                                    animation
                                    hover
                                    handleClick={handleClickSelectBtn}
                                    className={modalCs('modal-select-btn')}
                                >
                                    Chọn
                                </Button>
                            </>
                        ) : (
                            <>
                                {errMessage && (
                                    <p className={modalCs('valid')}>
                                        <Icons.valid className={modalCs('valid-icon')} />
                                        {errMessage}
                                    </p>
                                )}
                                <Form handlesubmit={handleAddLocaltion} handleError={handleError}>
                                    <div className="flex gap-2 mt-3">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Số nhà"
                                                value={addressForm.houseNumber}
                                                onChange={(e) =>
                                                    setAddress((prev) => ({ ...prev, houseNumber: e.target.value }))
                                                }
                                                rules={[required]}
                                                className={modalCs('infor-input', 'infor-street')}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Hẻm"
                                                value={addressForm.alley}
                                                onChange={(e) =>
                                                    setAddress((prev) => ({ ...prev, alley: e.target.value }))
                                                }
                                                rules={[number]}
                                                className={modalCs('infor-input', 'infor-street')}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Đường"
                                                value={addressForm.street}
                                                onChange={(e) =>
                                                    setAddress((prev) => ({ ...prev, street: e.target.value }))
                                                }
                                                rules={[required]}
                                                className={modalCs('infor-input', 'infor-street')}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Phố"
                                                value={addressForm.ward}
                                                onChange={(e) =>
                                                    setAddress((prev) => ({ ...prev, ward: e.target.value }))
                                                }
                                                rules={[]}
                                                className={modalCs('infor-input', 'infor-street')}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <div className="flex-1">
                                            <InputOption
                                                rules={[required]}
                                                selecting={{
                                                    currentSelectForState: addressForm.city,
                                                    handleSetOption,
                                                    setSelectionToState: handleChooseCityOption,
                                                }}
                                                optionData={cityOption}
                                                placeholder="Chọn thành phố"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputOption
                                                placeholder="Quận"
                                                rules={[required]}
                                                selecting={{
                                                    currentSelectForState: addressForm.district,
                                                    handleSetOption,
                                                    setSelectionToState: (selection) =>
                                                        setAddress((prev) => ({ ...prev, district: selection })),
                                                }}
                                                optionData={districtOption}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        theme="primary"
                                        size="small"
                                        do="submit"
                                        animation
                                        hover
                                        className={modalCs('modal-select-btn')}
                                    >
                                        {loading ? <Icons.loading /> : 'Thêm'}
                                    </Button>
                                </Form>
                            </>
                        )}
                    </div>
                </Modal>
            )}

            {openSuggestModal && <SuggestCartModal handleCloseModal={() => setOpenSuggestModal(false)} />}
        </>
    );
}

export default Location;
