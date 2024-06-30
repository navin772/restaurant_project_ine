// src/components/StaffOrders.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StaffOrders.css'; // Import the StaffOrders.css file for styles

const StaffOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/staff/orders/');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            }
        };

        fetchOrders();
    }, []);

    const markCompleted = async (orderId) => {
        try {
            await axios.patch(`/api/staff/orders/${orderId}/complete/`);
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.id === orderId) {
                    return { ...order, completed: true };
                }
                return order;
            }));
        } catch (error) {
            console.error('Failed to mark order as completed', error);
        }
    };

    return (
        <div className="staff-orders-container">
            <h2>Staff Orders</h2>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <h3>Order ID: {order.id}</h3>
                        <p>Table Number: {order.table_number}</p>
                        <div className="order-items">
                            <h4>Order Items:</h4>
                            <ul>
                                {order.items.map(item => (
                                    <li key={item.id}>
                                        {item.quantity} x {item.menu_item.name} - ${item.sub_total}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p>Total Amount: ${order.total_amount}</p>
                        {!order.completed && (
                            <button onClick={() => markCompleted(order.id)}>Mark Completed</button>
                        )}
                        {order.completed && <p className="completed-text">Completed</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffOrders;
