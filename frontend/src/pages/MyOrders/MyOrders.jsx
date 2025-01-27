import React, { useContext, useEffect, useState } from 'react';
import "./MyOrders.css";
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets.js';
import axios from 'axios';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            setData(response.data.orders); 
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <p>
                            {order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                    return item.name + " X " + item.quantity;
                                } else {
                                    return item.name + " X " + item.quantity + ", ";
                                }
                            })}
                        </p>
                        <p>&#8377;{order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p>
                            <span>&#x25cf;</span> <b>{order.status}</b>
                        </p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
                <p>Order placed successfully! Your order is being processed. You'll receive an update soon.</p>
            </div>
        </div>
    );
};

export default MyOrders;















