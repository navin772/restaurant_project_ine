import React from 'react';
import axios from 'axios';
import './Cart.css'; // Import your CSS for Cart styling

const Cart = ({ cart, updateQuantity, removeFromCart, placeOrder }) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        const orderItems = cart.map(item => ({
            menu_item: item.id,
            quantity: item.quantity,
            sub_total: item.price * item.quantity,
        }));
        try {
            const response = await axios.post('/api/orders/', {
                customer_id: 1,  // Replace with actual customer ID or get dynamically
                table_number: 1, // Example table number
                total_amount: totalAmount,
                items: orderItems,
            });
            console.log('Order placed:', response.data);
            placeOrder(); // Clear cart after placing order
        } catch (error) {
            console.error('Failed to place order', error);
        }
    };       

    return (
        <div className="cart-container">
            <h2>Cart</h2>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-info">
                            <img src={item.image} alt={item.name} />
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p>${item.price}</p>
                            </div>
                        </div>
                        <div className="item-actions">
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            />
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-total">
                <h3>Total: ${totalAmount.toFixed(2)}</h3>
                <button className="place-order-button" onClick={handlePlaceOrder}>Place Order</button>
            </div>
        </div>
    );
};

export default Cart;
