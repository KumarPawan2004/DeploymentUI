import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'User' | 'Admin';
    isBlocked: boolean;
    joinedAt: string;
    totalUploads: number;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([
        {
            id: "1",
            fullName: "Rahul Sharma",
            email: "rahul@example.com",
            role: "User",
            isBlocked: false,
            joinedAt: "12 Jan 2026",
            totalUploads: 7
        },
        {
            id: "2",
            fullName: "Priya Singh",
            email: "priya@example.com",
            role: "User",
            isBlocked: false,
            joinedAt: "08 Jan 2026",
            totalUploads: 12
        },
        {
            id: "3",
            fullName: "Amit Kumar",
            email: "amit@example.com",
            role: "User",
            isBlocked: true,
            joinedAt: "05 Jan 2026",
            totalUploads: 3
        },
        {
            id: "4",
            fullName: "Admin User",
            email: "admin@noteshub.com",
            role: "Admin",
            isBlocked: false,
            joinedAt: "01 Jan 2026",
            totalUploads: 0
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'All' | 'User' | 'Admin'>('All');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const toggleBlock = (id: string) => {
        setUsers(prev => prev.map(user => {
            if (user.id === id) {
                const newStatus = !user.isBlocked;
                alert(`${user.fullName} has been ${newStatus ? 'Blocked' : 'Unblocked'}`);
                return { ...user, isBlocked: newStatus };
            }
            return user;
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
                        <p className="text-gray-600 dark:text-gray-400">Total Users: {users.length}</p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as 'All' | 'User' | 'Admin')}
                        >
                            <option value="All">All Roles</option>
                            <option value="User">Users</option>
                            <option value="Admin">Admins</option>
                        </select>
                    </div>
                </Card>

                {/* Users Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-4 px-4 font-medium">User</th>
                                    <th className="text-left py-4 px-4 font-medium">Email</th>
                                    <th className="text-left py-4 px-4 font-medium">Role</th>
                                    <th className="text-left py-4 px-4 font-medium">Uploads</th>
                                    <th className="text-left py-4 px-4 font-medium">Joined</th>
                                    <th className="text-left py-4 px-4 font-medium">Status</th>
                                    <th className="text-center py-4 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                        <td className="py-5 px-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                                        </td>
                                        <td className="py-5 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                        <td className="py-5 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'Admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4">{user.totalUploads}</td>
                                        <td className="py-5 px-4 text-sm text-gray-500">{user.joinedAt}</td>
                                        <td className="py-5 px-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.isBlocked
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                }`}>
                                                {user.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-center">
                                            <div className="flex gap-3 justify-center">
                                                <Button
                                                    variant={user.isBlocked ? "success" : "danger"}
                                                    onClick={() => toggleBlock(user.id)}
                                                    className="px-5 py-2 text-sm"
                                                >
                                                    {user.isBlocked ? "Unblock" : "Block"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="px-5 py-2 text-sm"
                                                    onClick={() => alert(`Viewing details of ${user.fullName}`)}
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <p className="text-center py-12 text-gray-500">No users found</p>
                    )}
                </Card>
            </div>
        </div>
    );
}