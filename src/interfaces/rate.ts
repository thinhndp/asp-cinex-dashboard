export interface Rate {
  id: string,
  name: string,
  minAge: number,
}

export interface RateInput {
  name: string,
  minAge: number,
}

export interface RateValidation {
	name: string,
	minAge: string,
}
