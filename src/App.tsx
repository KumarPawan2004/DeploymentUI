import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

import UserDashboard from './pages/user/Dashboard';
import BrowseNotes from './pages/user/BrowseNotes';
import NoteDetail from './pages/user/NoteDetail';
import UploadNote from './pages/user/UploadNote';
import MyPurchases from './pages/user/MyPurchases';

import AdminDashboard from './pages/admin/Dashboard';
import ReviewNotes from './pages/admin/ReviewNotes';
import ManageUsers from './pages/admin/ManageUsers';
import ManageNotes from './pages/admin/ManageNotes';
import ManageCategories from './pages/admin/ManageCategories';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['User']}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="browse" element={<BrowseNotes />} />
            <Route path="note/:id" element={<NoteDetail />} />
            <Route path="upload" element={<UploadNote />} />
            <Route path="my-purchases" element={<MyPurchases />} />
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
  );
}

export default App;