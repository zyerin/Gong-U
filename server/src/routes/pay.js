const express = require('express');
const router = express.Router();
const Caver = require('caver-js');
const caver = new Caver('https://api.baobab.klaytn.net:8651/');
const ethers = require('ethers');
const { KlaytnWallet } = require('@klaytn/ethers-ext');
const deployedABI = require('../../deployedABI');
const deployedAddress = require('../../deployedAddress');

router.post('/', async (req, res) => {
    const { hostContractAddress, amount } = req.body;
    console.log(hostContractAddress);
    console.log(amount);
    console.log(deployedABI);
    console.log(deployedAddress);
    try {
        // caver.js를 사용하여 KLAY를 전송하는 스마트 컨트랙트 함수 실행
        // ABI와 주소 정보를 제공하여 스마트 컨트랙트 객체 초기화
        const contractInstance = new caver.contract(deployedABI, deployedAddress);

        // KLAY를 PEB 단위로 변환
        const value = caver.utils.toPeb(amount.toString(), 'KLAY');

        if (window.klaytn) {
            // Kaikas가 설치되어 있을 때 실행할 코드
            const cav = new Caver(window.klaytn);

            cav.klay.getAccounts((error, accounts) => {
                if (error) {
                    console.error('Failed to get accounts:', error);
                    res.status(500).json({ success: false, message: '지갑 주소를 가져오는 중에 오류가 발생했습니다.' });
                    return;
                }

                const senderAddress = accounts[0];
                console.log('Sender Address:', senderAddress);

                // 스마트 컨트랙트 함수 호출
                contractInstance.methods.ReserveAndPay(hostContractAddress, value).send({
                    from: senderAddress, // 전송자의 Klaytn 지갑 주소
                    gas: '300000', // 가스 한도
                    value: value, // 송금할 KLAY (PEB 단위)
                })
                .then(receipt => {
                    // 성공적으로 처리된 경우, 응답을 반환
                    res.json({ success: true, receipt });
                })
                .catch(error => {
                    // 오류 처리
                    console.error('결제 오류:', error);
                    res.status(500).json({ success: false, message: '결제 실패' });
                });
            });
        } else {
            console.error('Kaikas가 설치되어 있지 않습니다.');
            res.status(500).json({ success: false, message: 'Kaikas가 설치되어 있지 않습니다.' });
        }
    } catch (error) {
        // 오류 처리
        console.error('결제 오류:', error);
        res.status(500).json({ success: false, message: '결제 실패' });
    }

    
});

module.exports = router;
