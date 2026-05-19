import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

interface PendingNote {
    id: string;
    title: string;
    description: string;
    subject: string;
    uploadedBy: string;
    price: number;
    uploadedAt: string;
    filePath: string; // For preview/download
}

export default function ReviewNotes() {
    const { user } = useAuth();

    // Mock Data - Replace with API call later
    const [pendingNotes, setPendingNotes] = useState<PendingNote[]>([
        {
            id: "1",
            title: "Complete Data Structures & Algorithms Handwritten Notes",
            description: "Covers all important topics with diagrams and examples.",
            subject: "DSA",
            uploadedBy: "Rahul Sharma",
            price: 199,
            uploadedAt: "2 hours ago",
            filePath: "#"
        },
        {
            id: "2",
            title: "Operating System Complete Notes 2026",
            description: "Process management, Memory management, Deadlock, etc.",
            subject: "OS",
            uploadedBy: "Priya Singh",
            price: 0,
            uploadedAt: "Yesterday",
            filePath: "#"
        },
        {
            id: "3",
            title: "DBMS Revision Notes with PYQs",
            description: "Very good quality notes with previous year questions.",
            subject: "DBMS",
            uploadedBy: "Amit Kumar",
            price: 149,
            uploadedAt: "3 days ago",
            filePath: "#"
        },
    ]);

    const [selectedNote, setSelectedNote] = useState<PendingNote | null>(null);

    const handleApprove = (id: string) => {
        if (!confirm("Are you sure you want to approve this note?")) return;

        setPendingNotes(prev => prev.filter(note => note.id !== id));
        alert("Note Approved & Published Successfully!");
    };

    const handleReject = (id: string) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        setPendingNotes(prev => prev.filter(note => note.id !== id));
        alert(`Note Rejected. Reason: ${reason}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review Uploaded Notes</h1>
                        <p className="text-gray-600 dark:text-gray-400">Pending for approval ({pendingNotes.length})</p>
                    </div>
                    <Button variant="outline">Refresh</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Notes List */}
                    <div className="lg:col-span-7">
                        <Card title="Pending Notes">
                            <div className="space-y-4">
                                {pendingNotes.length === 0 ? (
                                    <p className="text-center py-10 text-gray-500">No pending notes for review 🎉</p>
                                ) : (
                                    pendingNotes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer"
                                            onClick={() => setSelectedNote(note)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-lg">{note.title}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        By <strong>{note.uploadedBy}</strong> • {note.subject} • {note.price === 0 ? "Free" : `₹${note.price}`}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">{note.uploadedAt}</p>
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="success"
                                                        onClick={(e) => { e.stopPropagation(); handleApprove(note.id); }}
                                                        className="px-5"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={(e) => { e.stopPropagation(); handleReject(note.id); }}
                                                        className="px-5"
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Note Preview / Details */}
                    <div className="lg:col-span-5">
                        <Card title="Note Details">
                            {selectedNote ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold">{selectedNote.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{selectedNote.subject} • Uploaded by {selectedNote.uploadedBy}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Description</h4>
                                        <p className="text-gray-700 dark:text-gray-300">{selectedNote.description}</p>
                                    </div>

                                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl text-center">
                                        <p className="text-sm text-gray-500 mb-2">PDF Preview</p>
                                        <Button variant="outline" className="w-full">
                                            📄 View / Download PDF
                                        </Button>
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t">
                                        <Button
                                            variant="success"
                                            className="flex-1"
                                            onClick={() => handleApprove(selectedNote.id)}
                                        >
                                            ✅ Approve & Publish
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="flex-1"
                                            onClick={() => handleReject(selectedNote.id)}
                                        >
                                            ❌ Reject Note
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-96 flex items-center justify-center text-gray-400">
                                    Click on a note to preview details
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}