import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './common/Loader';

interface ProtectedRouteProps {
    allowedRoles?: ('User' | 'Admin')[];
    children?: React.ReactNode;
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
    const { user, token, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="large" />
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based access
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as 'User' | 'Admin')) {
        const redirectPath = user.role === 'Admin' ? '/admin/dashboard' : '/';
        return <Navigate to={redirectPath} replace />;
    }
    // Render children if passed, otherwise Outlet for nested routes
    return children ? <>{children}</> : <Outlet />;
}