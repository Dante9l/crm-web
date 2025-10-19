import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 客户管理
 */
export const CustomerApi = {
  page: (params: any) => http.post(COMMON_ADMIN_API + '/customer/page', params),
  list: (params: any) => http.post(COMMON_ADMIN_API + '/customer/list', params),
  saveOrEdit: (params: any) => http.post(COMMON_ADMIN_API + '/customer/saveOrUpdate', params),
  remove: (params: any) => http.post(COMMON_ADMIN_API + '/customer/remove', params),
  export: (params: any) => http.post(COMMON_ADMIN_API + '/customer/export', params, { responseType: 'blob' }),
  toPublic: (params: any) => http.post(COMMON_ADMIN_API + '/customer/toPublic', params),
  toPrivate: (params: any) => http.post(COMMON_ADMIN_API + '/customer/toPrivate', params)
}
