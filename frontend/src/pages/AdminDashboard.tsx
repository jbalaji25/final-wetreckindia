import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, LayoutDashboard, Map, Trash2, Mountain, Bike, Image as ImageIcon } from 'lucide-react';
import AddPackageForm from '../components/AddPackageForm';
import AddTrekkingForm from '../components/AddTrekkingForm';
import AddBikeRideForm from '../components/AddBikeRideForm';
import AddGalleryForm from '../components/AddGalleryForm';
import { API_URL } from '../config';

interface PackageData {
    _id: string;
    title: string;
    location?: string;
    price?: string;
    rating?: number;
    image?: string;
    description?: string;
    icon?: string; // For services (legacy)
}

const AdminDashboard = () => {
    const [adminEmail, setAdminEmail] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [items, setItems] = useState<PackageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('adminToken');
        const email = localStorage.getItem('adminEmail');

        if (!token || !email) {
            // Not authenticated, redirect to login
            navigate('/admin-login');
            return;
        }

        setAdminEmail(email);
    }, [navigate]);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setItems([]); // Clear existing items to prevent data leakage
        let endpoint = '';
        switch (activeTab) {
            case 'view-packages': endpoint = `${API_URL}/api/packages`; break;
            case 'view-trekking': endpoint = `${API_URL}/api/trekking`; break;
            case 'view-bikerides': endpoint = `${API_URL}/api/bikerides`; break;
            case 'view-gallery': endpoint = `${API_URL}/api/gallery`; break;
            default:
                setIsLoading(false);
                return;
        }

        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            if (data.success) {
                // Normalize data structure based on endpoint response key
                if (data.packages) setItems(data.packages);
                else if (data.treks) setItems(data.treks);
                else if (data.rides) setItems(data.rides);
                else if (data.items) setItems(data.items); // Gallery items
            } else {
                setItems([]); // Ensure empty if success is false
            }
        } catch (error) {
            console.error('Failed to fetch items:', error);
            setItems([]); // Ensure empty on error
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab.startsWith('view-')) {
            fetchItems();
        }
    }, [activeTab, fetchItems]);

    const handleDeleteItem = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return;
        }

        let endpoint = '';
        switch (activeTab) {
            case 'view-packages': endpoint = `${API_URL}/api/packages/${id}`; break;
            case 'view-trekking': endpoint = `${API_URL}/api/trekking/${id}`; break;
            case 'view-bikerides': endpoint = `${API_URL}/api/bikerides/${id}`; break;
            case 'view-gallery': endpoint = `${API_URL}/api/gallery/${id}`; break;
            default: return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
            });

            if (response.ok) {
                setItems(prev => prev.filter(item => item._id !== id));
                alert('Item deleted successfully');
            } else {
                alert('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate('/');
    };

    const [editItem, setEditItem] = useState<PackageData | null>(null);

    const handleEditItem = (item: PackageData) => {
        setEditItem(item);
        // Switch to the corresponding add tab
        switch (activeTab) {
            case 'view-packages': setActiveTab('add-package'); break;
            case 'view-trekking': setActiveTab('add-trekking'); break;
            case 'view-bikerides': setActiveTab('add-bikeride'); break;
            case 'view-gallery': setActiveTab('add-gallery'); break;
        }
    };



    // Improved tab switching to clear edit state when explicitly clicking sidebar items
    const onSidebarClick = (tab: string) => {
        setEditItem(null);
        setActiveTab(tab);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Admin Dashboard</h2>
                        <p className="text-gray-600 mb-8">Select an option from the sidebar to get started.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            <button onClick={() => onSidebarClick('add-package')} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600"><Map className="w-6 h-6" /></div>
                                <h3 className="font-semibold text-lg">Add Tour</h3>
                            </button>
                            <button onClick={() => onSidebarClick('add-trekking')} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Mountain className="w-6 h-6" /></div>
                                <h3 className="font-semibold text-lg">Add Trek</h3>
                            </button>
                            <button onClick={() => onSidebarClick('add-bikeride')} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Bike className="w-6 h-6" /></div>
                                <h3 className="font-semibold text-lg">Add Bike Ride</h3>
                            </button>
                            <button onClick={() => onSidebarClick('add-gallery')} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><ImageIcon className="w-6 h-6" /></div>
                                <h3 className="font-semibold text-lg">Add to Gallery</h3>
                            </button>
                        </div>
                    </div>
                );
            case 'add-package': return <AddPackageForm initialData={editItem} isEditing={!!editItem} />;
            case 'add-trekking': return <AddTrekkingForm initialData={editItem} isEditing={!!editItem} />;
            case 'add-bikeride': return <AddBikeRideForm initialData={editItem} isEditing={!!editItem} />;
            case 'add-gallery': return <AddGalleryForm initialData={editItem} isEditing={!!editItem} />;
            case 'view-packages':
            case 'view-trekking':
            case 'view-bikerides':
            case 'view-gallery': {
                const getTitle = () => {
                    if (activeTab === 'view-packages') return 'Manage Tours';
                    if (activeTab === 'view-gallery') return 'Manage Gallery';
                    return 'Manage ' + activeTab.replace('view-', '').charAt(0).toUpperCase() + activeTab.replace('view-', '').slice(1);
                };

                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {getTitle()}
                        </h2>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading items...</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900">No Items Found</h3>
                                <p className="text-gray-500 mt-2">Start by adding a new item.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item) => (
                                    <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                                        {item.image && (
                                            <div className="relative h-48">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                    }}
                                                />
                                                {item.rating && (
                                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-medium shadow-sm">
                                                        ⭐ {item.rating}
                                                    </div>
                                                )}

                                            </div>
                                        )}
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">{item.title || 'Untitled'}</h3>
                                            </div>
                                            {item.location && <p className="text-sm text-gray-500 mb-3">{item.location}</p>}
                                            {item.description && <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>}

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className="font-bold text-orange-600">{item.price || ''}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditItem(item)}
                                                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Item"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:block overflow-y-auto">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                    <p className="text-xs text-gray-500 mt-1">{adminEmail}</p>
                </div>
                <nav className="p-4 space-y-1">
                    <button onClick={() => onSidebarClick('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </button>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">Tours</div>
                    <button onClick={() => onSidebarClick('add-package')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'add-package' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Plus className="w-4 h-4" /> Add Tour
                    </button>
                    <button onClick={() => onSidebarClick('view-packages')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'view-packages' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Map className="w-4 h-4" /> View Tours
                    </button>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">Trekking</div>
                    <button onClick={() => onSidebarClick('add-trekking')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'add-trekking' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Plus className="w-4 h-4" /> Add Trek
                    </button>
                    <button onClick={() => onSidebarClick('view-trekking')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'view-trekking' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Mountain className="w-4 h-4" /> View Treks
                    </button>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">Bike Rides</div>
                    <button onClick={() => onSidebarClick('add-bikeride')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'add-bikeride' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Plus className="w-4 h-4" /> Add Ride
                    </button>
                    <button onClick={() => onSidebarClick('view-bikerides')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'view-bikerides' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Bike className="w-4 h-4" /> View Rides
                    </button>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">Gallery</div>
                    <button onClick={() => onSidebarClick('add-gallery')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'add-gallery' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Plus className="w-4 h-4" /> Add to Gallery
                    </button>
                    <button onClick={() => onSidebarClick('view-gallery')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'view-gallery' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <ImageIcon className="w-4 h-4" /> View Gallery
                    </button>
                </nav>
                <div className="p-4 border-t mt-auto">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white shadow-sm md:hidden p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
