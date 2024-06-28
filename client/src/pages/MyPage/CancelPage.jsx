import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { useParams, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { KlaytnWallet } from '@klaytn/ethers-ext';
import deployedABI from '../../../deployedABI';
import deployedAddress from '../../../deployedAddress';
import { CiReceipt } from "react-icons/ci";
import { CiCalendarDate, CiLocationOn, CiUser , CiCircleCheck  , CiEraser, CiLink, CiShop, CiSquareQuestion , CiDollar, CiWavePulse1   } from "react-icons/ci";

const CancelPage = () => {
    const [refundRequests, setRefundRequests] = useState([]);
    const { id } = useParams();
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');

    useEffect(() => {
        // 게스트의 환불 요청 목록 가져오기
        const fetchRefundRequests = async () => {
          try {
            const response = await axiosInstance.get(`/place/cancel/host/${id}`);
            console.log(response);
            setRefundRequests(response.data);
          } catch (error) {
            console.error('Error fetching refund requests:', error);
          }
        };
    
        fetchRefundRequests();
    }, [id]);

    // 환불 요청 승인 처리
    const handleAcceptRequest = async (refundRequestId, reservationId, guestId, price) => {

        try {
            if (!walletConnected || walletAddress == null) {
                alert('먼저 Kaikas 지갑을 연결해주세요.');
                return;
            }

            // 게스트의 지갑 주소 가져오기
            const guestResponse = await axiosInstance.get(`/users/${guestId}/wallet`);
            const guestWalletAddress = guestResponse.data.walletAddress;
            console.log(guestWalletAddress);

            // 클레이 송금 로직 추가
            await sendKlayToGuest(refundRequestId, reservationId, price, guestWalletAddress); // 클레이 송금 함수 호출

        } catch (error) {
            console.error('Error accepting refund request:', error);
            alert('환불 요청 승인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // 환불 요청 거절 처리
    const handleRejectRequest = async (refundRequestId) => {
        try {
        await axiosInstance.put(`/place/refundRequests/${refundRequestId}/reject`);
        alert('환불 요청이 거절되었습니다.');
        const updatedRequests = refundRequests.map((request) =>
            request._id === refundRequestId ? { ...request, status: 'rejected' } : request
        );
        setRefundRequests(updatedRequests);
        } catch (error) {
        console.error('Error rejecting refund request:', error);
        alert('환불 요청 거절 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // 결제할 지갑 연결
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
            alert(`Kaikas 지갑 연결 성공: ${wallet}`);
        } catch (error) {
            console.error('Kaikas 지갑 연동 실패:', error);
            alert('Kaikas 지갑 연동에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 클레이 송금 함수
    const sendKlayToGuest = async (refundRequestId, reservationId, price, guestWalletAddress) => {
        try {
            const amount = price * 10 ** 18; // KLAY를 PEB 단위로 변환

            const provider = new ethers.providers.Web3Provider(window.klaytn);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(deployedAddress, deployedABI, signer);
            const valueInPeb = ethers.utils.parseUnits(price.toString(), 'ether');

            const tx = await contract.RefundAndPay(guestWalletAddress, {
                from: walletAddress,
                value: valueInPeb,
                gasLimit: 300000,
            });
    
            console.log('트랜잭션이 성공적으로 완료되었습니다:', tx);

            // 송금이 성공하면 환불 요청 상태를 'accepted'로 변경
            await axiosInstance.put(`/place/refundRequests/${refundRequestId}/accept`);
            alert('환불 요청이 승인되었습니다.');
            const updatedRequests = refundRequests.map((request) =>
                request._id === refundRequestId ? { ...request, status: 'accepted' } : request
            );
            setRefundRequests(updatedRequests);

            // 예약 삭제
            await axiosInstance.delete(`/place/${reservationId}/cancel`);

        } catch (error) {
            console.error('Error sending Klay to guest:', error);
            alert('클레이 송금 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // ISO 형식의 날짜를 포맷팅하여 시간까지 표시
    const formatDateTime = (isoDate) => {
        const date = new Date(isoDate);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };
    

  return (
    <div className="container mx-auto p-6">
      <h1 className="flex text-2xl font-semibold text-gray-700 mb-6"><CiReceipt className='mr-2 text-4xl text-gray-700'/>취소 요청 목록</h1>
      <table className='w-full text-left text-sm text-gray-500 table-auto'>
        <thead className='border-b border-gray-300'>
          <tr>
            <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiShop /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Place</div></th>
            <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiLocationOn /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Location</div></th>
            <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCalendarDate /></div><div className='text-xs mt-1 text-gray-500 font-normal'>CheckIn</div></th>
            <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCalendarDate /></div><div className='text-xs mt-1 text-gray-500 font-normal'>CheckOut</div></th>
            <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiDollar /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Price</div></th>          
            <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiUser /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Guest</div></th>          
            <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiWavePulse1   /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Status</div></th>          
            <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCircleCheck /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Approved</div></th>          

          </tr>
        </thead>
        <tbody>
          {refundRequests.map((request) => (
            <tr key={request._id}>
              <td className="p-4 text-center">{request.title}</td>
              <td className="p-4 text-center">{request.location}</td>
              <td className='p-4 text-center'>{formatDateTime(request.checkInDate)}</td>
              <td className='p-4 text-center'>{formatDateTime(request.checkOutDate)}</td>
              <td className="p-4 text-center">{request.price}</td>
              <td className="p-4 text-center">{request.guestName}</td>
              <td className="p-4 text-center">{request.status === 'pending' ? '대기 중' : request.status === 'accepted' ? '완료' : '거절됨'}</td>
              <td className="p-4 text-center">
                {request.status === 'pending' && (
                  <>
                    <button className="mr-2 bg-gray-200 text-gray-500 text-sm py-1 px-2 rounded-lg hover:bg-gray-500 hover:text-white" onClick={handleConnectWalletClick}>
                      지갑연결
                    </button>
                    <button className="mr-2 bg-gray-200 text-gray-500 text-sm py-1 px-2 rounded-lg hover:bg-gray-500 hover:text-white" 
                        onClick={() => handleAcceptRequest(request._id, request.guestReservationId._id, request.guestId, request.guestReservationId.price)}>
                        승인
                    </button>
                    <button className="bg-gray-200 text-gray-500 text-sm py-1 px-2 rounded-lg hover:bg-gray-500 hover:text-white" onClick={() => handleRejectRequest(request._id)}>
                      거절
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancelPage