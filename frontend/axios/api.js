import axios from 'axios';

//Set the baseUrl
const api = axios.create({
  baseURL: "http://localhost:3000",
})

//setup the request interceptor
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if(userInfo?.token){
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

//setup the response interceptor
api.interceptors.response.use((response) => response,
async (error) => {
  const originalRequest = error.config || {};

  //check access token expired
  if(
    error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/token"
  ){
    originalRequest._retry = true;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // requesting for a new access token
      const res = await axios.post('http://localhost:3000/token',{
        token: userInfo.rtoken,
      });

      // access new access token
      const newAccessToken = res.data.accessToken;

      //update localStorage
      localStorage.setItem("userInfo", JSON.stringify({
        ...userInfo,
        token: newAccessToken,
      })
    );

    //retry original request
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return api(originalRequest);

    } catch (refreshError) {
      console.log("Refresh token expired");
      localStorage.removeItem("userInfo");

      window.location.href='/login';

      return Promise.reject(refreshError);
      
    }
  }
return Promise.reject(error);
}
);

export default api;

