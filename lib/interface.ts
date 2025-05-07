export interface Product {
  id?: number,
  name: string,
  category: string,
  description?: string,
  price: number,
  imgUrl: string,
  gameVersion: string,
  league: string,
  difficulty: string
}
export interface ProductPage{
  gameVersion: string,
  league: string,
  difficulty: string
}