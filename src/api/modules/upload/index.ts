import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'
import type { AxiosRequestConfig } from 'axios'

export const uploadFile = (params: FormData): Promise<any> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return http.post(COMMON_ADMIN_API + '/common/upload/file', params, config)
}

export const uploadVideo = (params: FormData): Promise<any> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return http.post(COMMON_ADMIN_API + '/common/upload/video', params, config)
}
