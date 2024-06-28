import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance  from "../utils/axios";

//createAsyncThunk 함수는 비동기 액션을 생성할 때 사용
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (body, thunkAPI) => {
        try{
            const response = await axiosInstance.post(
                '/users/register',
                body
            )

            return response.data;
        } catch (error){
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);

        }
    }
)

// loginUser() action을 dispatch 하면 아래와 같은 비동기 작업이 수행됨
// Promise를 반환한다. -> pending, fulfilled, rejected..etc
export const loginUser = createAsyncThunk(
    "user/loginUser", // action type 지정.. (userSlice에서 판별)
    async (body, thunkAPI) => { // 콜백함수: 매개변수 1) 넘겨줄 값 2) thunkAPI: thunk 함수에 전달되는 모든 파라미터를 포함하는 객체
        try {
            const response = await axiosInstance.post('/users/login', body ) 
            // 백앤드 서버로 post 요청 보냄
            // 백엔드에 요청을 보낼 때 endpoint 설정
            // body 객체에는 이메일, password 담겨있음
            // 백앤드의 /users/login으로 body를 전송하여 사용자 인증(로그인) 요청

            // 이때 요청은 어디서 받는가?? -> server/routes/users.js에서 post 요청을 받아서, 처리

            // 백앤드에서 요청이 성공하면 reponse.data에 데이터를 담아 client에게 응답을 반환해줌
            // 백앤드에서 받은 응답은 action.payload이다
            // console.log(response.data);
            return response.data; 
            
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// App.jsx에서 이 thunk 함수 호출
export const authUser = createAsyncThunk(
    "user/authUser", // 액션 타입 정의
    async (_, thunkAPI) => { // 매개변수-넘겨주는 값 없음(_), thunkAPI만 작성(항상 두번째 매개변수)
        try {
            const response = await axiosInstance.get(
                `/users/auth`
            ); // 요청을 보낼 때, 요청 헤더에 accessToken을 넣어줌 -> axios.js
            // get 요청을 보낼 endpoint -> router/users.js으로
            // 보내는 값(인수) 없기 때문에 endpoint만 작성
            // 요청을 보낼 때 요청 헤더에 AccessToken을 넣어서 보냄 <- axios.js에서

            return response.data; // 백앤드한테 응답 받음 -> 유저데이터들을 리덕스에 업데이트(userSlice.js)
        } catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// Navbar/Sections/NavItem.jsx에서 이 thunk 함수 호출
export const logoutUser = createAsyncThunk(
    "user/logoutUser", // 액션 타입 정의
    async (_, thunkAPI) => { // 매개변수-넘겨주는 값 없음(_), thunkAPI만 작성(항상 두번째 매개변수)
        try {
            const response = await axiosInstance.post(
                `/users/logout`
            );

            return response.data; // 백앤드한테 응답 받음 -> 유저데이터들을 리덕스에 업데이트(userSlice.js)
        } catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// 장바구니 담기
// productInfo에서 dispatch
export const addToCart = createAsyncThunk(
    "user/addToCart", // 액션 타입 정의
    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.post(
                `/users/cart`, // 백앤드에 요청을 보내는 경로 -> user.js에 cart 라우트 생성!!
                body, // { productId: product._id }
            );

            return response.data; // 액션을 위한 payload 받아서 리덕스에 업데이트 -> userSlice.js

        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// 위시리스트 담기
// productInfo에서 dispatch
export const addToWishList = createAsyncThunk(
    "user/addToWishList", // 액션 타입 정의
    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.post(
                `/users/wishlist`, // 백앤드에 요청을 보내는 경로 -> user.js에 wishlist 라우트 생성!!
                body, // { placeId: place._id }
            );

            return response.data; // 액션을 위한 payload 받아서 리덕스에 업데이트 -> userSlice.js

        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// cartpage에서 dispatch
// 리덕스 스토어에 cartDetail 생성
export const getCartItems = createAsyncThunk(
    "user/getCartItems",

    // cartpage에서 보내준 데이터들 distruct해서 cartItemIds, userCart를 개별변수로 사용
    async ({ cartItemIds, userCart }, thunkAPI) => { 
        try {
            const response = await axiosInstance.get( // 상품 id를 통 해당하는 데이터를 디비에서 가져오도록 백엔드 요청
                `/products/${cartItemIds}?type=array`); // cartItemIds -> 여러 개의 상품 id가 배열로 제공

            /* response.data -> 백앤드에서 cart에 담긴 product 데이터 가져온 것
               userCart -> userData.cart (유저 모델의 cart)
            -> forEach 돌려서 합쳐줌!! 
            -> 그럼 이게 리덕스 스토어의 cartDetail 데이터가 됨 ... userslice에서 cartDetail에 데이터 넣어줌 */

            // cartItem들에 해당하는 정보들을 Product 모델에서 가져온 후에(response.data에) quantity 정보를 넣어준다
            userCart.forEach(cartItem => {
                response.data.forEach((productDetail, index) => {
                    if (cartItem.id === productDetail._id) {
                        response.data[index].quantity = cartItem.quantity; // response.data에 quantity 넣어줌
                    }
                })
            })

            // 최종 response.data = response.data + quantity

            return response.data; // response.data가 action payload!! -> userslice
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// cartpage에서 dispatch
// 리덕스 스토어에 wishlistDetail 생성
export const getWishListItems = createAsyncThunk(
    "user/getWishListItems",

    // cartpage에서 보내준 데이터들 distruct해서 cartItemIds, userCart를 개별변수로 사용
    async ({ wishlistItemIds, userWishlist }, thunkAPI) => { 
        try {
            const response = await axiosInstance.get( // 상품 id를 통 해당하는 데이터를 디비에서 가져오도록 백엔드 요청
                `/place/${wishlistItemIds}?type=array`); // cartItemIds -> 여러 개의 상품 id가 배열로 제공

            /* response.data -> 백앤드에서 cart에 담긴 product 데이터 가져온 것
               userCart -> userData.cart (유저 모델의 cart)
            -> forEach 돌려서 합쳐줌!! 
            -> 그럼 이게 리덕스 스토어의 cartDetail 데이터가 됨 ... userslice에서 cartDetail에 데이터 넣어줌 */

            // cartItem들에 해당하는 정보들을 Product 모델에서 가져온 후에(response.data에) quantity 정보를 넣어준다
            userWishlist.forEach(wishlistItem => {
                response.data.forEach((placeDetail, index) => {
                    if (wishlistItem.id === placeDetail._id) {
                        response.data[index].quantity = wishlistItem.quantity; // response.data에 quantity 넣어줌
                    }
                })
            })

            // 최종 response.data = response.data + quantity

            return response.data; // response.data가 action payload!! -> userslice
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// 장바구니 삭제 기능
export const removeCartItem = createAsyncThunk(
    "user/removeCartItem",
    async (productId, thunkAPI) => {
        try {
            // 백앤드로 요청을 보내서 1) 데이터베이스 (user의 cart에서 지움 ... delete 메소드
            const response = await axiosInstance.delete(
                `/users/cart?productId=${productId}` 
            );

            // 2) 리덕스에서 지움 ... How?
            // response로 받은 cart와 productInfo를 이용해서 새롭게 cartDetail을 생성!!
            response.data.cart.forEach(cartItem => {
                response.data.productInfo.forEach((productDetail, index) => {
                    if (cartItem.id === productDetail._id) {
                        response.data.productInfo[index].quantity = cartItem.quantity;
                    }
                })
            })

            return response.data; // -> action payload 완성 -> userslice에서 업데이트
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// 위시리스트 삭제 기능
export const removeWishlistItem = createAsyncThunk(
    "user/removeWishlistItem",
    async (placeId, thunkAPI) => {
        try {
            // 백앤드로 요청을 보내서 1) 데이터베이스 (user의 cart에서 지움 ... delete 메소드
            const response = await axiosInstance.delete(
                `/users/wishlist?placeId=${placeId}` 
            );

            // 2) 리덕스에서 지움 ... How?
            // response로 받은 cart와 productInfo를 이용해서 새롭게 cartDetail을 생성!!
            response.data.wishlist.forEach(wishlistItem => {
                response.data.placeInfo.forEach((placeDetail, index) => {
                    if (wishlistItem.id === placeDetail._id) {
                        response.data.placeInfo[index].quantity = wishlistItem.quantity;
                    }
                })
            })
            console.log(response.data);
            return response.data; // -> action payload 완성 -> userslice에서 업데이트
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)


// 결제기능
export const payProducts = createAsyncThunk(
    "user/payProducts",
    async (body, thunkAPI) => {
        try {
            // 백앤드 요청 보냄 -> 1) 데이터베이스에 저장
            const response = await axiosInstance.post(
                `/users/payment`,
                body
            );

            return response.data; // -> 2) 리덕스 state 업데이트
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

// 예약기능
export const addToReserved = createAsyncThunk(
    "user/addToReserved",
    async (body, thunkAPI) => {
        try {
            // 백앤드 요청 보냄 -> 1) 데이터베이스에 저장
            const response = await axiosInstance.post(
                `/users/reserve`,
                body
            );

            return response.data; // -> 2) 리덕스 state 업데이트

        } catch (error) {
            // 예약 실패 시 처리
            console.error('Reservation failed:', error);
            if (error.response && error.response.status === 400 && error.response.data.message === '이미 해당 날짜와 시간에 예약이 있습니다.') {
                // 겹치는 예약 팝업을 보여줄 수 있음
                alert('이미 해당 날짜와 시간에 예약이 있습니다. 다른 날짜와 시간대를 선택해주세요.');
            } else {
                // 기타 오류 처리
                alert('예약에 실패했습니다. 다시 시도해주세요.');
            }
            // 오류를 throw하여 catch 블록에서 잡을 수 있도록 함
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)


// 검색 조건 필터링
export const setSearchConditions = createAsyncThunk(
    "user/setSearchConditions",
    async(searchConditions, thunkAPI) => {
        try {

            return searchConditions;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.searchConditions || error.message);
        }
    }
)




