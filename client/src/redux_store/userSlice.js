// Redux에서 action의 type 정의, action의 함수, reducer를 따로 작성해야 하는 번거로움
// 하지만 toolkit에서 제공하는 createSlice 함수를 사용하면 이러한 번거로운 작업을 한 번에 정의할 수 있음

import{ createSlice } from "@reduxjs/toolkit"

import { getCartItems, registerUser } from "./thunkFunc";
import { loginUser } from "./thunkFunc";
import { authUser } from "./thunkFunc";
import { logoutUser } from "./thunkFunc";
import { addToCart } from "./thunkFunc";
import { addToWishList } from "./thunkFunc";
import { getWishListItems } from "./thunkFunc";
import { removeWishlistItem } from "./thunkFunc";
import { addToReserved } from "./thunkFunc";
import { removeCartItem } from "./thunkFunc";
import { payProducts } from "./thunkFunc";
import { setSearchConditions } from "./thunkFunc";
import { toast } from "react-toastify";

// createSlice를 통해 관리할 데이터 정의
const initialState ={
    userData: {
        id: '',
        email: '',
        name: '',      
        rold: 0, // user인지 관리자인지
        image: '', // 이미지 URL,
        wallet:'',
    },
    isAuth: false, 
    isLoading: false,
    error: '',
}

// createSlice로 redux의 reducer에 action과 payload등의 데이터를 쉽게 설정 가능.
// userSlice는 action에 대한 상태변화를 처리하고(비동기 함수는 thunk 생성), 해당 상태변화에 따른 reducer를 설정
const userSlice = createSlice({
    name: 'user', // slice의 이름 -> action을 생성할 때 정의한 타입이 여기서 action을 식별하는데에 쓰임
    initialState, // slice의 초기상태
    reducers:{}, // Reducer는 action에 의한 state를 처리함
    extraReducers: (builder) => { // 기존 reducer에 추가적인 케이스 정의
        builder

        // 인증체크
        // authUser thunk 액션 함수
        .addCase(authUser.pending, (state) =>{ 
            state.isLoading = true; // 로딩상태로 설정
        })
        .addCase(authUser.fulfilled, (state, action) => { // 토큰 인증 ok라면
            state.isLoading = false; // 로딩상태 해제
            state.userData = action.payload; // action.payload는 백앤드에서 받은 응답(response.data) -> userData로 업데이트
            state.isAuth = true; // 인증상태 true로 업데이트
        })
        .addCase(authUser.rejected, (state, action) =>{ // 토큰이 만료가 된 사람이면
            state.isLoading = false;
            state.error = action.payload;
            state.userData = initialState.userData; // 유저데이터 초기화
            state.isAuth = false; // 인증상태 false로 업데이트
            localStorage.removeItem('accessToken'); // local storage에서 토큰 삭제
        })


        // 회원가입
        .addCase(registerUser.pending, (state) =>{
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false;
            toast.info('회원가입을 성공했습니다');
        })
        .addCase(registerUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        // 로그인
        // action이 무엇을 반환하는가..pending? fulfilled? rejected?
        // user/loginUser의 action
        .addCase(loginUser.pending, (state) =>{ // login action이 실행되고 있는 중일 때의 reducer에서의 처리를 정의
            state.isLoading = true; // 로딩상태로 설정
        })
        .addCase(loginUser.fulfilled, (state, action) => { // login action이 성공적으로 완료된 경우의 처리
            state.isLoading = false; // 로딩상태 해제
            state.userData = action.payload; // action.payload는 백앤드에서 받은 응답(response.data) -> userData로 업데이트
            state.isAuth = true; // 인증상태 true로 업데이트
            localStorage.setItem('accessToken', action.payload.accessToken); // localstorage에 유저의 토큰을 저장
            state.wishlistDetail = [];
            state.searchCond = [];
        })
        .addCase(loginUser.rejected, (state, action) =>{ // login action이 실패한 경우의 처리
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        // 로그아웃
        .addCase(logoutUser.pending, (state) =>{
            state.isLoading = true;
        })
        .addCase(logoutUser.fulfilled, (state, action) => { // login action이 성공적으로 완료된 경우의 처리
            state.isLoading = false; // 로딩상태 해제
            state.userData = initialState.userData; // 초기화
            state.isAuth = false; // 인증상태 false로 업데이트
            state.cartDetail = [];
            state.wishlistDetail = [];
            state.searchCond = [];
            localStorage.removeItem('accessToken'); // localstorage에 있는 유저의 토큰을 remove

        })
        .addCase(logoutUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        


        
        // 장바구니 추가
        .addCase(addToCart.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userData.cart = action.payload;
            toast.info('장바구니에 추가되었습니다.');
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        
        // 위시리스트 추가
        .addCase(addToWishList.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addToWishList.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userData.wishlist = action.payload;
            toast.info('위시리스트에 추가되었습니다.');
        })
        .addCase(addToWishList.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })


        // 장바구니에서 데이터 가져오기
        .addCase(getCartItems.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCartItems.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartDetail = action.payload; // cartDetail에 response.data 넣어줌
        })
        .addCase(getCartItems.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        // 위시리스트에서 데이터 가져오기
        .addCase(getWishListItems.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getWishListItems.fulfilled, (state, action) => {
            state.isLoading = false;
            state.wishlistDetail = action.payload; // wishlistDetail에 response.data 넣어줌
        })
        .addCase(getWishListItems.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        // 장바구니에서 삭제 ... 리덕스 스토어에 새롭게 생성한 cartDetail 업데이트
        .addCase(removeCartItem.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(removeCartItem.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartDetail = action.payload.productInfo;
            state.userData.cart = action.payload.cart;
            toast.info('상품이 장바구니에서 제거되었습니다.');
        })
        .addCase(removeCartItem.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        // 위시리스트에서 삭제 ... 리덕스 스토어에 새롭게 생성한 wishlistDetail 업데이트
        .addCase(removeWishlistItem.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(removeWishlistItem.fulfilled, (state, action) => {
            state.isLoading = false;
            state.wishlistDetail = action.payload.placeInfo;
            state.userData.wishlist = action.payload.wishlist;
            toast.info('상품이 위시리스트에서 제거되었습니다.');
        })
        .addCase(removeWishlistItem.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        // 상품 결제하기
        .addCase(payProducts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(payProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartDetail = [];
            state.userData.cart = [];
            toast.info('성공적으로 상품을 구매했습니다.');
        })
        .addCase(payProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        // 검색조건 업데이트
        .addCase(setSearchConditions.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(setSearchConditions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.searchCond = action.payload;
        })
        .addCase(setSearchConditions.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        // 예약하기
        .addCase(addToReserved.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addToReserved.fulfilled, (state, action) => {
            state.isLoading = false;
            state.searchCond = [];
            toast.info('성공적으로 상품을 구매했습니다.');
        })
        .addCase(addToReserved.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })
     }
})

export default userSlice.reducer;