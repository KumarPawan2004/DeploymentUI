import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Login failed');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Login</h2>
                {error && <div style={styles.error}>{error}</div>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>Login</button>
                <p style={styles.link}>
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </form>
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
    form: {
        padding: '2.5rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '1.5rem',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        border: '2px solid #e1e5ee',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '16px',
        transition: 'border-color 0.3s',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
        transition: 'background-color 0.3s',
    },
    error: {
        color: '#dc3545',
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#f8d7da',
        borderRadius: '8px',
        textAlign: 'center',
    },
    link: {
        marginTop: '1.5rem',
        textAlign: 'center',
        color: '#666',
    },
};

export default Login;