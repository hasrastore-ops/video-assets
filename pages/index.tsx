import { useState, useEffect } from 'react';
import { generateWhatsAppLink } from '../lib/whatsapp';
import styles from '../styles/Home.module.css';

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

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleConfirmation = (order: Order) => {
    const message = `📢 PENGESAHAN PESANAN COD 📢

Assalamualaikum/Salam Sejahtera ${order.customerName},

Kami telah menerima pesanan anda seperti berikut:
📦 Produk: ${order.productName}
🔢 Kuantiti: ${order.quantity}
💰 Jumlah: ${order.amount}
🏠 Alamat Penghantaran:
${order.address}

⚠️ Ini adalah pesanan Bayar Tunai Semasa Penghantaran (COD).
Sila balas 'YA' atau 'YES' untuk mengesahkan pesanan ini.
⏰ Sila sahkan dalam masa 24 jam.

Terima kasih.`;

    const whatsappUrl = generateWhatsAppLink(order.phoneNumber, message);
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return <div className={styles.loading}>Loading orders...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Hasra Store - COD Orders</h1>
      </header>

      <main className={styles.ordersList}>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map(order => (
            <div 
              key={order.id} 
              className={`${styles.orderCard} ${order.confirmed ? styles.confirmed : ''}`}
            >
              <div className={styles.orderInfo}>
                <h3>{order.customerName}</h3>
                <p><strong>Phone:</strong> {order.phoneNumber}</p>
                <p><strong>Product:</strong> {order.productName}</p>
                <p><strong>Qty:</strong> {order.quantity}</p>
                <p><strong>Amount:</strong> {order.amount}</p>
                <p><strong>Status:</strong> {order.confirmed ? 'Confirmed' : 'Pending'}</p>
              </div>
              
              {!order.confirmed && (
                <button 
                  onClick={() => handleConfirmation(order)}
                  className={styles.confirmButton}
                >
                  WS Confirmation
                </button>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}