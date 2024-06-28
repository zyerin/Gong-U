import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToWishList, addToReserved } from '../../../redux_store/thunkFunc';
import axiosInstance from '../../../utils/axios';
import { ethers } from 'ethers';
import { KlaytnWallet } from '@klaytn/ethers-ext';
import deployedABI from './../../../../deployedABI';
import deployedAddress from './../../../../deployedAddress';
import { FaSwimmingPool } from 'react-icons/fa';
import { LuMicrowave, LuParkingCircle, LuBaggageClaim, LuTrain, LuDoorOpen, LuSiren, LuWifi, LuTv, LuProjector, LuUtensils, LuCigarette, LuBedDouble, LuBath, LuRefrigerator, LuAirVent, LuAccessibility, LuFan, LuDog, LuCigaretteOff, LuLampDesk, LuWind } from "react-icons/lu";
import { TbSmokingNo, TbBeach, TbWashDry2, TbFirstAidKit, TbIroningSteam } from "react-icons/tb";
import hairdryer from '../../../images/hairdryer.png';
import fire from '../../../images/fire.png';
import bathtowel from '../../../images/bathtowel.png';
import soap from '../../../images/soap.png';
import kitchen from '../../../images/kitchen.png';
import { CiCircleList, CiUser, CiLogout, CiHome, CiCircleCheck, CiTextAlignLeft, CiLogin, CiUnlock, CiCreditCard1, CiBullhorn, CiSettings, CiLocationOn, CiMap, CiDollar, CiClock2, CiSearch, CiText, CiShop } from "react-icons/ci";
import './ProductInfo.css';

const ProductInfo = ({ place }) => {
    console.log("컨트랙트 주소:", deployedAddress);
    console.log("호스트 주소:", place.writer.wallet);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // 페이지 이동

    const { location, guests, checkIn, checkOut } = useSelector(state => state.user?.searchCond);

    const [checkInDate, setCheckInDate] = useState(moment().format('YYYY-MM-DD'));
    const [checkInTime, setCheckInTime] = useState(moment().format('HH:mm'));
    const [checkOutDate, setCheckOutDate] = useState(moment().format('YYYY-MM-DD'));
    const [checkOutTime, setCheckOutTime] = useState(moment().format('HH:mm'));
    const [guestNum, setGuestNum] = useState(guests);
    const [totalHours, setTotalHours] = useState(0); // 총 숙박 시간
    const [totalPrice, setTotalPrice] = useState(0); // 총 가격
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false); // 예약 조건 동의 상태
    const [confidentialityAgreed, setConfidentialityAgreed] = useState(false); // 기밀보장 동의 상태

    useEffect(() => {
        setCheckInDate(formatDate(checkIn));
        setCheckInTime(formatTime(checkIn));
        setCheckOutDate(formatDate(checkOut));
        setCheckOutTime(formatTime(checkOut));
    }, [checkIn, checkOut]);

    const handleWishListClick = () => {
        dispatch(addToWishList({ placeId: place._id }));
    };

    useEffect(() => {
        const checkInDateTime = moment(`${checkInDate} ${checkInTime}`).format('YYYY-MM-DD HH:mm');
        const checkOutDateTime = moment(`${checkOutDate} ${checkOutTime}`).format('YYYY-MM-DD HH:mm');
        calculateTotalHours(checkInDateTime, checkOutDateTime);
    }, [checkInDate, checkInTime, checkOutDate, checkOutTime]);

    const calculateTotalHours = (checkInDateTime, checkOutDateTime) => {
        const diff = moment(checkOutDateTime).diff(moment(checkInDateTime), 'hours');
        setTotalHours(isNaN(diff) ? 0 : diff);
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [totalHours, place.price, place.minTime, place.minPrice]);

    const calculateTotalPrice = () => {
        if (totalHours <= place.minTime) {
            setTotalPrice(place.minPrice);
        } else {
            const extraHours = totalHours - place.minTime;
            const extraPrice = extraHours * place.price;
            const totalPrice = place.minPrice + extraPrice;
            setTotalPrice(isNaN(totalPrice) ? 0 : totalPrice);
        }
    };

    const handleConnectWalletClick = async () => {
        try {
            if (!window.klaytn || !window.klaytn.enable) {
                throw new Error('Kaikas 웹 지갑이 설치되어 있어야 합니다.');
            }

            await window.klaytn.enable().catch((error) => {
                throw new Error('Kaikas 지갑 연동에 실패했습니다. 다시 시도해 주세요.');
            });

            const wallet = window.klaytn.selectedAddress;
            setWalletAddress(wallet);
            setWalletConnected(true);
            alert(`Kaikas 지갑 연결: ${wallet}`);
        } catch (error) {
            console.error('Kaikas 지갑 연동 실패:', error);
            alert('Kaikas 지갑 연동에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleReserveClick = async () => {
        try {
            if (!walletConnected || walletAddress == null) {
                alert('먼저 Kaikas 지갑을 연결해주세요.');
                return;
            }

            if (!termsAgreed) {
                alert('예약 조건에 동의해 주세요.');
                return;
            }

            if (!confidentialityAgreed) {
                alert('기밀보장 조건에 동의해 주세요.');
                return;
            }

            const checkInDateTime = moment(`${checkInDate} ${checkInTime}`).format('YYYY-MM-DD HH:mm');
            const checkOutDateTime = moment(`${checkOutDate} ${checkOutTime}`).format('YYYY-MM-DD HH:mm');

            const checkParams = {
                placeId: place._id,
                checkInDate: checkInDateTime,
                checkOutDate: checkOutDateTime
            };

            const checkResponse = await axiosInstance.post(`/users/check`, checkParams);
            if (checkResponse.data.message === '이미 해당 날짜와 시간에 예약이 있습니다.') {
                alert('이미 해당 날짜와 시간에 예약이 있습니다. 다른 날짜와 시간대를 선택해주세요.');
                window.location.reload();
                return;
            }

            const amount = ethers.utils.parseUnits(totalPrice.toString(), 'ether'); // KLAY를 PEB 단위로 변환
            const hostContractAddress = place.writer.wallet; // 호스트의 컨트랙트 주소

            const provider = new ethers.providers.Web3Provider(window.klaytn);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(deployedAddress, deployedABI, signer);

            const tx = await contract.ReserveAndPay(
                hostContractAddress,
                Math.floor(new Date(checkInDateTime).getTime() / 1000), // Unix timestamp로 변환
                Math.floor(new Date(checkOutDateTime).getTime() / 1000), // Unix timestamp로 변환
                "I agree to the terms and conditions",
                confidentialityAgreed,
                {
                    from: walletAddress,
                    value: amount,
                    gasLimit: 300000,
                }
            );

            console.log('트랜잭션이 성공적으로 완료되었습니다:', tx);

            // 트랜잭션 완료 후 예약 정보 저장
            const reservationParams = {
                placeId: place._id,
                title: place.title,
                location: place.location,
                guests: guestNum,
                checkInDate: checkInDateTime,
                checkOutDate: checkOutDateTime,
                wallet: hostContractAddress,
                price: totalPrice,
            };

            const reservation = await dispatch(addToReserved(reservationParams));
            console.log(reservation);

            if (reservation.payload.message === '이미 해당 날짜와 시간에 예약이 있습니다.') {
                console.log('예약실패');
                navigate(`/place/${place._id}`);
            } else {
                console.log('예약성공');
                navigate('/guest/reserve/complete');
            }

        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === '이미 해당 날짜와 시간에 예약이 있습니다.') {
                alert('이미 해당 날짜와 시간에 예약이 있습니다. 다른 날짜와 시간대를 선택해주세요.');
                window.location.reload();
            } else {
                console.error('Reservation failed:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('YYYY-MM-DD');
    };

    const formatTime = (dateString) => {
        return moment(dateString).format('HH:mm');
    };

    const availableOptions = [
        { label: '무선 인터넷', icon: <LuWifi /> },
        { label: '침구', icon: <LuBedDouble /> },
        { label: '주방', icon: <img src={kitchen} alt="주방" style={{ width: '15px', height: '15px' }} /> },
        { label: '냉장고', icon: <LuRefrigerator /> },
        { label: '샴푸/바디워시', icon: <img src={soap} alt="샴푸/바디워시" style={{ width: '15px', height: '15px' }} /> },
        { label: '세탁기', icon: <TbWashDry2 /> },
        { label: '에어컨/난방', icon: <LuAirVent /> },
        { label: '업무 공간', icon: <LuLampDesk /> },
        { label: '티비', icon: <LuTv /> },
        { label: '드라이기', icon: <img src={hairdryer} alt="드라이기" style={{ width: '15px', height: '15px' }} /> },
        { label: '다리미', icon: <TbIroningSteam /> },
        { label: '주차공간', icon: <LuParkingCircle /> },
        { label: '해변가', icon: <TbBeach /> },
        { label: '중심가', icon: <LuTrain /> },
        { label: '수영장', icon: <FaSwimmingPool /> },
        { label: '전자레인지', icon: <LuMicrowave /> },
        { label: '욕조', icon: <LuBath /> },
        { label: '수건', icon: <img src={bathtowel} alt="수건" style={{ width: '14px', height: '14px' }} /> },
        { label: '반려동물', icon: <LuDog /> },
        { label: '빔 프로젝터', icon: <LuProjector /> },
        { label: '금연구역', icon: <TbSmokingNo /> },
        { label: '흡연가능', icon: <LuCigarette /> },
        { label: '짐 보관', icon: <LuBaggageClaim /> },
        { label: '셀프체크인', icon: <LuDoorOpen /> },
        { label: '취식가능', icon: <LuUtensils /> },
        { label: '휠체어', icon: <LuAccessibility /> },
        { label: '구급상자', icon: <TbFirstAidKit /> },
        { label: '화재 경보기', icon: <LuSiren /> },
        { label: '소화기', icon: <img src={fire} alt="소화기" style={{ width: '13px', height: '15px' }} /> },
    ];

    useEffect(() => {
        if (window.kakao && place.address) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(place.address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    const map = new window.kakao.maps.Map(document.getElementById('map'), {
                        center: coords,
                        level: 3
                    });

                    const marker = new window.kakao.maps.Marker({
                        position: coords,
                        map: map
                    });

                    map.setCenter(coords);

                    return () => {
                        marker.setMap(null);
                    };
                } else {
                    console.error('주소로 좌표를 검색하는 데 실패했습니다.', status);
                }
            });
        }
    }, [place.address]);

    return (
        <div className="flex flex-col">
            <div className="flex w-full h-full justify-center space-x-8 mt-9">
                <div className="info-container border border-gray-300 shadow-lg rounded-md mb-4 flex-1 p-6">
                    <p className="text-lg text-center text-bold">상세 정보</p>
                    <ul className="info-list">
                        <li><span className="flex font-semibold text-gray-800"><CiHome className='icon' />유형</span><span className="value">{place.type}</span></li>
                        <li><span className="flex font-semibold text-gray-800 mt-3"><CiMap className='icon' />지역</span> <span className="value">{place.location}</span></li>
                        <li><span className="flex font-semibold text-gray-800 mt-3"><CiLocationOn className='icon' />주소</span> <span className="value">{place.address}</span></li>
                        <li><span className="flex font-semibold text-gray-800 mt-3"><CiUser className='icon' />최대 인원</span> <span className="value">{place.maxPeople} 명</span></li>
                        <li><span className="flex font-semibold text-gray-800 mt-3"><CiShop className='icon' />방 개수</span> <span className="value">{place.roomNum} 개</span></li>
                        <li><span className="flex font-semibold text-gray-800 mt-3"><CiDollar className='icon' />기본요금</span> <span className="value">{place.minPrice} 클레이 / {place.minTime} 시간까지 적용</span></li>
                        <li><span className="flex font-semibold text-gray-800 mt-3"><CiCreditCard1 className='icon' />시간 당 가격</span> <div className="text-sm mb-3 mt-1 font-md">* 기본요금 이후 책정되는 가격입니다.</div><span className="value">{place.price} 클레이</span></li>
                        <li><span className="flex font-semibold text-gray-800 mt-3"><CiTextAlignLeft className='icon' />설명</span> <span className="value">{place.description}</span></li>
                        <li><span className="flex font-semibold text-gray-800 mt-3"><CiSettings className='icon' />옵션</span>
                            <div className='grid grid-cols-3 gap-4 mt-3'>
                                {availableOptions.filter(option => place.option.includes(option.label)).map((option, index) => (
                                    <div key={index} className='flex items-center'>
                                        {option.icon}
                                        <span className='ml-2'>{option.label}</span>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </ul>

                    <div className='flex flex-row gap-x-4 mt-3'>
                        <button
                            onClick={handleWishListClick}
                            className='flex-1 px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700'>
                            찜하기
                        </button>
                    </div>
                </div>

                <div className="reservation-container border border-gray-300 shadow-lg rounded-md mb-4 flex-1 p-6">
                    <p className="text-lg text-center font-semibold">예약 정보</p>
                    <div className="flex flex-col gap-y-3 mt-2">
                        <label htmlFor="checkInDate"><span className='flex font-semibold text-gray-800'><CiLogin className='icon_reserve' />CheckIn Date</span></label>
                        <input type="date" id="checkInDate" name="checkInDate" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} className="border border-gray-300 rounded-md p-2" />
                        <label htmlFor="checkInTime"><span className='flex font-semibold text-gray-800'><CiClock2 className='icon_reserve' />CheckIn Time</span></label>
                        <select
                            id="checkInTime"
                            name="checkInTime"
                            value={checkInTime}
                            onChange={e => setCheckInTime(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            {[...Array(24).keys()].map(hour => (
                                <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                    {`${hour.toString().padStart(2, '0')}:00`}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="checkOutDate"><span className='flex font-semibold text-gray-800'><CiLogout className='icon_reserve' />CheckOut Date</span></label>
                        <input type="date" id="checkOutDate" name="checkOutDate" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} className="border border-gray-300 rounded-md p-2" />
                        <label htmlFor="checkOutTime"><span className='flex font-semibold text-gray-800'><CiClock2 className='icon_reserve' />CheckOut Time</span></label>
                        <select
                            id="checkOutTime"
                            name="checkOutTime"
                            value={checkOutTime}
                            onChange={e => setCheckOutTime(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            {[...Array(24).keys()].map(hour => (
                                <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                    {`${hour.toString().padStart(2, '0')}:00`}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="guests"><span className='flex font-semibold text-gray-800'><CiUser className='icon_reserve' />Guests :</span></label>
                        <input
                            type="number"
                            id="guests"
                            name="guests"
                            min={1}
                            value={guestNum}
                            onChange={e => setGuestNum(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        />
                        
                        
                    </div>
                    <p className="mt-5">총 대여 시간 | {totalHours} 시간</p> {/* 추가: 총 숙박 시간 표시 */}
                    <p className="mt-2">총 결제 금액 | {totalPrice} 클레이</p>
                    {totalHours <= place.minTime && <p className='text-sm text-blue-500 mt-1'>* 기본요금이 적용됩니다.</p>}

                    <div className='mt-3'>
                        <label className='text-sm ml-1'>
                                <input type="checkbox" checked={termsAgreed} onChange={e => setTermsAgreed(e.target.checked)} />
                                위의 예약 내역을 확인하였으며, 클레이 지불 조건에 동의합니다.
                        </label>
                    </div>
                    <div>
                        <label className='text-sm ml-1'>
                                <input type="checkbox" checked={confidentialityAgreed} onChange={e => setConfidentialityAgreed(e.target.checked)} />
                                카이카스 지갑 거래 이용과 기밀 보장에 동의하며, 결제를 진행합니다.
                        </label>
                    </div>
                    
                    
                    <div className='flex justify-center'>
                        <button
                            onClick={handleConnectWalletClick}
                            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700">
                            카이카스 지갑 연결하기
                        </button>
                        <button
                            onClick={handleReserveClick}
                            className="mt-4 ml-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700" disabled={!termsAgreed || !confidentialityAgreed}>
                            결제 및 예약하기
                        </button>
                    </div>
                </div>
            </div>
            <div className="reservation-container border border-gray-300 shadow-lg rounded-md p-6 mb-4 w-full mt-5">
                <p className="text-lg text-center text-bold mb-2">위치</p>
                <div id="map" style={{ width: '975px', height: '400px' }}></div>
            </div>
        </div>
    );
}

export default ProductInfo;
