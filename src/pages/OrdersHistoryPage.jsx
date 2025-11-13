import React, { useState, useEffect } from 'react';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    ChefHat,
    MapPin,
    Phone,
    Calendar,
    DollarSign,
    AlertCircle,
    RefreshCw,
    Filter,
    Search,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const OrdersHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(4);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter, searchTerm]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (!token) {
                navigate('/signup');
                return;
            }

            const params = {
                page,
                limit,
                customer: user._id || user.id,
            };

            if (statusFilter !== 'all') {
                params.orderStatus = statusFilter;
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/customer/get-orders/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params,
                }
            );

            setOrders(res.data.data || res.data || []);
            setTotalPages(res.data.pagination.pages || 1);
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response?.status === 401) {
                navigate('/signup');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }

        try {
            setCancelling(true);
            const token = localStorage.getItem('token');

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/customer/cancell-order/${selectedOrder._id}`,

                { cancelReason: cancelReason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the order in the list
            setOrders(
                orders.map((order) =>
                    order._id === selectedOrder._id
                        ? { ...order, orderStatus: 'cancelled', cancelReason }
                        : order
                )
            );

            setShowCancelModal(false);
            setSelectedOrder(null);
            setCancelReason('');
            alert('Order cancelled successfully');
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert(
                error.response?.data?.message || 'Failed to cancel order. Please try again.'
            );
        } finally {
            setCancelling(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                icon: Clock,
                label: 'Pending',
            },
            confirmed: {
                color: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: CheckCircle,
                label: 'Confirmed',
            },
            preparing: {
                color: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: ChefHat,
                label: 'Preparing',
            },
            ready: {
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                icon: Package,
                label: 'Ready',
            },
            out_for_delivery: {
                color: 'bg-orange-50 text-orange-700 border-orange-200',
                icon: Truck,
                label: 'Out for Delivery',
            },
            delivered: {
                color: 'bg-green-50 text-green-700 border-green-200',
                icon: CheckCircle,
                label: 'Delivered',
            },
            completed: {
                color: 'bg-green-50 text-green-700 border-green-200',
                icon: CheckCircle,
                label: 'Completed',
            },
            cancelled: {
                color: 'bg-red-50 text-red-700 border-red-200',
                icon: XCircle,
                label: 'Cancelled',
            },
            rejected: {
                color: 'bg-gray-50 text-gray-700 border-gray-200',
                icon: XCircle,
                label: 'Rejected',
            },
        };
        return configs[status] || configs.pending;
    };

    const canCancelOrder = (order) => {
        const cancellableStatuses = ['pending', 'confirmed'];
        return cancellableStatuses.includes(order.orderStatus);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount) => {
        return `₹${amount?.toFixed(2) || '0.00'}`;
    };

    const statusOptions = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100  pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <section
                    className="relative max-w-7xl mx-auto text-white py-32 overflow-hidden min-h-[400px] rounded-lg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            Order History
                        </h1>
                        <p className="text-gray-300">View Your Order History</p>
                    </div>

                </section>


                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by order number..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No orders found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            You haven't placed any orders yet
                        </p>
                        <button
                            onClick={() => navigate('/menus')}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Orders List */}
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const statusConfig = getStatusConfig(order.orderStatus);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {/* Order Header */}
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Package className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {order.orderNumber}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(order.orderPlacedAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${statusConfig.color}`}
                                                    >
                                                        <StatusIcon className="h-4 w-4" />
                                                        {statusConfig.label}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${order.orderType === 'delivery'
                                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                                : order.orderType === 'dine_in'
                                                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            }`}
                                                    >
                                                        {order.orderType.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Body */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                                {/* Items */}
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium mb-2">
                                                        Order Items
                                                    </p>
                                                    <div className="space-y-1">
                                                        {order.items?.map((item, index) => (
                                                            <p key={index} className="text-sm text-gray-700">
                                                                {item.quantity}x {item.menu?.name || 'Item'}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Delivery/Table Info */}
                                                {order.deliveryAddress && (
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            Delivery Address
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            {order.deliveryAddress}
                                                        </p>
                                                    </div>
                                                )}

                                                {order.tableNumber && (
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium mb-2">
                                                            Table Number
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-900">
                                                            {order.tableNumber}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Contact */}
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-1">
                                                        <Phone className="h-4 w-4" />
                                                        Contact
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        {order.customerPhone}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Price Summary */}
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-green-600 font-medium mb-1">
                                                            Subtotal
                                                        </p>
                                                        <p className="text-green-900 font-bold">
                                                            {formatCurrency(order.pricing?.subtotal)}
                                                        </p>
                                                    </div>
                                                    {order.pricing?.deliveryFee > 0 && (
                                                        <div>
                                                            <p className="text-green-600 font-medium mb-1">
                                                                Delivery Fee
                                                            </p>
                                                            <p className="text-green-900 font-bold">
                                                                {formatCurrency(order.pricing.deliveryFee)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {order.pricing?.tax > 0 && (
                                                        <div>
                                                            <p className="text-green-600 font-medium mb-1">
                                                                Tax
                                                            </p>
                                                            <p className="text-green-900 font-bold">
                                                                {formatCurrency(order.pricing.tax)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-green-600 font-medium mb-1 flex items-center gap-1">
                                                            <DollarSign className="h-4 w-4" />
                                                            Total Amount
                                                        </p>
                                                        <p className="text-2xl text-green-900 font-bold">
                                                            {formatCurrency(order.pricing?.total)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Info */}
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-500">Payment:</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {order.payment?.method?.toUpperCase()}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${order.payment?.status === 'paid'
                                                                ? 'bg-green-100 text-green-700'
                                                                : order.payment?.status === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {order.payment?.status?.toUpperCase()}
                                                    </span>
                                                </div>

                                                {/* Cancel Button */}
                                                {canCancelOrder(order) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowCancelModal(true);
                                                        }}
                                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold border border-red-200 flex items-center gap-2"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>

                                            {/* Cancel/Reject Reason */}
                                            {(order.cancelReason || order.rejectReason) && (
                                                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-red-800">
                                                            {order.orderStatus === 'cancelled'
                                                                ? 'Cancellation Reason:'
                                                                : 'Rejection Reason:'}
                                                        </p>
                                                        <p className="text-sm text-red-700">
                                                            {order.cancelReason || order.rejectReason}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${page === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
                                        }`}
                                >
                                    Previous
                                </button>
                                <span className="text-gray-700 font-medium">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${page === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Cancel Order
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {selectedOrder.orderNumber}
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">
                            Are you sure you want to cancel this order? This action cannot be
                            undone.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cancellation Reason *
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Please provide a reason for cancellation..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                rows="4"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedOrder(null);
                                    setCancelReason('');
                                }}
                                disabled={cancelling}
                                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors disabled:opacity-50"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {cancelling ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-5 w-5" />
                                        Cancel Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersHistoryPage;