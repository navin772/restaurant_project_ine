import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = ({ addToCart }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('/api/menu-items/');
                setMenuItems(response.data);
            } catch (error) {
                console.error('Failed to fetch menu items', error);
            }
        };

        fetchMenuItems();
    }, []);

    return (
        <div className="home-container">
            <div className="welcome-container">
                <h1>Welcome to Restaurant Ordering</h1>
            </div>
            <div className="menu-container">
                {menuItems.map(item => (
                    <div key={item.id} className="menu-item">
                        <div className="menu-card">
                            <img src={item.image} alt={item.name} className="menu-image" />
                            <div className="menu-details">
                                <h3 className="menu-title">{item.name}</h3>
                                <p className="menu-description">{item.description}</p>
                                <p className="menu-price">${item.price}</p>
                                <button onClick={() => addToCart(item)} className="add-to-cart-btn">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
