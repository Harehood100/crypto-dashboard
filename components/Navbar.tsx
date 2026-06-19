'use client'

import { Search, Moon, Sun, TrendingUp } from 'lucide-react'
import { useCryptoStore } from '@/store/useCryptoStore'

export default function Navbar() {
    const { searchQuery, setSearchQuery, isDarkMode, toggleDarkMode } = useCryptoStore()

    return (
        <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${isDarkMode
                ? 'bg-gray-950/90 border-gray-800'
                : 'bg-white/90 border-gray-200'
            }`}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                {/* Logo */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp size={14} className="text-white" />
                    </div>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        CryptoDash
                    </span>
                </div>

                {/* Search */}
                <div className="relative w-48 md:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                        type="text"
                        placeholder="Search coins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none transition-colors ${isDarkMode
                                ? 'bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500'
                                : 'bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-400'
                            }`}
                    />
                </div>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleDarkMode}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDarkMode
                            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                </button>

            </div>
        </nav>
    )
}