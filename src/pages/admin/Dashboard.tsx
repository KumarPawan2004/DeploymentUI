import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuth();

    const adminStats = [
        { label: "Total Users", value: "1,248", color: "blue" },
        { label: "Total Notes", value: "892", color: "purple" },
        { label: "Pending Review", value: "47", color: "orange" },
        { label: "Revenue This Month", value: "₹1,24,500", color: "green" },
    ];

    const quickActions = [
        { title: "Review Notes", desc: "Approve or reject pending notes", link: "/admin/review", color: "bg-orange-500" },
        { title: "Manage Users", desc: "View, block, unblock users", link: "/admin/users", color: "bg-blue-500" },
        { title: "Manage Categories", desc: "Add / Edit categories", link: "/admin/categories", color: "bg-purple-500" },
        { title: "View Reports", desc: "Sales & Notes Analytics", link: "/admin/reports", color: "bg-emerald-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Admin Header */}
                <div className="mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Welcome back, {user?.fullName} • Super Admin
                        </p>
                    </div>
                    <div className="text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow">
                        Today: {new Date().toLocaleDateString('en-IN')}
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {adminStats.map((stat, index) => (
                        <Card key={index} className="text-center">
                            <p className={`text-4xl font-bold text-${stat.color}-600`}>
                                {stat.value}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-7">
                        <Card title="Quick Actions">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quickActions.map((action, index) => (
                                    <Link to={action.link} key={index}>
                                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all group">
                                            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                                ⚡
                                            </div>
                                            <h4 className="font-semibold text-lg mb-1">{action.title}</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{action.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Recent Pending Reviews */}
                    <div className="lg:col-span-5">
                        <Card title="Pending Reviews">
                            <div className="space-y-4">
                                {[
                                    { title: "Computer Networks Full Notes", uploader: "Rahul Sharma", time: "2 hours ago" },
                                    { title: "Machine Learning Handwritten", uploader: "Priya Singh", time: "5 hours ago" },
                                    { title: "Java Spring Boot Complete", uploader: "Amit Kumar", time: "Yesterday" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-gray-500">By {item.uploader}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link to="/admin/review">
                                                <Button variant="success" className="px-4 py-1.5 text-sm">Review</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <Link to="/admin/review">
                                    <Button variant="outline" className="w-full">
                                        View All Pending Notes →
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Recent Activity */}
                <Card title="Recent Activity" className="mt-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-4">Note Title</th>
                                    <th className="text-left py-4">User</th>
                                    <th className="text-left py-4">Action</th>
                                    <th className="text-left py-4">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {[
                                    ["DSA Notes v2 Approved", "Aryan Kumar", "Approved", "Just now"],
                                    ["New User Registered", "Sneha Patel", "Registered", "10 min ago"],
                                    ["Payment Received", "Vikas Sharma", "₹299", "1 hour ago"],
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <td className="py-4 font-medium">{row[0]}</td>
                                        <td className="py-4 text-gray-600 dark:text-gray-400">{row[1]}</td>
                                        <td className="py-4">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                                                {row[2]}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-gray-500">{row[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}