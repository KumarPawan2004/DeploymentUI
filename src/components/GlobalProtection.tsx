import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GlobalProtection() {
    const [isScreenshotAttempted, setIsScreenshotAttempted] = useState(false);

    useEffect(() => {
        // Prevent right click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Prevent standard DevTools shortcuts and PrintScreen
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
            }
            // Ctrl+Shift+I / Cmd+Option+I (DevTools)
            if ((e.ctrlKey && e.shiftKey && e.key === 'I') || (e.metaKey && e.altKey && e.key === 'I')) {
                e.preventDefault();
            }
            // Ctrl+U / Cmd+Option+U (View Source)
            if ((e.ctrlKey && e.key === 'U') || (e.metaKey && e.altKey && e.key === 'U')) {
                e.preventDefault();
            }
            // Screenshot keys
            if (
                e.key === 'PrintScreen' || 
                (e.metaKey && e.shiftKey) || 
                (e.ctrlKey && e.shiftKey && e.key === 'S')
            ) {
                setIsScreenshotAttempted(true);
                try { navigator.clipboard.writeText(''); } catch(err) {}
                toast.error("Screenshots are disabled for security reasons.");
                
                // Unblur after 3 seconds
                setTimeout(() => {
                    setIsScreenshotAttempted(false);
                }, 3000);
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        // Add global unselectable class to body
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
        };
    }, []);

    if (!isScreenshotAttempted) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <ShieldAlert size={64} color="#ef4444" style={{ marginBottom: '20px' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Security Alert</h1>
            <p style={{ color: '#94a3b8' }}>Screenshots and screen recordings are strictly prohibited.</p>
        </div>
    );
}
