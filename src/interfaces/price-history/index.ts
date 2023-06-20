import { ProductInterface } from 'interfaces/product';
import { GetQueryInterface } from 'interfaces';

export interface PriceHistoryInterface {
  id?: string;
  product_id?: string;
  old_price: number;
  new_price: number;
  date: any;
  created_at?: any;
  updated_at?: any;

  product?: ProductInterface;
  _count?: {};
}

export interface PriceHistoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  product_id?: string;
}
