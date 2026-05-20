import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, ChevronLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
    
    // In a real app, you would fetch the note details using the ID. 
    // Here we use mock data.
    const note = {
        id: id || "1",
        title: "Complete Data Structures & Algorithms Handwritten Notes",
        author: "Alex Morgan",
        price: 199,
        platformFee: 5, // 5 INR platform fee
    };

    const totalAmount = note.price + note.platformFee;

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        // Simulate Payment Processing Gateway
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            toast.success("Payment Successful!");
            
            // Redirect to My Purchases after a short delay
            setTimeout(() => {
                navigate('/my-purchases');
            }, 3000);
            
        }, 2000);
    };

    const styles = `
      .chk-wrapper {
        min-height: calc(100vh - 100px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .chk-container {
        width: 100%;
        max-width: 900px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }

      @media (min-width: 992px) {
        .chk-container {
            grid-template-columns: 1fr 1.2fr;
        }
      }

      .chk-glass-panel {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(148, 163, 184, 0.15);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
      }

      .chk-back-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #94a3b8;
        background: transparent;
        border: none;
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 16px;
        cursor: pointer;
        transition: color 0.3s ease;
        padding: 0;
      }

      .chk-back-btn:hover {
        color: #f8fafc;
      }

      /* Order Summary */
      .chk-summary-title {
        font-size: 20px;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 16px;
      }

      .chk-note-card {
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
      }

      .chk-note-card h3 {
        font-size: 15px;
        font-weight: 600;
        color: #f8fafc;
        line-height: 1.4;
        margin-bottom: 6px;
      }

      .chk-note-card p {
        font-size: 13px;
        color: #94a3b8;
      }

      .chk-price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        color: #cbd5e1;
        font-size: 14px;
      }

      .chk-price-row.total {
        border-top: 1px solid rgba(255,255,255,0.1);
        margin-top: 8px;
        padding-top: 16px;
        font-size: 18px;
        font-weight: 700;
        color: #f8fafc;
      }

      .chk-total-amount {
        color: #818cf8;
      }

      .chk-secure-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: #34d399;
        font-size: 12px;
        font-weight: 500;
        margin-top: 24px;
        padding: 10px;
        background: rgba(16, 185, 129, 0.1);
        border-radius: 10px;
        border: 1px dashed rgba(16, 185, 129, 0.3);
      }

      /* Payment Form */
      .chk-payment-header {
        margin-bottom: 20px;
      }

      .chk-payment-title {
        font-size: 22px;
        font-weight: 800;
        background: linear-gradient(to right, #818cf8, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 6px;
      }

      .chk-payment-subtitle {
        color: #94a3b8;
        font-size: 13px;
      }

      .chk-payment-methods {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
      }

      .chk-method-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        border-radius: 12px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: #94a3b8;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .chk-method-btn.active {
        background: rgba(99, 102, 241, 0.15);
        border-color: #818cf8;
        color: #818cf8;
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.1);
      }

      .chk-form-group {
        margin-bottom: 16px;
      }

      .chk-form-label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: #cbd5e1;
        margin-bottom: 6px;
      }

      .chk-form-control {
        width: 100%;
        padding: 12px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(71, 85, 105, 0.4);
        border-radius: 10px;
        color: #f8fafc;
        font-size: 14px;
        outline: none;
        transition: all 0.3s ease;
      }

      .chk-form-control:focus {
        border-color: #818cf8;
        background: rgba(15, 23, 42, 0.8);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
      }

      .chk-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .chk-btn-pay {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        border-radius: 12px;
        font-weight: 700;
        font-size: 15px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.6);
        margin-top: 24px;
      }

      .chk-btn-pay:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 25px -8px rgba(99, 102, 241, 0.8);
      }

      .chk-btn-pay:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .chk-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .chk-success-overlay {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 50;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .chk-success-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        margin-bottom: 20px;
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
        animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      @keyframes scaleUp {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="chk-wrapper">
                <div className="chk-container">
                    
                    {/* Left Side - Order Summary */}
                    <div>
                        <button onClick={() => navigate(-1)} className="chk-back-btn">
                            <ChevronLeft size={16} /> Back
                        </button>
                        
                        <div className="chk-glass-panel">
                            <h2 className="chk-summary-title">Order Summary</h2>
                            
                            <div className="chk-note-card">
                                <h3>{note.title}</h3>
                                <p>By {note.author}</p>
                            </div>

                            <div className="chk-price-row">
                                <span>Note Price</span>
                                <span>₹{note.price.toFixed(2)}</span>
                            </div>
                            <div className="chk-price-row">
                                <span>Platform Fee</span>
                                <span>₹{note.platformFee.toFixed(2)}</span>
                            </div>
                            
                            <div className="chk-price-row total">
                                <span>Total Payment</span>
                                <span className="chk-total-amount">₹{totalAmount.toFixed(2)}</span>
                            </div>

                            <div className="chk-secure-badge">
                                <ShieldCheck size={16} />
                                Safe & Secure Checkout
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Payment Gateway */}
                    <div className="chk-glass-panel" style={{ position: 'relative' }}>
                        {isSuccess && (
                            <div className="chk-success-overlay">
                                <div className="chk-success-icon">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }}>Payment Successful!</h2>
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Redirecting to your purchases...</p>
                            </div>
                        )}

                        <div className="chk-payment-header">
                            <h2 className="chk-payment-title">Payment Details</h2>
                            <p className="chk-payment-subtitle">Complete your purchase securely.</p>
                        </div>

                        <div className="chk-payment-methods">
                            <button 
                                className={`chk-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <CreditCard size={16} /> Card
                            </button>
                            <button 
                                className={`chk-method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> 
                                UPI
                            </button>
                        </div>

                        <form onSubmit={handlePayment}>
                            {paymentMethod === 'card' ? (
                                <>
                                    <div className="chk-form-group">
                                        <label className="chk-form-label">Cardholder Name</label>
                                        <input type="text" className="chk-form-control" placeholder="John Doe" required />
                                    </div>
                                    <div className="chk-form-group">
                                        <label className="chk-form-label">Card Number</label>
                                        <input type="text" className="chk-form-control" placeholder="0000 0000 0000 0000" maxLength={19} required />
                                    </div>
                                    <div className="chk-form-row">
                                        <div className="chk-form-group">
                                            <label className="chk-form-label">Expiry Date</label>
                                            <input type="text" className="chk-form-control" placeholder="MM/YY" maxLength={5} required />
                                        </div>
                                        <div className="chk-form-group">
                                            <label className="chk-form-label">CVV</label>
                                            <input type="password" className="chk-form-control" placeholder="•••" maxLength={3} required />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="chk-form-group">
                                    <label className="chk-form-label">UPI ID</label>
                                    <input type="text" className="chk-form-control" placeholder="username@upi" required />
                                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                                        A payment request will be sent to your UPI app.
                                    </p>
                                </div>
                            )}

                            <button type="submit" className="chk-btn-pay" disabled={isProcessing || isSuccess}>
                                {isProcessing ? (
                                    <>
                                        <div className="chk-spinner"></div> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={16} /> Pay ₹{totalAmount.toFixed(2)}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </>
    );
}
