import { fetchOrders } from '../../lib/telegram';
import type { NextApiRequest, NextApiResponse } from 'next';

type Order = {
  id: string;
  productName: string;
  quantity: number;
  amount: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  postcode: string;
  state: string;
  paymentType: string;
  time: string;
  confirmed: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order[]>
) {
  try {
    const orders = await fetchOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json([]);
  }
}