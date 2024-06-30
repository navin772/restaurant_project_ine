import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/orders/');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            }
        };

        fetchOrders();
    }, []);

    const markOrderAsCompleted = async (orderId) => {
        try {
            await axios.patch(`/api/orders/${orderId}/`, { status: 'Completed' });
            setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'Completed' } : order));
        } catch (error) {
            console.error('Failed to mark order as completed', error);
        }
    };

    return (
        <div>
            <h2>Incoming Orders</h2>
            <div>
                {orders.map(order => (
                    <div key={order.id}>
                        <h3>Order #{order.id}</h3>
                        <p>Table: {order.table_number}</p>
                        <p>Status: {order.status}</p>
                        <ul>
                            {order.items.map(item => (
                                <li key={item.id}>{item.menu_item.name} x {item.quantity}</li>
                            ))}
                        </ul>
                        <p>Total: ${order.total_amount}</p>
                        <button onClick={() => markOrderAsCompleted(order.id)} disabled={order.status === 'Completed'}>
                            Mark as Completed
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;

