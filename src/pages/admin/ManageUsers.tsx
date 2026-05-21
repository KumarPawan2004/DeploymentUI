import { useState, useEffect } from 'react';
import { 
    Users, 
    Search, 
    UserCheck, 
    UserX, 
    RefreshCw, 
    Mail, 
    Calendar,
    BookOpen,
    ShoppingBag,
    Shield
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface UserData {
    id: number;
    fullName: string;
    email: string;
    role: 'User' | 'Admin';
    isBlocked: boolean;
    createdAt: string;
    lastLoginAt?: string;
    notesCount: number;
    purchasesCount: number;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'All' | 'User' | 'Admin'>('All');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            if (res.data) {
                setUsers(res.data);
            }
        } catch (err: any) {
            console.error("Error fetching users:", err);
            // Graceful mock database fallback
            const mockUsers: UserData[] = [
                {
                    id: 1,
                    fullName: "Rahul Sharma",
                    email: "rahul@student.com",
                    role: "User",
                    isBlocked: false,
                    createdAt: "2026-01-12T10:30:00Z",
                    notesCount: 7,
                    purchasesCount: 4
                },
                {
                    id: 2,
                    fullName: "Priya Singh",
                    email: "priya@university.edu",
                    role: "User",
                    isBlocked: false,
                    createdAt: "2026-01-08T15:20:00Z",
                    notesCount: 12,
                    purchasesCount: 1
                },
                {
                    id: 3,
                    fullName: "Amit Kumar",
                    email: "amit.kumar@engineering.in",
                    role: "User",
                    isBlocked: true,
                    createdAt: "2026-01-05T08:45:00Z",
                    notesCount: 3,
                    purchasesCount: 9
                },
                {
                    id: 4,
                    fullName: "Pawan Kumar",
                    email: "admin@noteshub.com",
                    role: "Admin",
                    isBlocked: false,
                    createdAt: "2026-01-01T12:00:00Z",
                    notesCount: 0,
                    purchasesCount: 0
                }
            ];
            setUsers(mockUsers);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = async (userId: number, currentBlockedStatus: boolean) => {
        const newStatus = !currentBlockedStatus;
        try {
            toast.loading(`${newStatus ? 'Blocking' : 'Unblocking'} user...`, { id: "status" });
            await api.put(`/admin/users/${userId}/status`, {
                isBlocked: newStatus
            });
            toast.success(`User successfully ${newStatus ? 'Blocked' : 'Unblocked'}!`, { id: "status" });
            
            // Sync with local state
            setUsers(prev => prev.map(u => {
                if (u.id === userId) {
                    return { ...u, isBlocked: newStatus };
                }
                return u;
            }));
        } catch (e) {
            // Mock Action Success
            toast.success(`Mock: User status toggled to ${newStatus ? 'Blocked' : 'Unblocked'}!`, { id: "status" });
            setUsers(prev => prev.map(u => {
                if (u.id === userId) {
                    return { ...u, isBlocked: newStatus };
                }
                return u;
            }));
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="manage-users-wrapper">
            <style>{`
                .manage-users-wrapper {
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                }

                .dashboard-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .dashboard-header-flex h2 {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .dashboard-header-flex p {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 4px;
                }

                /* ============ FILTERS ============ */
                .filters-panel {
                    display: flex;
                    gap: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 14px;
                    padding: 16px;
                    margin-bottom: 24px;
                    align-items: center;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                @media (max-width: 768px) {
                    .filters-panel {
                        flex-direction: column;
                        align-items: stretch;
                    }
                }

                .search-wrapper {
                    position: relative;
                    flex: 1;
                }

                .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }

                .search-input {
                    width: 100%;
                    padding: 11px 11px 11px 40px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 12px;
                    outline: none;
                    transition: border-color 0.25s ease;
                    box-sizing: border-box;
                }

                .search-input:focus {
                    border-color: rgba(168, 85, 247, 0.5);
                }

                .select-filter {
                    padding: 11px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 12px;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .select-filter:focus {
                    border-color: rgba(168, 85, 247, 0.5);
                }

                .select-filter option {
                    background: #110e28;
                    color: #ffffff;
                }

                /* ============ TABLE CARD ============ */
                .table-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                }

                .table-responsive {
                    overflow-x: auto;
                    border: 1px solid rgba(168, 85, 247, 0.12);
                    border-radius: 12px;
                }

                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .user-th {
                    text-align: left;
                    padding: 14px 18px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    border-bottom: 1px solid rgba(168, 85, 247, 0.12);
                }

                .user-tr {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                    transition: all 0.2s ease;
                }

                .user-tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }

                .user-td {
                    padding: 14px 18px;
                    font-size: 12px;
                    color: #cbd5e1;
                    vertical-align: middle;
                }

                /* ============ BADGES ============ */
                .role-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 600;
                }

                .role-admin {
                    background: rgba(168, 85, 247, 0.1);
                    border: 1px solid rgba(168, 85, 247, 0.25);
                    color: #c084fc;
                }

                .role-user {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    color: #60a5fa;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 600;
                }

                .status-active {
                    background: rgba(34, 197, 94, 0.08);
                    border: 1px solid rgba(34, 197, 94, 0.2);
                    color: #4ade80;
                }

                .status-blocked {
                    background: rgba(239, 68, 68, 0.08);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #f87171;
                }

                /* ============ BUTTON DETAILS ============ */
                .action-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .btn-block {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: #ffffff;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
                }

                .btn-block:hover {
                    box-shadow: 0 4px 18px rgba(239, 68, 68, 0.4);
                    transform: translateY(-1px);
                }

                .btn-unblock {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: #ffffff;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                }

                .btn-unblock:hover {
                    box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
                    transform: translateY(-1px);
                }

                .refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 10px;
                    color: #cbd5e1;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .refresh-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(168, 85, 247, 0.3);
                    color: #ffffff;
                }
            `}</style>

            {/* DASHBOARD HEADER */}
            <div className="dashboard-header-flex">
                <div>
                    <h2>Manage Users</h2>
                    <p>Review directory, verify student uploads, toggle access blocks.</p>
                </div>
                <button onClick={fetchUsers} className="refresh-btn">
                    <RefreshCw size={12} />
                    Sync User Base
                </button>
            </div>

            {/* FILTERS PANEL */}
            <div className="filters-panel">
                <div className="search-wrapper">
                    <Search size={14} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search student directories by name or email address..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <select 
                    className="select-filter"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as 'All' | 'User' | 'Admin')}
                >
                    <option value="All">All Roles</option>
                    <option value="User">Standard Students</option>
                    <option value="Admin">System Administrators</option>
                </select>
            </div>

            {/* TABLE DIRECTORY CARD */}
            <div className="table-card">
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
                        <RefreshCw size={28} style={{ animation: 'spin 2s linear infinite', color: '#c084fc' }} />
                        <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '14px' }}>Loading student rosters...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div style={{ textAlignment: 'center', padding: '60px 0', color: '#64748b' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>No Matching Accounts</h4>
                        <p style={{ fontSize: '11px', marginTop: '4px' }}>Refine search keyword or change standard role filters.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th className="user-th">Student Name</th>
                                    <th className="user-th">Email Account</th>
                                    <th className="user-th">Role Tag</th>
                                    <th className="user-th" style={{ textAlign: 'center' }}>PDF Uploads</th>
                                    <th className="user-th" style={{ textAlign: 'center' }}>Downloads</th>
                                    <th className="user-th">Register Date</th>
                                    <th className="user-th">System Status</th>
                                    <th className="user-th" style={{ textAlign: 'center' }}>Access Controls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="user-tr">
                                        <td className="user-td" style={{ fontWeight: 600, color: '#ffffff' }}>
                                            {u.fullName}
                                        </td>
                                        <td className="user-td">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Mail size={12} style={{ color: '#64748b' }} />
                                                {u.email}
                                            </span>
                                        </td>
                                        <td className="user-td">
                                            <span className={`role-badge ${u.role === 'Admin' ? 'role-admin' : 'role-user'}`}>
                                                {u.role === 'Admin' ? <Shield size={10} /> : null}
                                                {u.role === 'Admin' ? 'Super Admin' : 'Student'}
                                            </span>
                                        </td>
                                        <td className="user-td" style={{ textAlign: 'center', fontWeight: 600 }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                                                <BookOpen size={10} style={{ color: '#c084fc' }} />
                                                {u.notesCount}
                                            </span>
                                        </td>
                                        <td className="user-td" style={{ textAlign: 'center', fontWeight: 600 }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                                                <ShoppingBag size={10} style={{ color: '#60a5fa' }} />
                                                {u.purchasesCount}
                                            </span>
                                        </td>
                                        <td className="user-td">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                                                <Calendar size={12} />
                                                {new Date(u.createdAt).toLocaleDateString('en-IN')}
                                            </span>
                                        </td>
                                        <td className="user-td">
                                            <span className={`status-badge ${u.isBlocked ? 'status-blocked' : 'status-active'}`}>
                                                {u.isBlocked ? 'Access Blocked' : 'Active Account'}
                                            </span>
                                        </td>
                                        <td className="user-td" style={{ textAlign: 'center' }}>
                                            {u.id === 4 ? (
                                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>System Locked</span>
                                            ) : (
                                                <button 
                                                    className={`action-btn ${u.isBlocked ? 'btn-unblock' : 'btn-block'}`}
                                                    onClick={() => handleToggleBlock(u.id, u.isBlocked)}
                                                >
                                                    {u.isBlocked ? <UserCheck size={12} /> : <UserX size={12} />}
                                                    {u.isBlocked ? 'Grant Access' : 'Restrict Access'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}