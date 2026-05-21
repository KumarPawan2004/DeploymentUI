import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, FileText, ArrowRight, Library, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface UploadedNote {
    id: string;
    title: string;
    subject: string;
    price: number;
    isFree: boolean;
    uploadedAt: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Deleted';
    rejectReason?: string;
}

export default function MyUploads() {
    const [uploadedNotes, setUploadedNotes] = useState<UploadedNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                setLoading(true);
                const res = await api.get('/notes/my-uploads');
                if (res.data) {
                    const mapped = res.data.map((n: any) => ({
                        id: n.id.toString(),
                        title: n.title,
                        subject: n.subject,
                        price: n.price,
                        isFree: n.isFree,
                        uploadedAt: new Date(n.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                        status: n.status,
                        rejectReason: n.rejectionReason
                    }));
                    setUploadedNotes(mapped);
                }
            } catch (err: any) {
                console.error("Error loading uploads:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUploads();
    }, []);

    const { globalSearch } = useOutletContext<{ globalSearch: string }>();

    const filteredNotes = uploadedNotes.filter(note =>
        note.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        note.subject.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Approved': return { icon: <CheckCircle size={16} />, colorClass: 'status-approved' };
            case 'Rejected': return { icon: <XCircle size={16} />, colorClass: 'status-rejected' };
            case 'Pending':
            default: return { icon: <Clock size={16} />, colorClass: 'status-pending' };
        }
    };

    const styles = `
      .uploads-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 24px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        flex-wrap: wrap;
        gap: 20px;
      }

      .page-title {
        font-size: 36px;
        font-weight: 800;
        background: linear-gradient(to right, #818cf8, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }

      .page-subtitle {
        color: #94a3b8;
        font-size: 16px;
      }

      .upload-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
      }

      .upload-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
      }

      .uploads-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .upload-card {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(99, 102, 241, 0.15);
        border-radius: 20px;
        padding: 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
      }

      .upload-card:hover {
        transform: translateY(-4px);
        border-color: rgba(99, 102, 241, 0.4);
        box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.2);
      }

      .note-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
      }

      .note-info {
        flex: 1;
      }

      .note-title {
        font-size: 22px;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 16px;
        line-height: 1.3;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .status-pending {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.3);
      }

      .status-approved {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      .status-rejected {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }

      .note-meta-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(15, 23, 42, 0.5);
        padding: 8px 16px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.05);
        font-size: 14px;
        color: #cbd5e1;
      }

      .meta-icon {
        color: #818cf8;
      }

      .reject-reason {
        margin-top: 16px;
        padding: 16px;
        background: rgba(239, 68, 68, 0.05);
        border-left: 4px solid #ef4444;
        border-radius: 0 12px 12px 0;
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }
      
      .reject-reason p {
        font-size: 14px;
        color: #f8fafc;
        line-height: 1.5;
        margin: 0;
      }
      
      .reject-reason strong {
        color: #f87171;
        display: block;
        margin-bottom: 4px;
      }

      .empty-state {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
        border: 2px dashed rgba(99, 102, 241, 0.2);
        border-radius: 24px;
        padding: 80px 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .empty-icon-wrap {
        width: 96px;
        height: 96px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #818cf8;
        margin-bottom: 24px;
        box-shadow: 0 0 30px rgba(99,102,241,0.1);
      }

      .empty-title {
        font-size: 28px;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 12px;
      }

      .empty-desc {
        color: #94a3b8;
        font-size: 16px;
        margin-bottom: 32px;
        max-width: 400px;
      }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="uploads-container">
                <div className="header-section">
                    <div>
                        <h1 className="page-title">My Uploads</h1>
                        <p className="page-subtitle">Track the review status of the notes you've submitted.</p>
                    </div>
                    <Link to="/upload" className="upload-btn">
                        Upload New Note
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon-wrap">
                            <Library size={48} />
                        </div>
                        <h3 className="empty-title">No Uploads Found</h3>
                        <p className="empty-desc">
                            {globalSearch 
                                ? "We couldn't find any uploaded notes matching your search criteria." 
                                : "You haven't uploaded any notes yet. Share your knowledge with the community!"}
                        </p>
                        <Link to="/upload" className="upload-btn">
                            Upload Your First Note
                        </Link>
                    </div>
                ) : (
                    <div className="uploads-grid">
                        {filteredNotes.map((note) => {
                            const statusConfig = getStatusConfig(note.status);
                            return (
                                <div key={note.id} className="upload-card">
                                    <div className="note-header">
                                        <h3 className="note-title">
                                            {note.title}
                                        </h3>
                                        <div className={`status-badge ${statusConfig.colorClass}`}>
                                            {statusConfig.icon}
                                            {note.status}
                                        </div>
                                    </div>
                                    
                                    <div className="note-meta-grid">
                                        <div className="meta-item">
                                            <FileText size={16} className="meta-icon" />
                                            {note.subject}
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={16} className="meta-icon" />
                                            Uploaded: {note.uploadedAt}
                                        </div>
                                        <div className="meta-item">
                                            {note.isFree ? (
                                                <span className="text-emerald-400 font-semibold">Free Note</span>
                                            ) : (
                                                <span className="text-indigo-400 font-semibold">Premium (₹{note.price})</span>
                                            )}
                                        </div>
                                    </div>

                                    {note.status === 'Rejected' && note.rejectReason && (
                                        <div className="reject-reason">
                                            <AlertCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <strong>Admin Feedback:</strong>
                                                <p>{note.rejectReason}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
