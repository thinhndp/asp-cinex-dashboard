export interface Discount {
  id: string,
  code: string,
  discountAmount: number,
  expiredDate: string,
  isActive: boolean,
}

export interface DiscountInput {
  code: string,
  discountAmount: number,
  expiredDate: string,
  isActive: boolean,
}

export interface DiscountValidation {
	code: string,
	discountAmount: string,
}
