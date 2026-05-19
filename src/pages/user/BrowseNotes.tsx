import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    rating: number;
    downloads: number;
}

export default function BrowseNotes() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');

    // Mock Data
    const allNotes: Note[] = [
        {
            id: "1",
            title: "Complete Data Structures & Algorithms Handwritten Notes",
            subject: "DSA",
            category: "Computer Science",
            price: 0,
            uploadedBy: "Rahul Sharma",
            rating: 4.8,
            downloads: 1240
        },
        {
            id: "2",
            title: "Operating System Full Notes with PYQs",
            subject: "OS",
            category: "Computer Science",
            price: 149,
            uploadedBy: "Priya Singh",
            rating: 4.9,
            downloads: 890
        },
        {
            id: "3",
            title: "DBMS Complete Revision Notes",
            subject: "DBMS",
            category: "Computer Science",
            price: 99,
            uploadedBy: "Amit Kumar",
            rating: 4.7,
            downloads: 650
        },
        {
            id: "4",
            title: "Mathematics Engineering Notes",
            subject: "Maths",
            category: "Mathematics",
            price: 0,
            uploadedBy: "Sneha Patel",
            rating: 4.5,
            downloads: 420
        },
        {
            id: "5",
            title: "Computer Networks Complete Guide",
            subject: "CN",
            category: "Computer Science",
            price: 199,
            uploadedBy: "Vikas Sharma",
            rating: 4.6,
            downloads: 310
        },
    ];

    const categories = ['All', 'Computer Science', 'DSA', 'Mathematics', 'Others'];

    const filteredNotes = allNotes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;

        const matchesPrice =
            priceFilter === 'All' ||
            (priceFilter === 'Free' && note.price === 0) ||
            (priceFilter === 'Paid' && note.price > 0);

        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Browse Notes</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Discover high-quality study materials</p>
                    </div>
                    <Link to="/upload">
                        <Button variant="primary" className="mt-4 md:mt-0">+ Upload Your Notes</Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Search by title, subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value as 'All' | 'Free' | 'Paid')}
                        >
                            <option value="All">All Notes</option>
                            <option value="Free">Free Only</option>
                            <option value="Paid">Paid Only</option>
                        </select>
                    </div>
                </Card>

                {/* Results Count */}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Showing {filteredNotes.length} notes
                </p>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <Card key={note.id} className="hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                    {note.subject}
                                </div>
                                <div className={`px-3 py-1 text-xs font-medium rounded-full ${note.price === 0
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                    }`}>
                                    {note.price === 0 ? 'FREE' : `₹${note.price}`}
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {note.title}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                By {note.uploadedBy}
                            </p>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1">
                                    ⭐ <span>{note.rating}</span>
                                </div>
                                <div className="text-gray-500">
                                    {note.downloads.toLocaleString()} downloads
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Link to={`/note/${note.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        View Details
                                    </Button>
                                </Link>

                                {note.price === 0 ? (
                                    <Button variant="success" className="flex-1">
                                        Download
                                    </Button>
                                ) : (
                                    <Button variant="primary" className="flex-1">
                                        Buy ₹{note.price}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredNotes.length === 0 && (
                    <Card className="text-center py-20">
                        <p className="text-2xl mb-4">😔</p>
                        <p className="text-xl font-medium">No notes found</p>
                        <p className="text-gray-500 mt-2">Try changing your filters</p>
                    </Card>
                )}
            </div>
        </div>
    );
}