
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedPage from './pages/ProtectedPage'

import HostPage from './pages/HostPage'
import GuestPage from './pages/GuestPage'

import GuestReservePage1 from './pages/GuestPage/guestReserve1'
import GuestReservePage2 from './pages/GuestPage/guestReserve2'
import DetailInfoPage from './pages/DetailInfo.jsx'

import ReservePage1 from './pages/GuestPage/reserve1'
import ReservePage2 from './pages/GuestPage/reserve2'

import HostPageOption1 from './pages/HostPage/option1'
import HostPageOption2 from './pages/HostPage/option2'
import HostPageOption3 from './pages/HostPage/option3'
import HostPageOption4 from './pages/HostPage/option4'
import HostPageOption5 from './pages/HostPage/option5'
import HostPageOption6 from './pages/HostPage/option6'
import HostPageOption7 from './pages/HostPage/option7'
import UploadComplete from './pages/HostPage/uploadComplete'

import LandingPage from './pages/LandingPage'
import DetailProductPage from './pages/DetailProductPage'
import UploadProductPage from './pages/UploadProductPage'

import CartPage from './pages/CartPage'
import LikedPage from './pages/LikedPage'
import WishListPage from './pages/WishListPage'
import HistoryPage from './pages/HistoryPage'

import MyPage from './pages/MyPage/'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { authUser } from './redux_store/thunkFunc';
import LoginUserRoutes from './components/LoginUserRoutes';
import NotAuthRoutes from './components/NotAuthRoutes';

import Navbar_main from './layout/Navbar_main'
import Navbar_Guest from './layout/Navbar_Guest'
import EditPlace from './pages/MyPage/EditPlace.jsx'
import ViewGuests from './pages/MyPage/ViewGuests.jsx'
import PlaceDetail from './pages/MyPage/PlaceDetail.jsx'
import ChatPage from './pages/MyPage/ChatPage.jsx'
import ChatWithGuestPage from './pages/MyPage/ChatWithGuestPage.jsx'
import CancelPage from './pages/MyPage/CancelPage.jsx'










function Layout() {

  const location = useLocation();
  const { pathname } = location;

  return (
    <div className='flex flex-col h-screen justify-between'>
      <ToastContainer
        position='bottom-right'
        theme='Light'
        pauseOnHover
        autoClose={1500}
      />
      {/* 경로에 따라 적절한 Navbar 선택 */}
      {/* pathname === '/' ? <Navbar_main /> : pathname === '/guest' ? <Navbar_Guest /> : <Navbar /> */ }


      <Navbar />
      <main className='mb-auto w-full max-w-5xl mx-auto'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// 라우팅을 설정하는 App.jsx 파일!!
// App 컴포넌트
function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.user?.isAuth); // 리덕스 스토어에 있는 값(isAuth)가져오기 위해 useSelector hook 사용
  // state: 리덕스 스토어에서 전체 state를 가져옴
  // state.user?.isAuth: state안의 user에 isAuth가 있으면 isAuth property 값 리턴해줌 -> true or false 중 하나
  
  const { pathname } = useLocation();

  // useEffect는 [isAuth, pathname, dispatch]안에 있는 값들이 바뀌면 호출됨
  useEffect(() => {
    if(isAuth) { // isAuth는 리덕스 스토어에서 로그인을 올바르게 한 사람만 true로 저장 -> isAuth가 true일때만 체크
      // console.log("인증요청 테스트");
      // isAuth가 true일때만 백앤드에 요청 -> 백앤드에서 올바른 토큰을 가지고 있는 사람인지 체크
      dispatch(authUser()); // thunk 함수 이름 = authUser() -> 인수(보내는 값) 없음
    }
  }, [isAuth, pathname, dispatch]) // []: dependency array
  // dispatch는 바뀌지 않음. 밑줄 없애줄라고 추가해주는 것
  // pathname은 url 경로(useLocation 훅에서 가져옴) -> 페이지가 바뀌면 호출됨


  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<MainPage />} />

        <Route path="/landing" element={<LandingPage />} />
        <Route path="/guest/reservation1" element={<GuestReservePage1 />} />
        
        {/* 로그인한 사람만 갈 수 있는 경로 ... 만약 로그인 안 한 사람이 접근하면 못 가게 함*/}
        {/* 중첩 라우팅을 이용 -> 만약 isAuth가 true면 LoginUserRoutes에서의 Outlet이 밑의 경로들 (/protected 등등)이 됨*/}
        <Route element={<LoginUserRoutes isAuth={isAuth} />}> 
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/guest" element={<GuestPage />} />
          
          <Route path="/host/option1" element={<HostPageOption1 />} />
          <Route path="/host/option1/option2" element={<HostPageOption2  />} />
          <Route path="/host/option1/option2/option3" element={<HostPageOption3 />} />
          <Route path="/host/option1/option2/option3/option4" element={<HostPageOption4 />} />
          <Route path="/host/option1/option2/option3/option4/option5" element={<HostPageOption5 />} />
          <Route path="/host/option1/option2/option3/option4/option5/option6" element={<HostPageOption6 />} />
          <Route path="/host/option1/option2/option3/option4/option5/option6/option7" element={<HostPageOption7 />} />
          <Route path="host/completion" element={<UploadComplete />} />

          <Route path="/product/upload" element={<UploadProductPage />} />
          <Route path="/product/:productId" element={<DetailProductPage />} />
          <Route path="/place/:placeId" element={<DetailInfoPage />} />
          <Route path="/guest/reserve/complete" element={<GuestReservePage2 />} />

          <Route path="/guest/reserve1" element={<ReservePage1 />} />
          <Route path="/guest/reserve2" element={<ReservePage2 />} />
          


          <Route path="/user/cart" element={<CartPage />} />
          <Route path="/user/liked" element={<LikedPage />} />
          <Route path="/user/wishlist" element={<WishListPage />} />
          <Route path="/history" element={<HistoryPage />} /> 
          <Route path="/mypage" element={<MyPage />} />    
          <Route path="/place/edit/:id" element={<EditPlace />} />  
          <Route path="/place/guests/:id" element={<ViewGuests />} /> 
          <Route path="/place/cancel/:id" element={<CancelPage />} />
          <Route path="/place/reserved/:id" element={<PlaceDetail />} />  
          <Route path="/chat/:hostId/:placeId" element={<ChatPage />} />  
          <Route path="/chat/guest/:placeId/:guestId" element={<ChatWithGuestPage />} />     
            
        </Route>


        {/* 로그인한 사람은 갈 수 없는 경로 */}
        <Route element={<NotAuthRoutes isAuth={isAuth} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

        </Route>

      </Route>

    </Routes>
  )
}

export default App
