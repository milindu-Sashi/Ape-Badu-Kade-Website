import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductFormModal } from './ProductFormModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Truck, 
  LogOut,
  Database,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    setViewMode, 
    formatLKR, 
    fetchProducts: refreshShopProducts,
    adminUser,
    logoutAdmin,
    setIsAdminLoginModalOpen 
  } = useShop();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Check auth protection
  useEffect(() => {
    if (!adminUser) {
      setViewMode('store');
      setIsAdminLoginModalOpen(true);
    }
  }, [adminUser]);

  // Load admin data from SQLite
  const loadData = async () => {
    setLoading(true);
    try {
      const [resStats, resOrders, resProducts] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/orders'),
        fetch('/api/products')
      ]);

      if (resStats.ok) setStats(await resStats.json());
      if (resOrders.ok) setOrders(await resOrders.json());
      if (resProducts.ok) setProducts(await resProducts.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadData();
    }
  }, [adminUser]);

  // Handle Product Delete
  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeletingProductId(null);
      loadData();
      refreshShopProducts();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Handle Product Saved / Updated
  const handleProductSaved = () => {
    loadData();
    refreshShopProducts();
  };

  // Handle Order status updated
  const handleOrderStatusUpdated = (updatedOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
    loadData();
  };

  if (!adminUser) return null;

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer?.phone.includes(orderSearch);

    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      
      {/* Top Admin Navigation Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-8 py-3.5 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('store')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                Ape <span className="text-orange-500">බඩු කඩේ</span>
              </span>
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Admin Panel
              </span>
              <span className="hidden md:flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Database className="w-3 h-3" />
                SQLite DB Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>{adminUser.name}</span>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Product</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>පිටවීම (Logout)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* KPI Metrics Cards (Grounded in SQLite) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">මුළු ආදායම (Total Revenue)</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {formatLKR(stats?.totalRevenue || 0)}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">මුළු ඇණවුම් (Total Orders)</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {stats?.totalOrders || 0}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">ක්‍රියාත්මක ඇණවුම් (Pending)</p>
              <h3 className="text-xl font-black text-amber-600 mt-0.5">
                {stats?.pendingOrders || 0}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">තොගයේ ඇති භාණ්ඩ (Products)</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {stats?.totalProducts || 0}
              </h3>
            </div>
          </div>

        </div>

        {/* Tab Switcher & Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>පාරිභෝගික ඇණවුම් (Orders List) ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>භාණ්ඩ සහ තොග කළමනාකරණය (Products & Inventory) ({products.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Filter bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="ඇණවුම් අංකය, නම හෝ දුරකථනය සොයන්න..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white outline-none focus:border-orange-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-500 font-semibold mr-1">Status:</span>
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">පාරිභෝගිකයා (Customer)</th>
                    <th className="p-3.5">දිනය & වේලාව</th>
                    <th className="p-3.5">ගෙවීම් ක්‍රමය</th>
                    <th className="p-3.5 text-right">මුළු මුදල</th>
                    <th className="p-3.5 text-center">තත්ත්වය (Status)</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400">
                        කිසිදු ඇණවුමක් සොයාගත නොහැක.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {order.id}
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-800">{order.customer?.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{order.customer?.phone} • {order.customer?.city}</p>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3.5 capitalize">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            order.paymentMethod === 'card'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-black text-slate-900">
                          {formatLKR(order.total)}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsOrderModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>බලන්න</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Action & Search header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="භාණ්ඩයේ නම හෝ කාණ්ඩය සොයන්න..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white outline-none focus:border-orange-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">භාණ්ඩය (Product)</th>
                    <th className="p-3.5">කාණ්ඩය (Category)</th>
                    <th className="p-3.5 text-right">මිල (Price)</th>
                    <th className="p-3.5 text-center">තොගය (Stock)</th>
                    <th className="p-3.5 text-center">Badge</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 font-mono">{product.id}</p>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">
                        {product.category}
                      </td>
                      <td className="p-3.5 text-right font-black text-slate-900">
                        {formatLKR(product.price)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          product.stock <= 0
                            ? 'bg-red-100 text-red-700'
                            : product.stock <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {product.badge ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors inline-block"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(product.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        onSave={handleProductSaved}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onStatusUpdate={handleOrderStatusUpdated}
        formatLKR={formatLKR}
      />

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">භාණ්ඩය ඉවත් කිරීමට අවශ්‍යද?</h3>
              <p className="text-xs text-slate-500 mt-1">මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                නැත (Cancel)
              </button>
              <button
                onClick={() => handleDeleteProduct(deletingProductId)}
                className="py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
              >
                ඔව්, ඉවත් කරන්න
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
