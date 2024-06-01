import axios from 'axios';
import { message } from 'antd';
import config from '../config';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // || config.baseURl,
  // baseURL: config.baseUR,

  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: getLocalToken(),
  },
});

function getLocalToken() {
  return window.localStorage.getItem('token');
}

function refreshToken() {
  return instance.post('/refreshtoken').then((res) => res.data);
}

instance.setToken = (token) => {
  instance.defaults.headers.Authorization = token;
  window.localStorage.setItem('token', token);
};

let isRefreshing = false;
let requests = [];

instance.interceptors.response.use(
  (response) => {
    const { status } = response.data;
    if (status === 1000) {
      const { config } = response;
      if (!isRefreshing) {
        isRefreshing = true;
        return refreshToken()
          .then((res) => {
            const { token } = res;
            instance.setToken(token);
            config.headers.Authorization = token;
            config.baseURL = '';

            requests.forEach((cb) => cb(token));
            requests = [];
            return instance(config);
          })
          .catch((res) => {
            console.error('refreshtoken error =>', res);
            window.location.href = '/';
          })
          .finally(() => {
            isRefreshing = false;
          });
      }
      return new Promise((resolve) => {
        requests.push((token) => {
          config.baseURL = '';
          config.headers.Authorization = token;
          resolve(instance(config));
        });
      });
    }
    return response;
  },
  (error) => {
    message.error(`请求出错${error.message}`);
    return Promise.reject(error);
  },
);

function buildUrlWithParams(url, params) {
  const searchParams = new URLSearchParams(params).toString();
  return `${url}?${searchParams}&t=${new Date()}`;
}

export default function (url, type = 'GET', data = {}) {
  let promise;
  return new Promise((resolve, reject) => {
    if (type === 'GET') {
      const urlWithParams = buildUrlWithParams(url, data);
      promise = instance.get(urlWithParams);
    } else {
      promise = instance.post(url, data);
    }
    promise
      .then((res) => {
        if (res.data && res.data.status === 0) {
          resolve(res.data);
        } else {
          message.error(res.data.msg);
          resolve(res.data);
        }
      })
      .catch((err) => {
        const { data } = err;
        if (data && data.msg) {
          message.error(`请求出错${data.msg}`);
          return;
        }
        message.error(`请求出错${err.message}`);
      });
  });
}
