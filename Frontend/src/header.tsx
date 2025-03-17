import logo from './logo.jpg';
import AuthButton from '../login'; 
import SearchOverlay from './search';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div>
            <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
                <div className="w-full px-6 py-4 flex items-center">
                    <div className="flex items-center">
                        <Link to="/" className="mr-10">
                            <img src={logo} alt="Logo" className="h-16 w-auto" />
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <Link
                                to="/analysis"
                                className="text-white hover:text-emerald-500 transition-colors"
                            >
                                Analysis
                            </Link>
                            <Link
                                to="/portfolio"
                                className="text-white hover:text-emerald-500 transition-colors"
                            >
                                Portfolio
                            </Link>
                            <Link
                                to="/watchlist"
                                className="text-white hover:text-emerald-500 transition-colors"
                            >
                                Watchlist
                            </Link>
                            <Link
                                to="/trade"
                                className="text-white hover:text-emerald-500 transition-colors"
                            >
                                Trade
                            </Link>
                            <Link
                                to="/settings"
                                className="text-white hover:text-emerald-500 transition-colors"
                            >
                                Settings
                            </Link>
                        </nav>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex items-center gap-4">
                        <AuthButton />
                        <SearchOverlay />
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;