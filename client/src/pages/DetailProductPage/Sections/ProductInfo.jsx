import React from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux_store/thunkFunc';

const ProductInfo = ({ product }) => {

    const dispatch = useDispatch();

    const handleClick = () => {
        // thuckfunction -> addToCart
        // 해당 상품을 장바구니에 넣어줌 -> user의 cart에 업데이트
        dispatch(addToCart({ productId: product._id }))
    }

    return (
        <div>
            <p className='text-xl text-bold'>상품 정보</p>

            <ul>
                <li><span className='font-semibold text-gray-900'>가격:</span> {product.price} 원</li>
                <li><span className='font-semibold text-gray-900'>팔린 개수:</span> {product.sold} 개</li>
                <li><span className='font-semibold text-gray-900'>설명:</span> {product.description}</li>
            </ul>



            <div className='mt-3'>
                <button
                    onClick={handleClick}
                    className='w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700'>
                    장바구니로
                </button>
            </div>


        </div>
    )
}

export default ProductInfo