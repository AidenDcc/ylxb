/** 商品分类 */
export type ProductCategory = 'drug' | 'device' | 'wearable' | 'health_food'

/** 商品 */
export interface Product {
  id: string
  tenantId: string
  tenantName: string
  name: string
  category: ProductCategory
  price: number
  originalPrice: number
  stock: number
  sales: number
  images: string[]
  description: string
  specification: string
  manufacturer: string
  approvalNumber: string    // 批准文号
  prescriptionRequired: boolean
  approved: boolean
  isOnSale: boolean
  createdAt: string
}

/** 购物车项 */
export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  tenantId: string
  prescriptionRequired: boolean
}

/** 物流信息 */
export interface LogisticsInfo {
  company: string
  trackingNumber: string
  status: string
  updates: LogisticsUpdate[]
}

export interface LogisticsUpdate {
  time: string
  description: string
}

/** 订单项 */
export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  subtotal: number
}

/** 订单 */
export interface Order {
  id: string
  orderNo: string
  tenantId: string
  tenantName: string
  patientId: string
  patientName: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  logistics?: LogisticsInfo
  address: ShippingAddress
  remark: string
  createdAt: string
  paidAt?: string
  shippedAt?: string
  completedAt?: string
  refundedAt?: string
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'refunded' | 'cancelled'

/** 收货地址 */
export interface ShippingAddress {
  id: string
  patientId: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}
