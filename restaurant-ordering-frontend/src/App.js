import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import Orders from './components/Orders';
import StaffOrders from './components/StaffOrders'; // Import StaffOrders component
import './App.css';

axios.defaults.baseURL = 'http://localhost:8000';

const App = () => {
    const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
    const [cart, setCart] = useState(initialCart);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isStaff, setIsStaff] = useState(false); // State for staff login

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const addToCart = (item) => {
        if (!isLoggedIn) {
            alert('Please login to add items to the cart.');
            return;
        }
        setCart(prevCart => {
            const itemInCart = prevCart.find(i => i.id === item.id);
            if (itemInCart) {
                return prevCart.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsStaff(false); // Reset staff login state on logout
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    return (
        <Router>
            <div className="navbar">
                <Link to="/" className="navbar-brand">Restaurant Ordering</Link>
                <div className="navbar-links">
                    {isLoggedIn ? (
                        <>
                            <Link to="/cart">Cart</Link>
                            <Link to="/orders">Orders</Link>
                                <button onClick={handleLogout}>Logout</button>
                                <button onClick={handleLogout}>Logout</button>
                            ){'}'}
                            <button onClick={handleLogout}>Logout</button>
                            ){'}'}
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
            <Switch>
                <Route path="/login">
                    <Login setIsLoggedIn={setIsLoggedIn} />
                </Route>
                <Route path="/signup" component={Signup} />
                <Route path="/cart">
                    <Cart
                        cart={cart}
                        updateQuantity={(itemId, quantity) => setCart(cart.map(item => item.id === itemId ? { ...item, quantity } : item))}
                        removeFromCart={(itemId) => setCart(cart.filter(item => item.id !== itemId))}
                        placeOrder={async () => {
                            const orderItems = cart.map(item => ({
                                menu_item: item.id,
                                quantity: item.quantity,
                                sub_total: item.price * item.quantity,
                            }));
                            try {
                                const response = await axios.post('/api/orders/', {
                                    table_number: 1, // Example table number
                                    total_amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                                    items: orderItems,
                                });
                                console.log('Order placed:', response.data);
                                setCart([]);
                                localStorage.removeItem('cart'); // Clear cart after placing order
                            } catch (error) {
                                console.error('Failed to place order', error);
                            }
                        }}
                    />
                </Route>
                <Route path="/orders" component={Orders} />
                <Route path="/staff">
                    <StaffOrders />
                </Route>
                <Route path="/">
                    <Home addToCart={addToCart} />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
