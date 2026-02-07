import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    icon: string;
}

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [isEditing, setIsEditing] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await api.get('/categories');
        setCategories(res.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/categories/${isEditing}`, { name, icon });
            } else {
                await api.post('/categories', { name, icon });
            }
            setName('');
            setIcon('');
            setIsEditing(null);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category', error);
        }
    };

    const deleteCategory = async (id: string) => {
        if (window.confirm('Are you sure?')) {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        }
    };

    return (
        <div>
            <h2>Manage Categories</h2>

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Icon Name (Material Icons)</label>
                    <input
                        type="text"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        required
                        placeholder="e.g. fire, rocket, heartbeat"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <small style={{ fontSize: '11px', color: '#666' }}>
                        Browse icons: <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener noreferrer">Material Design Icons</a>
                    </small>
                </div>
                <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Plus size={18} />
                    {isEditing ? 'Update' : 'Add'}
                </button>
            </form>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f1f3f5' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Icon Name</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                            <th style={{ textAlign: 'center', padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(categories) && categories.map((cat) => (
                            <tr key={cat._id} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '12px', fontSize: '14px', color: '#007bff', fontWeight: 'bold' }}>{cat.icon}</td>
                                <td style={{ padding: '12px' }}>{cat.name}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => { setIsEditing(cat._id); setName(cat.name); setIcon(cat.icon); }}
                                        style={{ marginRight: '10px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(cat._id)}
                                        style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;
