import React from 'react';
import './Cart.css'; // Import your CSS for Cart styling

const Cart = ({ cart, updateQuantity, removeFromCart, placeOrder }) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                <button onClick={placeOrder}>Place Order</button>
            </div>
        </div>
    );
};

export default Cart;
