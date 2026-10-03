import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // View state: 'store' | 'admin'
  const [viewMode, setViewMode] = useState('store');

  // Admin Auth State (Persisted in localStorage)
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ape_badu_kade_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ape_badu_kade_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Fetch products from SQLite backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.warn('API error, using cached products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ape_badu_kade_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Admin Login
  const loginAdmin = async (username, password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      setAdminUser(data.admin);
      localStorage.setItem('ape_badu_kade_admin', JSON.stringify(data.admin));
      setIsAdminLoginModalOpen(false);
      setViewMode('admin');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Admin Logout
  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('ape_badu_kade_admin');
    setViewMode('store');
  };

  // Trigger Admin Portal
  const openAdminPortal = () => {
    if (adminUser) {
      setViewMode('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock || 99);
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          stock: product.stock,
          category: product.category,
          quantity: Math.min(quantity, product.stock || 99)
        }];
      }
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          const maxStock = item.stock || 99;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Coupon handling: APE10 gives 10% discount, SINHALA20 gives 20% discount
  const applyCoupon = (code) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setCouponError('කරුණාකර කූපන් කේතය ඇතුළත් කරන්න');
      return false;
    }
    if (trimmed === 'APE10') {
      setAppliedCoupon({ code: 'APE10', discountPercent: 10, label: '10% Discount (Ape Special)' });
      setCouponError('');
      return true;
    } else if (trimmed === 'SINHALA20' || trimmed === 'SUBHA20') {
      setAppliedCoupon({ code: trimmed, discountPercent: 20, label: '20% Special Festival Discount' });
      setCouponError('');
      return true;
    } else {
      setCouponError('වලංගු නොවන කූපන් කේතයකි (Invalid Coupon Code)');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Selected city for delivery fee calculation
  const [selectedCity, setSelectedCity] = useState('Colombo');

  // City-based delivery fees (LKR)
  const CITY_DELIVERY_FEES = {
    'Colombo': 199,
    'Gampaha': 250,
    'Kalutara': 300,
    'Kandy': 350,
    'Galle': 350,
    'Kurunegala': 400,
    'Matara': 400,
    'Anuradhapura': 500,
    'Jaffna': 600,
    'Batticaloa': 600,
    'Badulla': 450,
    'Ratnapura': 400,
    'Trincomalee': 550,
    'Other': 450
  };

  // Computations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Subtotal Tiered Discount calculation (protects business margins while rewarding buyers)
  const getAutoDiscount = (subtotal) => {
    if (subtotal >= 20000) return { percent: 12, label: 'VIP Special (12% Off)' };
    if (subtotal >= 10000) return { percent: 8, label: 'Mega Order (8% Off)' };
    if (subtotal >= 5000)  return { percent: 5, label: 'Super Savings (5% Off)' };
    if (subtotal >= 2500)  return { percent: 3, label: 'Tier Discount (3% Off)' };
    if (subtotal >= 1000)  return { percent: 2, label: 'Starter Discount (2% Off)' };
    return { percent: 0, label: '' };
  };

  const autoDiscount = getAutoDiscount(cartSubtotal);
  const autoDiscountAmount = Math.round((cartSubtotal * autoDiscount.percent) / 100);

  // Optional manual coupon discount
  const manualCouponDiscountAmount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const totalDiscountAmount = autoDiscountAmount + manualCouponDiscountAmount;

  // Free delivery for orders >= 15,000 LKR, else city-based rate
  const cityRate = CITY_DELIVERY_FEES[selectedCity] || 450;
  const deliveryFee = (cartSubtotal >= 15000 || cartSubtotal === 0) ? 0 : cityRate;

  const cartTotal = Math.max(0, cartSubtotal - totalDiscountAmount + (cart.length > 0 ? deliveryFee : 0));

  // Currency Formatter
  const formatLKR = (amount) => {
    if (amount === undefined || amount === null) return 'රු. 0';
    return `රු. ${Number(amount).toLocaleString('en-LK')}`;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        adminUser,
        loginAdmin,
        logoutAdmin,
        openAdminPortal,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        discountAmount: totalDiscountAmount,
        autoDiscount,
        autoDiscountAmount,
        totalDiscountAmount,
        selectedCity,
        setSelectedCity,
        CITY_DELIVERY_FEES,
        deliveryFee,
        cartTotal,
        appliedCoupon,
        couponCode,
        setCouponCode,
        couponError,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        isTrackModalOpen,
        setIsTrackModalOpen,
        activeProductModal,
        setActiveProductModal,
        lastOrder,
        setLastOrder,
        formatLKR
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
