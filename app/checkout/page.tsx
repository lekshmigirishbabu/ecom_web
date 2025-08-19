'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { auth, db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, Banknote, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  // Add tax and shipping settings state
  const [taxSettings, setTaxSettings] = useState({ rate: 0, enabled: false });
  const [shippingSettings, setShippingSettings] = useState({
    freeThreshold: 0,
    standardRate: 0,
    expressRate: 0
  });

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/shop');
    }
  }, [cartItems, router]);

  // Fetch admin settings
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data) {
          setTaxSettings(data.tax || { rate: 0, enabled: false });
          setShippingSettings(data.shipping || { 
            freeThreshold: 0, 
            standardRate: 0, 
            expressRate: 0 
          });
        }
      })
      .catch(console.error);
  }, []);

  // Calculate totals with tax and dynamic shipping
  const subtotal = getCartTotal();
  const taxAmount = taxSettings.enabled ? (subtotal * taxSettings.rate / 100) : 0;
  
  const calculateShippingCost = () => {
    if (subtotal >= shippingSettings.freeThreshold) return 0;
    return shippingMethod === 'express' ? shippingSettings.expressRate : shippingSettings.standardRate;
  };
  
  const shippingCost = calculateShippingCost();
  const finalTotal = subtotal + taxAmount + shippingCost;

  const handlePlaceOrder = async () => {
    if (!user || !paymentMethod || !shippingInfo.fullName || !shippingInfo.address) {
      alert('Please fill all required fields and select payment method');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: user.uid,
        customerEmail: user.email,
        items: cartItems,
        subtotal: subtotal,
        taxAmount: taxAmount,
        shippingCost: shippingCost,
        shippingMethod: shippingMethod,
        total: finalTotal,
        shippingInfo,
        paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'processing',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      router.push(`/orders/success?id=${docRef.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cartItems.length === 0) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Shipping & Payment */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  className="input-field"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  className="input-field"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Address *"
                  className="input-field md:col-span-2"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="City *"
                  className="input-field"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="State *"
                  className="input-field"
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode *"
                  className="input-field"
                  value={shippingInfo.pincode}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, pincode: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Shipping Options - NEW SECTION */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
              <div className="space-y-3">
                {/* Free Shipping (only if eligible) */}
                {subtotal >= shippingSettings.freeThreshold && (
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="free"
                        checked={shippingMethod === 'free'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <Truck className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-green-600">Free Shipping</div>
                        <div className="text-sm text-gray-600">5-7 business days</div>
                      </div>
                    </div>
                    <div className="font-semibold text-green-600">₹0</div>
                  </label>
                )}

                {/* Standard Shipping */}
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Truck className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">Standard Shipping</div>
                      <div className="text-sm text-gray-600">5-7 business days</div>
                    </div>
                  </div>
                  <div className="font-semibold">₹{shippingSettings.standardRate}</div>
                </label>

                {/* Express Shipping */}
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Truck className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium">Express Shipping</div>
                      <div className="text-sm text-gray-600">2-3 business days</div>
                    </div>
                  </div>
                  <div className="font-semibold">₹{shippingSettings.expressRate}</div>
                </label>
              </div>

              {/* Free Shipping Reminder */}
              {subtotal < shippingSettings.freeThreshold && shippingSettings.freeThreshold > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 Add ₹{(shippingSettings.freeThreshold - subtotal).toFixed(2)} more to get <strong>FREE shipping!</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Banknote className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive your order</div>
                  </div>
                </label>

                {/* UPI */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Smartphone className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium">UPI Payment</div>
                    <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm & more</div>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, Rupay</div>
                  </div>
                </label>

                {/* Net Banking */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <div className="font-medium">Net Banking</div>
                    <div className="text-sm text-gray-600">All major banks supported</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="card h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Price Breakdown - UPDATED */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {taxSettings.enabled && (
                <div className="flex justify-between">
                  <span>Tax ({taxSettings.rate}%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>

            <div className="text-xs text-gray-500 mt-2 text-center">
              By placing your order, you agree to our Terms & Conditions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
