import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Note {
    id: string;
    title: string;
    subject: string;
    category: string;
    price: number;
    uploadedBy: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    uploadedAt: string;
    downloads?: number;
}

export default function ManageNotes() {
    const [notes, setNotes] = useState<Note[]>([
        {
            id: "1",
            title: "Complete Data Structures & Algorithms Handwritten Notes",
            subject: "DSA",
            category: "Computer Science",
            price: 199,
            uploadedBy: "Rahul Sharma",
            status: "Approved",
            uploadedAt: "2 days ago",
            downloads: 124
        },
        {
            id: "2",
            title: "Operating System Full Notes",
            subject: "OS",
            category: "Computer Science",
            price: 0,
            uploadedBy: "Priya Singh",
            status: "Approved",
            uploadedAt: "5 days ago",
            downloads: 87
        },
        {
            id: "3",
            title: "Machine Learning Complete Guide",
            subject: "ML",
            category: "AI/ML",
            price: 299,
            uploadedBy: "Amit Kumar",
            status: "Pending",
            uploadedAt: "1 day ago",
            downloads: 0
        },
        {
            id: "4",
            title: "Database Management System Notes",
            subject: "DBMS",
            category: "Computer Science",
            price: 149,
            uploadedBy: "Sneha Patel",
            status: "Rejected",
            uploadedAt: "10 days ago",
            downloads: 23
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || note.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const deleteNote = (id: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        setNotes(prev => prev.filter(note => note.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Notes</h1>
                        <p className="text-gray-600 dark:text-gray-400">Total Notes: {notes.length}</p>
                    </div>
                    <Button variant="primary">+ Add Note Manually</Button>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search notes by title or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-600 focus:outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="All">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </Card>

                {/* Notes Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-4 px-4 font-medium">Note Title</th>
                                    <th className="text-left py-4 px-4 font-medium">Subject</th>
                                    <th className="text-left py-4 px-4 font-medium">Uploaded By</th>
                                    <th className="text-left py-4 px-4 font-medium">Price</th>
                                    <th className="text-left py-4 px-4 font-medium">Status</th>
                                    <th className="text-left py-4 px-4 font-medium">Downloads</th>
                                    <th className="text-center py-4 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredNotes.map((note) => (
                                    <tr key={note.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <td className="py-5 px-4 font-medium text-gray-900 dark:text-white">
                                            {note.title}
                                        </td>
                                        <td className="py-5 px-4 text-gray-600 dark:text-gray-400">{note.subject}</td>
                                        <td className="py-5 px-4 text-gray-600 dark:text-gray-400">{note.uploadedBy}</td>
                                        <td className="py-5 px-4 font-medium">
                                            {note.price === 0 ? "Free" : `₹${note.price}`}
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
                                                {note.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4">{note.downloads || 0}</td>
                                        <td className="py-5 px-4">
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    variant="outline"
                                                    className="px-4 py-2 text-sm"
                                                    onClick={() => alert(`Editing: ${note.title}`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="px-4 py-2 text-sm"
                                                    onClick={() => deleteNote(note.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredNotes.length === 0 && (
                        <p className="text-center py-16 text-gray-500">No notes found matching your criteria.</p>
                    )}
                </Card>
            </div>
        </div>
    );
}