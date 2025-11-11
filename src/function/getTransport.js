import axios from 'axios';

export default async function getTransportTime(frontendData) {
    console.log(frontendData)
    const {
        currentLocation,
        cart
    } = frontendData;
    console.log('deep',currentLocation)
    const needsTransportTime = cart.some(item => item.transport_time === undefined);

    if (!needsTransportTime) {
        console.log('All items already have transport_time:', cart);
        return cart;
    }

    try {
        const response = await axios.post('http://localhost:3000/TransportTime',frontendData
        );
        console.log('Updated cart:', response.data.cart);
        return response.data.cart;
    } catch (error) {
        console.error('Error updating cart:', error.response?.data || error.message);
        return cart;
    }
}