import axios, { AxiosRequestConfig } from 'axios'

// axios 請求攔截器
axios.interceptors.request.use(
  (config) => {
    config.headers!.Authorization = localStorage.getItem('token')!
    return config
  },
  (err) => Promise.reject(err),
);

// axios 回傳攔截器
axios.interceptors.response.use(
  async (response) =>  response,
  (err) => err,
);

type Params = {
  query: string
  variabels: any
}

interface IRequest {
  url: string
  params: Params
  config?: AxiosRequestConfig,
  method: string 
}

function Request({
  url,
  params,
  config,
  method,
}: IRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    switch (method) {
      case 'get':
        return axios.get(url, { ...config })
          .then((resp) => resolve(resp))
          .catch((error) => reject(error))
      case 'post':
        return axios.post(url, params, { ...config })
          .then((resp) => resolve(resp))
          .catch((error) => reject(error))

      case 'put':
        return axios.put(url, params, { ...config })
          .then((resp) => resolve(resp))
          .catch((error) => reject(error))
      case 'patch':
        return axios.patch(url, params, { ...config })
          .then((resp) => resolve(resp))
          .catch((error) => reject(error))
      case 'delete':
        return axios.delete(url, { ...config })
          .then((resp) => resolve(resp))
          .catch((error) => reject(error))
      default:
    }
  });
}

// 建立 axios 實體給不同 baseURL 的 API 使用
export const AuthCore = axios.create({
  baseURL: process.env.VUE_APP_DASHBOARD_URL,
  withCredentials: false,
});


export const Post = (params: any, config?: AxiosRequestConfig) => Request({ 
  url: '/graphql', params, config, method: 'post',
});