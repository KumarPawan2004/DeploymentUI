import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Link } from 'react-router-dom';

interface PurchasedNote {
    id: string;
    title: string;
    subject: string;
    price: number;
    purchasedAt: string;
    downloaded: number;
}

export default function MyPurchases() {
    const [purchasedNotes, setPurchasedNotes] = useState<PurchasedNote[]>([
        {
            id: "1",
            title: "Complete Data Structures & Algorithms Handwritten Notes",
            subject: "DSA",
            price: 199,
            purchasedAt: "10 May 2026",
            downloaded: 3
        },
        {
            id: "2",
            title: "Operating System Full Notes with Diagrams",
            subject: "OS",
            price: 149,
            purchasedAt: "5 May 2026",
            downloaded: 1
        },
        {
            id: "3",
            title: "Computer Networks Complete Guide",
            subject: "CN",
            price: 179,
            purchasedAt: "28 April 2026",
            downloaded: 5
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredNotes = purchasedNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownload = (note: PurchasedNote) => {
        alert(`Downloading: ${note.title}`);
        // In real app → call API to download PDF
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Purchased Notes</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Access all your purchased notes anytime
                        </p>
                    </div>
                    <Link to="/browse">
                        <Button variant="primary">Browse More Notes</Button>
                    </Link>
                </div>

                {/* Search */}
                <Card className="mb-8">
                    <Input
                        placeholder="Search your purchased notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Card>

                {filteredNotes.length === 0 ? (
                    <Card className="text-center py-20">
                        <p className="text-6xl mb-4">📚</p>
                        <h3 className="text-2xl font-semibold mb-2">No Purchases Yet</h3>
                        <p className="text-gray-500 mb-6">You haven't purchased any notes yet.</p>
                        <Link to="/browse">
                            <Button variant="primary">Start Browsing Notes</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredNotes.map((note) => (
                            <Card key={note.id} className="hover:shadow-xl transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            {note.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span>📘 {note.subject}</span>
                                            <span>💰 Paid ₹{note.price}</span>
                                            <span>📅 Purchased on {note.purchasedAt}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            variant="success"
                                            onClick={() => handleDownload(note)}
                                            className="min-w-[140px]"
                                        >
                                            📥 Download Again
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => alert(`Opening details for: ${note.title}`)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4 text-xs text-gray-500">
                                    Downloaded {note.downloaded} time{note.downloaded > 1 ? 's' : ''}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}