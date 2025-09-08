import axios from 'axios';
import { TELEGRAM_BOT_TOKEN } from '../env';

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function fetchOrders() {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`, {
      params: {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        limit: 100,
        allowed_updates: ['message']
      }
    });

    return response.data.result
      .map((update: any) => update.message)
      .filter((msg: any) => msg.text?.includes('PESANAN BARU'))
      .map(parseOrderFromMessage);
  } catch (error) {
    console.error('Telegram API Error:', error);
    return [];
  }
}

function parseOrderFromMessage(message: any): Order {
  const text = message.text;
  
  return {
    id: message.message_id.toString(),
    productName: extractField(text, 'PRODUK'),
    quantity: parseInt(extractField(text, 'KUANTITI')),
    amount: extractField(text, 'JUMLAH'),
    customerName: extractField(text, 'Nama'),
    phoneNumber: extractField(text, 'No Telefon'),
    address: extractField(text, 'Alamat'),
    postcode: extractField(text, 'Poskod'),
    state: extractField(text, 'Negeri'),
    paymentType: extractField(text, 'JENIS PEMBAYARAN'),
    time: extractField(text, 'MASA'),
    confirmed: false
  };
}

function extractField(text: string, field: string): string {
  const pattern = new RegExp(`(${field}:\\s*)([^\\n]+)`,'gi');
  const match = pattern.exec(text);
  return match ? match[2].trim() : '';
}