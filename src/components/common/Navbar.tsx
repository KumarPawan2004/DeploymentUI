import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {user && (
                        <>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Hello, <strong>{user.fullName}</strong>
                            </span>
                            <Button
                                variant="danger"
                                onClick={logout}
                                className="px-4 py-2 text-sm"
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}