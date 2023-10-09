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
import { userSelector, userSlice } from '~/store/user';
import { districtService } from '~/services';

const headerCs = classNames.bind(headerStyles);
const modalCs = classNames.bind(modalStyles);

const cityOption = ['Cần Thơ', 'Hồ Chí Minh'];

const areaOption = [
    ' New Rizvia Gulzary Hijri',
    ' Vanthali Memon Association',
    'A.F GARDEN SOCIETY ',
    'A1 COMPLEX',
    'Abbas Town',
    'Abdullah Gabol Goth',
    'Abdullah Haroon Road, Karachi',
    'Abdullah Shah Ghazi - Clifton',
    'ABDULLAH SHAH GHAZI GOTH',
    'Abid Town',
    'Ablaagh e Aama CHS',
    'Abul Hassan Isphahani Road',
    'Abuzar Ghaffari  C.H.S',
    'Abuzar Ghaffari Chs Phase 2',
    'Adamjee Nagar',
];

function Location() {
    const [openModal, setOpenModal] = useState(false);
    const [orderType, setOrderType] = useState(1);
    const [location, setLocation] = useState('');
    const [addressForm, setAddress] = useState({
        street: '',
        alley: '',
        district: '',
        houseNumber: '',
        city: '',
    });
    const [addLocation, setAddLocaltion] = useState(false);
    const [districtOption, setDistrictOption] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const addressRef = useRef();
    const cityOptionRef = useRef();
    const districtOptionRef = useRef();

    const user = useSelector(userSelector.user);

    const shopAddress = useSelector(addressSelector.shopAddress);
    const userAddress = useSelector(addressSelector.userAddress);

    const currentAddress = JSON.parse(window.localStorage.getItem('currentAddress')) || {};

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addressThunk.getAllShopAddress());
    }, []);

    useEffect(() => {
        if (user) dispatch(addressThunk.getAllUserAddress({ uuid: user.uuid }));
    }, [user]);

    useEffect(() => {
        setLocation(currentAddress[orderType]);
    }, [orderType]);

    useEffect(() => {
        setAddress((prev) => ({ ...prev, district: '' }));

        if (addressForm.city !== '') {
            const getDistrictOfCity = async () => {
                const districts = await districtService.getDistricts(addressForm.city);

                setDistrictOption(districts);
            };

            getDistrictOfCity();
        }
    }, [addressForm.city]);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChooseDelivery = () => {
        addressRef.current?.clearOption();
        setOrderType(1);
        setAddLocaltion(false);
    };

    const handleChoosePickUp = () => {
        addressRef.current?.clearOption();
        setAddLocaltion(false);
        setOrderType(2);
    };

    const handleSetOption = (setSelectionToState, currentSelectForState) => {
        setSelectionToState(currentSelectForState);
    };

    const handleClickSelectBtn = () => {
        window.localStorage.setItem(
            'currentAddress',
            JSON.stringify({
                ...currentAddress,
                [orderType]: location,
            }),
        );
        handleCloseModal();
    };

    const handleAddLocaltion = async () => {
        if (user) {
            setLoading(true);
            await dispatch(
                addressThunk.addAddressByUser({
                    uuid: user.uuid,
                    ...addressForm,
                    alley: parseInt(addressForm),
                }),
            );
            setLoading(false);
        } else setErrMessage('You must log in first');
    };

    const handleError = () => {
        setErrMessage('Please complete form');
    };

    const handleSetAddLocaltion = () => {
        setAddLocaltion(true);
    };

    const handleSetChooseLocation = () => {
        setAddLocaltion(false);
    };

    return (
        <>
            <Button
                className={headerCs('location')}
                handleClick={(e) => setOpenModal(true)}
                theme="default"
                icon={<Icons.location />}
                header={orderType === 1 ? 'Pick-up from' : 'Deliver to'}
            >
                {location ? <span>{location}</span> : ''}
            </Button>

            {openModal && (
                <Modal className={modalCs('location-modal')} onClose={handleCloseModal}>
                    <div className={modalCs('modal-logo')}>
                        <img src={images.logo} alt="logo" />
                    </div>

                    <div className={modalCs('modal-type')}>
                        <p className={modalCs('title')}>Select your order type</p>

                        <div className={modalCs('actions')}>
                            <Button
                                animation
                                className={modalCs('actions-btn', { disable: orderType === 2 })}
                                theme="primary"
                                size="small"
                                handleClick={handleChooseDelivery}
                            >
                                PICK-UP
                            </Button>

                            <Button
                                animation
                                className={modalCs('actions-btn', { disable: orderType === 1 })}
                                theme="primary"
                                size="small"
                                handleClick={handleChoosePickUp}
                            >
                                DELIVERY
                            </Button>
                        </div>
                    </div>

                    <div className={modalCs('modal-location')}>
                        <p className={modalCs('title')}>
                            {orderType === 1
                                ? 'Please select your location'
                                : 'Which outlet would you like to pick-up from?'}
                        </p>

                        {orderType === 2 && (
                            <div className="flex">
                                <Button
                                    className={modalCs('modal-location-btn')}
                                    icon={<Icons.locationModal />}
                                    theme="default"
                                    handleClick={addLocation ? handleSetChooseLocation : handleSetAddLocaltion}
                                >
                                    {addLocation ? 'Use Your Location' : 'Add Your Location'}
                                </Button>
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
                                        setSelectionToState: setLocation,
                                    }}
                                    className={modalCs('infor-selection')}
                                    placeholder="Select Address"
                                    optionData={orderType === 1 ? shopAddress : userAddress}
                                />

                                <Button
                                    theme="primary"
                                    size="small"
                                    animation
                                    hover
                                    handleClick={handleClickSelectBtn}
                                    className={modalCs('modal-select-btn')}
                                >
                                    Select
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
                                        <div>
                                            <Input
                                                placeholder="House Number"
                                                value={addressForm.houseNumber}
                                                onChange={(e) =>
                                                    setAddress((prev) => ({ ...prev, houseNumber: e.target.value }))
                                                }
                                                rules={[required]}
                                                className={modalCs('infor-input', 'infor-street')}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                placeholder="Alley"
                                                value={addressForm.alley}
                                                onChange={(e) =>
                                                    setAddress((prev) => ({ ...prev, alley: e.target.value }))
                                                }
                                                rules={[number]}
                                                className={modalCs('infor-input', 'infor-street')}
                                            />
                                        </div>
                                        <InputOption
                                            ref={cityOptionRef}
                                            rules={[required]}
                                            selecting={{
                                                currentSelectForState: addressForm.city,
                                                handleSetOption,
                                                setSelectionToState: (selection) =>
                                                    setAddress((prev) => ({ ...prev, city: selection })),
                                            }}
                                            className={modalCs('infor-city')}
                                            optionData={cityOption}
                                            placeholder="Select City"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Street"
                                                value={addressForm.street}
                                                onChange={(e) =>
                                                    setAddress((prev) => ({ ...prev, street: e.target.value }))
                                                }
                                                rules={[required]}
                                                className={modalCs('infor-input', 'infor-street')}
                                            />
                                        </div>
                                        <InputOption
                                            placeholder="District"
                                            ref={districtOptionRef}
                                            rules={[]}
                                            selecting={{
                                                currentSelectForState: addressForm.district,
                                                handleSetOption,
                                                setSelectionToState: (selection) =>
                                                    setAddress((prev) => ({ ...prev, district: selection })),
                                            }}
                                            className={modalCs('infor-district')}
                                            optionData={districtOption}
                                        />
                                    </div>

                                    <Button
                                        theme="primary"
                                        size="small"
                                        do="submit"
                                        animation
                                        hover
                                        className={modalCs('modal-select-btn')}
                                    >
                                        {loading ? <Icons.loading /> : 'Add Address'}
                                    </Button>
                                </Form>
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default Location;
