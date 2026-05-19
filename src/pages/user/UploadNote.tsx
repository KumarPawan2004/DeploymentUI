import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">
                <Card className="shadow-xl">
                    <h1 className="text-3xl font-bold text-center mb-2">Upload New Notes</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                        Your note will be reviewed by admin before publishing
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Upload PDF File</label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                                        📄
                                    </div>
                                    <p className="font-medium">Click to upload PDF</p>
                                    <p className="text-sm text-gray-500 mt-1">Max size: 10MB</p>
                                </label>
                            </div>

                            {file && (
                                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center gap-3">
                                    <span>✅</span>
                                    <div className="flex-1 truncate">
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <Button variant="danger" onClick={() => { setFile(null); setFilePreview(null); }}>
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Note Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Note Title *"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Data Structures Complete Handwritten Notes"
                                required
                            />

                            <Input
                                label="Subject *"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="e.g. DSA, OS, DBMS"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
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

                        <div>
                            <label className="block text-sm font-medium mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                                placeholder="Write a detailed description about your notes..."
                                required
                            />
                        </div>

                        {/* Free or Paid */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Note Type</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => toggleFreePaid(true)}
                                    className={`flex-1 py-4 rounded-2xl border-2 font-medium transition-all ${formData.isFree
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                            : 'border-gray-300 dark:border-gray-700'
                                        }`}
                                >
                                    🆓 Free Note
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleFreePaid(false)}
                                    className={`flex-1 py-4 rounded-2xl border-2 font-medium transition-all ${!formData.isFree
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                            : 'border-gray-300 dark:border-gray-700'
                                        }`}
                                >
                                    💰 Paid Note
                                </button>
                            </div>
                        </div>

                        {!formData.isFree && (
                            <Input
                                label="Price (₹)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price in rupees"
                                min="0"
                            />
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            className="w-full py-4 text-lg"
                        >
                            Submit for Admin Review
                        </Button>

                        <p className="text-center text-xs text-gray-500">
                            Note: After submission, admin will review your notes. You'll be notified once approved.
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
}