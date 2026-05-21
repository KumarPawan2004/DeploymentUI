import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { UploadCloud, FileText, CheckCircle, X, DollarSign, Gift, Info } from 'lucide-react';

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
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

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

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subject', formData.subject);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('file', file);

      await api.post('/notes/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Note uploaded successfully! Sent for Admin Review.");
      navigate('/my-uploads');
    } catch (err: any) {
      const errorMsg = err.response?.data || "Failed to submit note for review.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = `
      .upload-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 24px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .upload-card {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(99, 102, 241, 0.15);
        border-radius: 24px;
        padding: 40px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }

      .upload-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .upload-title {
        font-size: 36px;
        font-weight: 800;
        background: linear-gradient(to right, #818cf8, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 12px;
        letter-spacing: -0.5px;
      }

      .upload-subtitle {
        color: #94a3b8;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .form-section {
        background: rgba(15, 23, 42, 0.4);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        border: 1px solid rgba(255, 255, 255, 0.03);
      }

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #f8fafc;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .form-group {
        margin-bottom: 24px;
      }

      .form-group:last-child {
        margin-bottom: 0;
      }

      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #cbd5e1;
        margin-bottom: 8px;
        letter-spacing: 0.3px;
      }

      .form-control {
        width: 100%;
        padding: 14px 16px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(71, 85, 105, 0.4);
        border-radius: 12px;
        color: #f8fafc;
        font-size: 15px;
        outline: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      }

      .form-control:focus {
        border-color: #818cf8;
        background: rgba(15, 23, 42, 0.8);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), inset 0 2px 4px rgba(0,0,0,0.1);
      }

      .form-control::placeholder {
        color: #475569;
      }
      
      .form-control option {
        background: #0f172a;
        color: #f8fafc;
        padding: 12px;
      }

      .file-drop-area {
        border: 2px dashed rgba(99, 102, 241, 0.3);
        border-radius: 16px;
        padding: 40px 24px;
        text-align: center;
        background: linear-gradient(180deg, rgba(30, 41, 59, 0.2) 0%, rgba(15, 23, 42, 0.2) 100%);
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .file-drop-area::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(circle at center, rgba(99,102,241,0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .file-drop-area:hover {
        border-color: #818cf8;
        background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%);
        transform: translateY(-2px);
      }
      
      .file-drop-area:hover::before {
        opacity: 1;
      }

      .file-icon-wrap {
        width: 72px;
        height: 72px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px auto;
        color: #818cf8;
        box-shadow: 0 0 20px rgba(99,102,241,0.1);
        transition: transform 0.3s ease;
      }

      .file-drop-area:hover .file-icon-wrap {
        transform: scale(1.05);
      }

      .file-drop-text {
        font-weight: 600;
        color: #f8fafc;
        margin-bottom: 6px;
        font-size: 16px;
      }

      .file-drop-sub {
        font-size: 14px;
        color: #64748b;
      }

      .file-selected {
        margin-top: 16px;
        padding: 16px 20px;
        background: linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
        border: 1px solid rgba(16, 185, 129, 0.2);
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 16px;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .file-icon-small {
        color: #10b981;
        background: rgba(16, 185, 129, 0.15);
        padding: 10px;
        border-radius: 10px;
      }

      .file-info {
        flex: 1;
        overflow: hidden;
      }

      .file-name {
        font-weight: 600;
        color: #e2e8f0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 15px;
        margin-bottom: 4px;
      }

      .file-size {
        font-size: 13px;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 6px;
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
        padding: 18px;
        border-radius: 14px;
        border: 1px solid rgba(71, 85, 105, 0.4);
        background: rgba(15, 23, 42, 0.4);
        color: #94a3b8;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .type-toggle-btn:hover:not(.active-free):not(.active-paid) {
        background: rgba(30, 41, 59, 0.6);
        border-color: rgba(99, 102, 241, 0.3);
      }

      .type-toggle-btn.active-free {
        border-color: #10b981;
        background: linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05));
        color: #34d399;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
      }

      .type-toggle-btn.active-paid {
        border-color: #818cf8;
        background: linear-gradient(145deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.05));
        color: #818cf8;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
      }

      .price-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        animation: fadeIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .price-currency {
        position: absolute;
        left: 16px;
        color: #94a3b8;
        font-weight: 500;
        font-size: 16px;
      }

      .price-input {
        padding-left: 40px !important;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 16px 28px;
        border-radius: 14px;
        font-weight: 600;
        font-size: 16px;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        cursor: pointer;
        width: 100%;
      }

      .btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: #ffffff;
        box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
      }
      
      .btn-primary:active:not(:disabled) {
        transform: translateY(0);
      }
      
      .btn-primary:disabled {
        background: rgba(71, 85, 105, 0.5);
        color: #94a3b8;
        box-shadow: none;
        cursor: not-allowed;
      }

      .btn-danger {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);
        padding: 8px 12px;
        font-size: 14px;
        width: auto;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-danger:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
      }

      .note-footer {
        text-align: center;
        font-size: 13px;
        color: #64748b;
        margin-top: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
    `;

  return (
    <>
      <style>{styles}</style>
      <div className="upload-container">
        <div className="upload-card">
          <div className="upload-header">
            <h1 className="upload-title">Share Your Knowledge</h1>
            <p className="upload-subtitle">
              <Info size={16} />
              Upload your notes. They will be reviewed by an admin before publishing.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-section">
              <h3 className="section-title"><UploadCloud size={20} style={{ color: '#818cf8' }} /> Upload PDF Document</h3>
              {/* File Upload */}
              <div className="form-group">
                <label htmlFor="pdf-upload" className="file-drop-area" style={{ display: 'block' }}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="pdf-upload"
                  />
                  <div className="file-icon-wrap">
                    <UploadCloud size={32} />
                  </div>
                  <p className="file-drop-text">Click to browse or drag and drop</p>
                  <p className="file-drop-sub">PDF files only (Max size: 10MB)</p>
                </label>

                {file && (
                  <div className="file-selected">
                    <div className="file-icon-small">
                      <FileText size={24} />
                    </div>
                    <div className="file-info">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">
                        <CheckCircle size={14} style={{ color: '#10b981' }} />
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button type="button" className="btn btn-danger" onClick={(e) => { e.preventDefault(); setFile(null); setFilePreview(null); }}>
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title"><FileText size={20} style={{ color: '#818cf8' }} /> Note Details</h3>

              <div className="grid-2 form-group">
                <div>
                  <label className="form-label">Note Title <span style={{ color: '#f87171' }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Advanced Data Structures Complete Notes"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Subject <span style={{ color: '#f87171' }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. DSA, Operating Systems"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category <span style={{ color: '#f87171' }}>*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description <span style={{ color: '#f87171' }}>*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="form-control"
                  placeholder="Write a detailed description about your notes. What topics does it cover?"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title"><DollarSign size={20} style={{ color: '#818cf8' }} /> Pricing</h3>
              {/* Free or Paid */}
              <div className="form-group">
                <div className="type-toggle-container">
                  <button
                    type="button"
                    onClick={() => toggleFreePaid(true)}
                    className={`type-toggle-btn ${formData.isFree ? 'active-free' : ''}`}
                  >
                    <Gift size={24} />
                    Free Note
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFreePaid(false)}
                    className={`type-toggle-btn ${!formData.isFree ? 'active-paid' : ''}`}
                  >
                    <DollarSign size={24} />
                    Premium Note
                  </button>
                </div>
              </div>

              {!formData.isFree && (
                <div className="form-group">
                  <label className="form-label">Price <span style={{ color: '#f87171' }}>*</span></label>
                  <div className="price-input-wrapper">
                    <span className="price-currency">₹</span>
                    <input
                      className="form-control price-input"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price in rupees"
                      min="1"
                      required={!formData.isFree}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', marginLeft: '-4px', marginRight: '8px', height: '20px', width: '20px', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  Submitting...
                </>
              ) : (
                <>
                  <UploadCloud size={20} />
                  Submit for Admin Review
                </>
              )}
            </button>

            <p className="note-footer">
              <Info size={14} />
              After submission, an admin will review your notes before they appear on the platform.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}