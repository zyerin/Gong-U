import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ?
        '' : 'http://localhost:8080'
})

axiosInstance.interceptors.request.use(function (config) {
    // client가 요청을 보낼때, server(백앤드)로 요청이 보내지기 전에  어떠한 것을 하고 싶다면?
    // 여기에 작성하면 됨

    // 요청 메시지의 헤더에 Authorization으로 Bearer 토큰이 같이 전달
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    return config;

}, function(error) { // 요청에 에러가 있다면
    return Promise.reject(error);
})

// 요청을 보내고 response가 올 때
axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    // response가 왔는데, response의 data가 'jwt expired'이라면
    // 토큰이 만료되면(유효시간 경과) reload해서 app.jsx의 dispatch(authUser()) 호출
    if (error.response.data === 'jwt expired') { 
        window.location.reload(); // 페이지 리프레쉬
    }
    
    return Promise.reject(error);
})



export default axiosInstance;