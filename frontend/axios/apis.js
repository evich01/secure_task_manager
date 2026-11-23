import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config || {};

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/token"
    ) {
      originalRequest._retry = true;

      try {
        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        // send refresh token
        const res = await axios.post(
          "http://localhost:3000/token",
          {
            token: userInfo.rtoken,
          }
        );

        // backend returns accessToken
        const newAccessToken = res.data.accessToken;

        // update localStorage
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            ...userInfo,
            token: newAccessToken,
          })
        );

        // retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        console.log("Refresh token expired");

        localStorage.removeItem("userInfo");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;