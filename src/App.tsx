import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleSelection from './pages/auth/RoleSelection';
import OAuthCallback from './pages/auth/OAuthCallback';

import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

import UserDashboard from './pages/user/Dashboard';
import BrowseNotes from './pages/user/BrowseNotes';
import NoteDetail from './pages/user/NoteDetail';
import SecurePDFViewer from './pages/user/SecurePDFViewer';
import UploadNote from './pages/user/UploadNote';
import MyPurchases from './pages/user/MyPurchases';
import MyUploads from './pages/user/MyUploads';
import Wishlist from './pages/user/Wishlist';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import Checkout from './pages/user/Checkout';

import AdminDashboard from './pages/admin/Dashboard';
import ReviewNotes from './pages/admin/ReviewNotes';
import ManageUsers from './pages/admin/ManageUsers';
import ManageNotes from './pages/admin/ManageNotes';
import ManageCategories from './pages/admin/ManageCategories';

import ProtectedRoute from './components/ProtectedRoute';
import GlobalProtection from './components/GlobalProtection';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <GlobalProtection />
          <Toaster position="top-right" />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route
            path="/role-selection"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <RoleSelection />
              </ProtectedRoute>
            }
          />

          {/* USER ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['User', 'Admin']}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="browse" element={<BrowseNotes />} />
            <Route path="browse/note/:id" element={<NoteDetail />} />
            <Route path="browse/note/:id/view" element={<SecurePDFViewer />} />
            <Route path="upload" element={<UploadNote />} />
            <Route path="my-uploads" element={<MyUploads />} />
            <Route path="my-purchases" element={<MyPurchases />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="checkout/:id" element={<Checkout />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="review" element={<ReviewNotes />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="notes" element={<ManageNotes />} />
            <Route path="categories" element={<ManageCategories />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;