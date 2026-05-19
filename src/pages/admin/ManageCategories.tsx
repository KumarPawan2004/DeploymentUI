import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Category {
    id: string;
    name: string;
    description: string;
    noteCount: number;
    createdAt: string;
}

export default function ManageCategories() {
    const [categories, setCategories] = useState<Category[]>([
        {
            id: "1",
            name: "Computer Science",
            description: "All CS related subjects",
            noteCount: 245,
            createdAt: "12 Jan 2026"
        },
        {
            id: "2",
            name: "Data Structures & Algorithms",
            description: "DSA notes and resources",
            noteCount: 89,
            createdAt: "10 Jan 2026"
        },
        {
            id: "3",
            name: "Operating System",
            description: "OS concepts and notes",
            noteCount: 67,
            createdAt: "08 Jan 2026"
        },
        {
            id: "4",
            name: "Database Management System",
            description: "DBMS complete notes",
            noteCount: 54,
            createdAt: "05 Jan 2026"
        },
        {
            id: "5",
            name: "Mathematics",
            description: "Engineering Mathematics",
            noteCount: 32,
            createdAt: "03 Jan 2026"
        },
    ]);

    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCategory = () => {
        if (!newCategory.name.trim()) {
            alert("Category name is required");
            return;
        }

        const category: Category = {
            id: Date.now().toString(),
            name: newCategory.name,
            description: newCategory.description,
            noteCount: 0,
            createdAt: new Date().toLocaleDateString('en-IN')
        };

        setCategories([...categories, category]);
        setNewCategory({ name: '', description: '' });
        setIsAdding(false);
        alert("Category added successfully!");
    };

    const deleteCategory = (id: string) => {
        if (!confirm("Delete this category?")) return;
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Categories</h1>
                        <p className="text-gray-600 dark:text-gray-400">Total Categories: {categories.length}</p>
                    </div>
                    <Button variant="primary" onClick={() => setIsAdding(true)}>
                        + Add New Category
                    </Button>
                </div>

                {/* Search */}
                <Card className="mb-6">
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Card>

                {/* Add New Category Modal/Form */}
                {isAdding && (
                    <Card className="mb-8 border-2 border-blue-500">
                        <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
                        <div className="space-y-4">
                            <Input
                                label="Category Name"
                                placeholder="e.g. Artificial Intelligence"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                            <Input
                                label="Description"
                                placeholder="Short description about this category"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            />
                            <div className="flex gap-3">
                                <Button variant="success" onClick={handleAddCategory}>
                                    Add Category
                                </Button>
                                <Button variant="outline" onClick={() => setIsAdding(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <Card key={category.id} className="hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {category.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        {category.description}
                                    </p>
                                </div>
                                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                                    {category.noteCount} notes
                                </span>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
                                <p className="text-gray-500">Created: {category.createdAt}</p>
                                <Button
                                    variant="danger"
                                    className="px-4 py-1 text-sm"
                                    onClick={() => deleteCategory(category.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <Card>
                        <p className="text-center py-16 text-gray-500">No categories found</p>
                    </Card>
                )}
            </div>
        </div>
    );
}