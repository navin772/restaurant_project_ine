import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = ({ addToCart }) => {
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
        <div>
            <h2>Menu</h2>
            <div>
                {menuItems.map(item => (
                    <div key={item.id}>
                        <img src={item.image} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>${item.price}</p>
                        <button onClick={() => addToCart(item)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;

