import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function SecurePDFViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [isBlurred, setIsBlurred] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/notes/download/${id}`, {
                    responseType: 'blob'
                });
                
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                setPdfBlobUrl(url);
            } catch (err) {
                console.error("Failed to load PDF securely:", err);
                toast.error("You must purchase this premium note first.");
                navigate(`/browse/note/${id}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPdf();

        // Cleanup blob URL on unmount
        return () => {
            if (pdfBlobUrl) {
                window.URL.revokeObjectURL(pdfBlobUrl);
            }
        };
    }, [id, navigate]);

    // Anti-Piracy: Blur when window loses focus (Screen share protection) + Keyboard blocks
    useEffect(() => {
        const handleBlur = () => setIsBlurred(true);
        const handleFocus = () => setIsBlurred(false);

        // Intercept screenshot hotkeys (PrintScreen, Win+Shift+S, Cmd+Shift+S, Cmd+Shift+4)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'PrintScreen' || 
                (e.metaKey && e.shiftKey) || 
                (e.ctrlKey && e.shiftKey && e.key === 'S')
            ) {
                setIsBlurred(true);
                // Try to clear clipboard as an extra deterrent
                try { navigator.clipboard.writeText(''); } catch(err) {}
                toast.error("Screenshots are disabled for security reasons.");
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen') {
                setTimeout(() => setIsBlurred(false), 2000); // Keep blurred for 2s after press
            }
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div 
            className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center overflow-hidden select-none"
            onContextMenu={(e) => e.preventDefault()} // Anti-Piracy: Disable right click
        >
            {/* Top Toolbar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 z-20">
                <div className="text-slate-300 font-semibold text-lg flex items-center gap-3">
                    <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-md text-sm border border-indigo-500/30">Secure Viewer</span>
                    Document Access
                </div>
                <button 
                    onClick={() => navigate(`/browse/note/${id}`)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Warning Overlay when Blurred */}
            {isBlurred && (
                <div className="absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-3xl flex flex-col items-center justify-center">
                    <div className="bg-slate-950 p-8 rounded-2xl border border-rose-500/30 shadow-2xl shadow-rose-500/10 text-center max-w-md">
                        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Content Hidden</h2>
                        <p className="text-slate-400 text-sm">
                            For security reasons, this document is hidden while you are interacting with other windows or applications. Click here to resume reading.
                        </p>
                    </div>
                </div>
            )}

            {/* Document Container */}
            <div className={`relative flex-1 w-full flex items-center justify-center overflow-auto pt-20 pb-24 transition-all duration-300 ${isBlurred ? 'blur-xl opacity-20' : 'opacity-100'}`}>
                
                {/* Dynamic User Watermark Overlay */}
                <div 
                    className="fixed inset-0 z-10 pointer-events-none flex flex-wrap opacity-[0.04] overflow-hidden rotate-[-25deg] scale-150"
                    style={{ gap: '80px', justifyContent: 'center', alignContent: 'center' }}
                >
                    {Array.from({ length: 150 }).map((_, i) => (
                        <div key={i} className="text-3xl font-bold text-white whitespace-nowrap">
                            {user?.email} • {user?.fullName}
                        </div>
                    ))}
                </div>

                {pdfBlobUrl && (
                    <div className="bg-white rounded-lg shadow-2xl overflow-hidden relative z-0">
                        <Document
                            file={pdfBlobUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="flex flex-col items-center"
                            loading={
                                <div className="p-20 text-slate-400">Loading document securely...</div>
                            }
                        >
                            <Page 
                                pageNumber={pageNumber} 
                                renderTextLayer={false} 
                                renderAnnotationLayer={false}
                                width={Math.min(window.innerWidth * 0.9, 800)}
                                className="shadow-lg"
                            />
                        </Document>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-full px-6 py-3 flex items-center gap-6 z-20 shadow-2xl">
                <button 
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(p => p - 1)}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                
                <span className="text-slate-300 font-medium font-mono min-w-[100px] text-center">
                    Page {pageNumber} of {numPages || '?'}
                </span>

                <button 
                    disabled={pageNumber >= (numPages || 1)}
                    onClick={() => setPageNumber(p => p + 1)}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}
