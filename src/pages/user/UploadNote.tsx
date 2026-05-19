import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UploadNote() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        category: '',
        description: '',
        price: 0,
        isFree: true,
    });

    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast.error("Please upload a PDF file only");
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error("File size should be less than 10MB");
                return;
            }
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
    };

    const toggleFreePaid = (isFree: boolean) => {
        setFormData(prev => ({
            ...prev,
            isFree,
            price: isFree ? 0 : prev.price
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please upload a PDF file");
            return;
        }
        if (!formData.title || !formData.subject || !formData.category || !formData.description) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Note uploaded successfully! Sent for Admin Review.");
            navigate('/user/dashboard');
        }, 1500);
    };

    const styles = `
      .upload-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 32px 24px;
      }

      .upload-card {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(30, 41, 59, 1);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      }

      .upload-title {
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        text-align: center;
        margin-bottom: 8px;
      }

      .upload-subtitle {
        color: #94a3b8;
        text-align: center;
        margin-bottom: 32px;
        font-size: 16px;
      }

      .form-group {
        margin-bottom: 24px;
      }

      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #e2e8f0;
        margin-bottom: 8px;
      }

      .form-control {
        width: 100%;
        padding: 14px 16px;
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(51, 65, 85, 0.8);
        border-radius: 12px;
        color: #ffffff;
        font-size: 15px;
        outline: none;
        transition: all 0.3s ease;
      }

      .form-control:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }

      .form-control::placeholder {
        color: #64748b;
      }
      
      .form-control option {
        background: #0f172a;
        color: #fff;
      }

      .file-drop-area {
        border: 2px dashed rgba(71, 85, 105, 0.6);
        border-radius: 16px;
        padding: 32px;
        text-align: center;
        background: rgba(30, 41, 59, 0.3);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .file-drop-area:hover {
        border-color: #6366f1;
        background: rgba(30, 41, 59, 0.5);
      }

      .file-icon-wrap {
        width: 64px;
        height: 64px;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px auto;
        font-size: 24px;
      }

      .file-drop-text {
        font-weight: 500;
        color: #e2e8f0;
        margin-bottom: 4px;
      }

      .file-drop-sub {
        font-size: 14px;
        color: #64748b;
      }

      .file-selected {
        margin-top: 16px;
        padding: 16px;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .file-info {
        flex: 1;
        overflow: hidden;
      }

      .file-name {
        font-weight: 500;
        color: #e2e8f0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .file-size {
        font-size: 13px;
        color: #94a3b8;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
      }

      @media (min-width: 768px) {
        .grid-2 {
          grid-template-columns: 1fr 1fr;
        }
      }

      .type-toggle-container {
        display: flex;
        gap: 16px;
      }

      .type-toggle-btn {
        flex: 1;
        padding: 16px;
        border-radius: 12px;
        border: 2px solid rgba(51, 65, 85, 0.8);
        background: rgba(30, 41, 59, 0.3);
        color: #94a3b8;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .type-toggle-btn.active-free {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.1);
        color: #34d399;
      }

      .type-toggle-btn.active-paid {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        color: #60a5fa;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 14px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid transparent;
        cursor: pointer;
        width: 100%;
      }

      .btn-primary {
        background: #4f46e5;
        color: #ffffff;
        box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
      }

      .btn-primary:hover:not(:disabled) {
        background: #6366f1;
      }
      
      .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .btn-danger {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);
        padding: 8px 16px;
        font-size: 14px;
        width: auto;
      }

      .btn-danger:hover {
        background: rgba(239, 68, 68, 0.2);
      }

      .note-footer {
        text-align: center;
        font-size: 13px;
        color: #64748b;
        margin-top: 16px;
      }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="upload-container">
                <div className="upload-card">
                    <h1 className="upload-title">Upload New Notes</h1>
                    <p className="upload-subtitle">
                        Your note will be reviewed by admin before publishing
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* File Upload */}
                        <div className="form-group">
                            <label className="form-label">Upload PDF File</label>
                            <label htmlFor="pdf-upload" className="file-drop-area" style={{ display: 'block' }}>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="pdf-upload"
                                />
                                <div className="file-icon-wrap">
                                    📄
                                </div>
                                <p className="file-drop-text">Click to upload PDF</p>
                                <p className="file-drop-sub">Max size: 10MB</p>
                            </label>

                            {file && (
                                <div className="file-selected">
                                    <span>✅</span>
                                    <div className="file-info">
                                        <p className="file-name">{file.name}</p>
                                        <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button type="button" className="btn btn-danger" onClick={(e) => { e.preventDefault(); setFile(null); setFilePreview(null); }}>
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Note Details */}
                        <div className="grid-2 form-group">
                            <div>
                                <label className="form-label">Note Title *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Data Structures Complete Notes"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Subject *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="e.g. DSA, OS, DBMS"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-control"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="DSA">Data Structures & Algorithms</option>
                                <option value="OS">Operating System</option>
                                <option value="DBMS">Database Management</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="form-control"
                                placeholder="Write a detailed description about your notes..."
                                required
                            />
                        </div>

                        {/* Free or Paid */}
                        <div className="form-group">
                            <label className="form-label">Note Type</label>
                            <div className="type-toggle-container">
                                <button
                                    type="button"
                                    onClick={() => toggleFreePaid(true)}
                                    className={`type-toggle-btn ${formData.isFree ? 'active-free' : ''}`}
                                >
                                    🆓 Free Note
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleFreePaid(false)}
                                    className={`type-toggle-btn ${!formData.isFree ? 'active-paid' : ''}`}
                                >
                                    💰 Paid Note
                                </button>
                            </div>
                        </div>

                        {!formData.isFree && (
                            <div className="form-group">
                                <label className="form-label">Price (₹) *</label>
                                <input
                                    className="form-control"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price in rupees"
                                    min="1"
                                    required={!formData.isFree}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit for Admin Review'}
                        </button>

                        <p className="note-footer">
                            Note: After submission, admin will review your notes. You'll be notified once approved.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}