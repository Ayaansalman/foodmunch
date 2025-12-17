import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import './Verify.css';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const verifyPayment = async () => {
            const success = searchParams.get('success');
            const orderId = searchParams.get('orderId');

            if (!orderId) {
                setStatus('error');
                return;
            }

            try {
                const response = await orderAPI.verify(orderId, success);

                if (response.data.success) {
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [searchParams]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="verify-content">
                        <div className="loader"></div>
                        <h2>Verifying Payment...</h2>
                        <p>Please wait while we confirm your payment</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="verify-content success">
                        <div className="verify-icon">✅</div>
                        <h2>Payment Successful!</h2>
                        <p>Your order has been placed successfully. You can track it in real-time!</p>
                        <div className="verify-actions">
                            <Link to="/orders" className="btn btn-primary btn-lg">
                                Track My Order
                            </Link>
                            <Link to="/menu" className="btn btn-secondary btn-lg">
                                Order More
                            </Link>
                        </div>
                    </div>
                );

            case 'failed':
                return (
                    <div className="verify-content failed">
                        <div className="verify-icon">❌</div>
                        <h2>Payment Failed</h2>
                        <p>Your payment was not completed. Please try again.</p>
                        <div className="verify-actions">
                            <Link to="/cart" className="btn btn-primary btn-lg">
                                Try Again
                            </Link>
                            <Link to="/" className="btn btn-secondary btn-lg">
                                Go Home
                            </Link>
                        </div>
                    </div>
                );

            case 'error':
                return (
                    <div className="verify-content error">
                        <div className="verify-icon">⚠️</div>
                        <h2>Something Went Wrong</h2>
                        <p>We couldn't verify your payment. Please contact support.</p>
                        <div className="verify-actions">
                            <Link to="/" className="btn btn-primary btn-lg">
                                Go Home
                            </Link>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="verify-page">
            <div className="container">
                {renderContent()}
            </div>
        </div>
    );
};

export default Verify;
