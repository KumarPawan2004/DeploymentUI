import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import Button from '../common/Button';

const adminNav = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/review', label: 'Review Notes', icon: '✅' },
    { path: '/admin/notes', label: 'Manage Notes', icon: '📝' },
    { path: '/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/admin/categories', label: 'Categories', icon: '📂' },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            {/* Sidebar */}
            <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-3xl font-bold text-red-600">Admin Panel</h1>
                    <p className="text-sm text-gray-500 mt-1">NotesHub Control</p>
                </div>

                <div className="p-4 flex-1">
                    <nav className="space-y-1">
                        {adminNav.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path
                                    ? 'bg-red-600 text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                    <Button
                        variant="danger"
                        onClick={logout}
                        className="w-full"
                    >
                        Logout Admin
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}