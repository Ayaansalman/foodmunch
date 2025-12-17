import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [orderUpdates, setOrderUpdates] = useState([]);

    useEffect(() => {
        // Connect to Socket.io server
        const newSocket = io('http://localhost:4000', {
            transports: ['websocket', 'polling'],
            autoConnect: true
        });

        newSocket.on('connect', () => {
            console.log('🔌 Socket connected:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('📴 Socket disconnected');
            setConnected(false);
        });

        // Listen for order updates
        newSocket.on('myOrderUpdate', (data) => {
            console.log('📦 Order update received:', data);
            setOrderUpdates(prev => [...prev, data]);
        });

        newSocket.on('orderUpdate', (data) => {
            console.log('📦 Global order update:', data);
            setOrderUpdates(prev => [...prev, data]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Join user room when authenticated
    useEffect(() => {
        if (socket && isAuthenticated && user) {
            socket.emit('joinUserRoom', user.id);
        }
    }, [socket, isAuthenticated, user]);

    const clearOrderUpdates = () => {
        setOrderUpdates([]);
    };

    const value = {
        socket,
        connected,
        orderUpdates,
        clearOrderUpdates
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
