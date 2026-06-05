import { useEffect } from 'react';

export default function OAuthCallback() {
    useEffect(() => {
        // Read token from URL if it exists (for strict CORS environments fallback)
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            sessionStorage.setItem('token', token);
        }

        // The backend has already set the HttpOnly cookie for us.
        // We just need to redirect to the home page to let AuthContext fetch the user.
        window.location.href = '/';
    }, []);

    return (
        <div style={{ 
            height: '100vh', 
            width: '100vw', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#0f0c29',
            color: 'white',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Authenticating...</h2>
                <p style={{ color: '#94a3b8' }}>Please wait while we log you in.</p>
            </div>
        </div>
    );
}
