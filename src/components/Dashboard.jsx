import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.welcome}>🎉 Welcome!</h1>
                <div style={styles.userInfo}>
                    <p>You are logged in as:</p>
                    <strong style={styles.email}>{user?.email}</strong>
                </div>
                <div style={styles.info}>
                    <h3>What's Next?</h3>
                    <ul style={styles.list}>
                        <li>✅ Backend API is running</li>
                        <li>✅ PostgreSQL is connected</li>
                        <li>✅ Authentication is working</li>
                        <li>🚀 Ready to build features!</li>
                    </ul>
                </div>
                <button onClick={handleLogout} style={styles.button}>
                    Logout
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    card: {
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
    },
    welcome: {
        fontSize: '2.5rem',
        marginBottom: '1.5rem',
    },
    userInfo: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
    },
    email: {
        fontSize: '1.2rem',
        color: '#667eea',
    },
    info: {
        backgroundColor: '#f0fdf4',
        padding: '1.5rem',
        borderRadius: '12px',
        textAlign: 'left',
        marginBottom: '1.5rem',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    button: {
        padding: '12px 40px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
};

export default Dashboard;