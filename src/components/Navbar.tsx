import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Library, Quote } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/categories', name: 'Categories', icon: <Library size={20} /> },
        { path: '/quotes', name: 'Quotes', icon: <Quote size={20} /> },
    ];

    return (
        <nav>
            <h1>Quotes Admin</h1>
            <ul>
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={location.pathname === item.path ? 'active' : ''}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
