import { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({ quotes: 0, categories: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [quotesRes, categoriesRes] = await Promise.all([
                    api.get('/quotes'),
                    api.get('/categories')
                ]);
                setStats({
                    quotes: quotesRes.data.length,
                    categories: categoriesRes.data.length
                });
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div className="stat-card" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Total Quotes</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>{stats.quotes}</p>
                </div>
                <div className="stat-card" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Categories</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{stats.categories}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
