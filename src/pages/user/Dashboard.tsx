import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UserDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalNotes: 124,
        myPurchases: 8,
        uploadedNotes: 3,
        pendingReviews: 2
    });

    // Mock recent notes (replace with API call later)
    const recentNotes = [
        { id: 1, title: "Data Structures Complete Notes", subject: "DSA", price: 0, status: "Approved" },
        { id: 2, title: "Operating System Handwritten Notes", subject: "OS", price: 149, status: "Approved" },
        { id: 3, title: "DBMS Revision Notes", subject: "DBMS", price: 99, status: "Pending" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">


            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.fullName?.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        What would you like to do today?
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <Card className="text-center">
                        <p className="text-4xl font-bold text-blue-600">{stats.totalNotes}</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Total Notes</p>
                    </Card>

                    <Card className="text-center">
                        <p className="text-4xl font-bold text-green-600">{stats.myPurchases}</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">My Purchases</p>
                    </Card>

                    <Card className="text-center">
                        <p className="text-4xl font-bold text-purple-600">{stats.uploadedNotes}</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">My Uploads</p>
                    </Card>

                    <Card className="text-center">
                        <p className="text-4xl font-bold text-orange-600">{stats.pendingReviews}</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Pending Review</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-4">
                        <Card title="Quick Actions">
                            <div className="space-y-4">
                                <Link to="/browse">
                                    <Button variant="primary" className="w-full justify-start text-left">
                                        🔍 Browse All Notes
                                    </Button>
                                </Link>

                                <Link to="/upload">
                                    <Button variant="secondary" className="w-full justify-start text-left">
                                        📤 Upload New Notes
                                    </Button>
                                </Link>

                                <Link to="/my-purchases">
                                    <Button className="w-full justify-start text-left">
                                        📚 My Purchased Notes
                                    </Button>
                                </Link>

                                <Link to="/my-uploads">
                                    <Button className="w-full justify-start text-left">
                                        📝 Track My Uploads
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-8">
                        <Card title="Recent Notes">
                            <div className="space-y-4">
                                {recentNotes.map((note) => (
                                    <div key={note.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{note.title}</h4>
                                            <p className="text-sm text-gray-500">{note.subject} • {note.price === 0 ? "Free" : `₹${note.price}`}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${note.status === 'Approved'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                            }`}>
                                            {note.status}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 text-center">
                                <Link to="/browse">
                                    <Button >Browse All Notes →</Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Free vs Paid Section Teaser */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        <h3 className="text-2xl font-bold mb-3">Free Notes</h3>
                        <p className="opacity-90 mb-6">High quality free study materials</p>
                        <Link to="/browse?type=free">
                            <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-gray-100">
                                Explore Free Notes
                            </Button>
                        </Link>
                    </Card>

                    <Card className="bg-gradient-to-br from-violet-600 to-purple-700 text-white">
                        <h3 className="text-2xl font-bold mb-3">Premium Notes</h3>
                        <p className="opacity-90 mb-6">Expert curated paid notes</p>
                        <Link to="/browse?type=paid">
                            <Button variant="secondary" className="bg-white text-violet-700 hover:bg-gray-100">
                                Browse Premium Notes
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}