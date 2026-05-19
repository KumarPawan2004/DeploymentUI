import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export default function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [note, setNote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);

    // Mock Note Data
    useEffect(() => {
        // In real app, fetch from API using id
        const mockNote = {
            id: id,
            title: "Complete Data Structures & Algorithms Handwritten Notes",
            description: "Comprehensive handwritten notes covering all important topics of DSA including Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and more. Includes diagrams, code examples, and previous year questions.",
            subject: "DSA",
            category: "Computer Science",
            price: 199,
            uploadedBy: "Rahul Sharma",
            uploadedAt: "2 days ago",
            rating: 4.9,
            downloads: 1240,
            filePath: "#",
            pages: 87,
            isFree: false
        };
        setNote(mockNote);
        setIsLoading(false);
    }, [id]);

    const handleDownload = () => {
        if (note.price === 0) {
            toast.success("Downloading your free note...");
            // Simulate download
            setTimeout(() => {
                toast.success("Download started!");
            }, 800);
        } else {
            toast.error("Please purchase this note first");
        }
    };

    const handlePurchase = async () => {
        if (!note) return;

        setIsPurchasing(true);

        // Simulate Payment Process
        setTimeout(() => {
            toast.success("✅ Payment Successful! Note Unlocked.");
            setNote((prev: any) => ({ ...prev, isPurchased: true }));
            setIsPurchasing(false);
        }, 1500);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading note...</div>;
    }

    const isFree = note.price === 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left - Note Details */}
                    <div className="lg:col-span-7">
                        <Card className="mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold leading-tight">{note.title}</h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-3">
                                        By <strong>{note.uploadedBy}</strong> • {note.uploadedAt}
                                    </p>
                                </div>
                                <div className={`px-5 py-2 text-lg font-bold rounded-2xl ${isFree ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {isFree ? 'FREE' : `₹${note.price}`}
                                </div>
                            </div>

                            <div className="flex gap-6 mt-8 text-sm">
                                <div>⭐ <strong>{note.rating}</strong> Rating</div>
                                <div>📥 <strong>{note.downloads}</strong> Downloads</div>
                                <div>📄 {note.pages} Pages</div>
                            </div>
                        </Card>

                        <Card title="Description">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {note.description}
                            </p>
                        </Card>
                    </div>

                    {/* Right - Purchase / Download Card */}
                    <div className="lg:col-span-5">
                        <Card className="sticky top-6">
                            <h3 className="text-2xl font-bold mb-6">Get This Note</h3>

                            {note.isPurchased ? (
                                <div className="text-center py-8">
                                    <div className="text-green-600 text-5xl mb-4">✅</div>
                                    <h4 className="text-xl font-semibold mb-2">Note Unlocked!</h4>
                                    <Button
                                        variant="success"
                                        className="w-full mt-6"
                                        onClick={handleDownload}
                                    >
                                        📥 Download PDF Now
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 text-center mb-8">
                                        <p className="text-5xl font-bold mb-1">
                                            {isFree ? 'FREE' : `₹${note.price}`}
                                        </p>
                                        <p className="text-gray-500">One-time payment</p>
                                    </div>

                                    {isFree ? (
                                        <Button
                                            variant="success"
                                            className="w-full py-4 text-lg"
                                            onClick={handleDownload}
                                        >
                                            📥 Download Free Note
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            className="w-full py-4 text-lg"
                                            isLoading={isPurchasing}
                                            onClick={handlePurchase}
                                        >
                                            💳 Buy Now - ₹{note.price}
                                        </Button>
                                    )}

                                    <div className="mt-6 text-center text-sm text-gray-500">
                                        Secure Payment • Instant Access • Lifetime Access
                                    </div>

                                    {!isFree && (
                                        <div className="mt-8 border-t pt-6">
                                            <p className="text-sm font-medium mb-3">After Purchase You Get:</p>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">✅ Direct PDF Download</li>
                                                <li className="flex items-center gap-2">✅ Lifetime Access</li>
                                                <li className="flex items-center gap-2">✅ Future Updates</li>
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}