export interface Product {
  id?: number,
  name: string,
  category: string,
  description?: string,
  price: number,
  imgUrl: string,
  gameVersion: 'path-of-exile-1' | 'path-of-exile-2',
  league: string,
  difficulty: string
}
export type PageProps = Promise< {
  gameVersion: 'path-of-exile-1' | 'path-of-exile-2';
  league: string;
  difficulty: string;
}>
