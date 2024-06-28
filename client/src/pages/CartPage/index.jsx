import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CartTable from './Sections/CartTable';
import { getCartItems, removeCartItem, payProducts } from '../../redux_store/thunkFunc';

// 장바구니 페이지에서 보여주는 것 -> 상품 사진이랑 가격(product 디비에), 담은 개수(quantity는 user 디비의 cart에)
// product 모델의 데이터와, user 모델의 cart 데이터를 합쳐서 가져옴
const CartPage = () => {

  // 리덕스 스토어 구조
  const userData = useSelector(state => state.user?.userData);
  const cartDetail = useSelector(state => state.user?.cartDetail);

  const dispatch = useDispatch();

  const [total, setTotal] = useState(0); // 합계

  // 1) 카트 안에 들어가있는 상품들을 데이터베이스에서 가져오기
  useEffect(() => {
    let cartItemIds = [] // cart 안에 들어있는 상품 id들을 넣어주는 배열

    // 리덕스 User State의 cart 안에 상품이 들어있는지 확인 -> 하나씩 순회하면서 cartItemIds 배열에 넣어줌
    if (userData?.cart && userData.cart.length > 0) {
      userData.cart.forEach(item => {
        cartItemIds.push(item.id); // push 메소드 이용
      })

      const body = {
        cartItemIds,
        userCart: userData.cart
      }

      // cart item들 가져옴옴
      dispatch(getCartItems(body)) // -> getCartItems thuck 함수에 body 넣어줌
    }

  }, [dispatch, userData])


  // cartDetail 데이터가 변할 때마다 합계 계산
  useEffect(() => {
    calculateTotal(cartDetail)
  }, [cartDetail])


  // 카트 안에 있는 상품 총 금액 계산
  const calculateTotal = (cartItems) => {
    let priceTotal = 0;
    cartItems.map(item => priceTotal += item.price * item.quantity)
    setTotal(priceTotal);
  }

  // 삭제 기능 -> 어디서?
  // 1) 리덕스의 cartDetail에서 지워주고, 
  // 2) user 모델의 cart에서도 지워줌
  const handleRemoveCartItem = (productId) => {
    dispatch(removeCartItem(productId)); // removeCartItem thuck 함수로
  }

  // 결제 기능 -> 1) history, payment 업데이트...데이터베이스에 저장, 2) 리덕스 state 업데이트
  const handlePaymentClick = () => {
    dispatch(payProducts({ cartDetail })); // cart 안에 들어있는 product 정보들 넣어줌
  }
 
  return (
    <section>
      <div className='text-center m-7'>
        <h2 className='text-2xl'>나의 장바구니</h2>
      </div>

      {cartDetail?.length > 0 ?
        <>

          {/* 두개의 props 생성해서 내려줌*/}
          <CartTable products={cartDetail} onRemoveItem={handleRemoveCartItem} />
          <div className='mt-10'>
            <p><span className='font-bold'>합계:</span>{total} 원</p>
            <button
              className='px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500'
              onClick={handlePaymentClick}
            >
              결제하기
            </button>
          </div>

        </>
        :
        <p>장바구니가 비었습니다.</p>
      }

    </section>

  )
}

export default CartPage