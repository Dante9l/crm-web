import { COMMON_ADMIN_API } from '@/api/axios/servicePort'
import http from '@/api'

/**
 * @name 商品管理接口
 */
export const ProductApi = {
  /** 分页查询商品 */
  page: (params: any) => http.post(`${COMMON_ADMIN_API}/product/page`, params),

  /** 新增或编辑商品 */
  saveOrEdit: (params: any) => http.post(`${COMMON_ADMIN_API}/product/saveOrEdit`, params),

  /** 删除商品 */
  remove: (params: any) => http.post(`${COMMON_ADMIN_API}/product/remove`, params)
}
