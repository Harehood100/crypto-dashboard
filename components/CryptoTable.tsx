'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react'
import { useCryptoStore } from '@/store/useCryptoStore'
import { Coin } from '@/types/crypto'

const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: num > 1 ? 2 : 6,
    }).format(num)

const formatLarge = (num: number) => {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`
    return `$${num.toLocaleString()}`
}

function SkeletonCard({ isDarkMode }: { isDarkMode: boolean }) {
    return (
        <div className={`rounded-xl border p-3.5 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                        }`} />
                    <div>
                        <div className={`h-3 w-20 rounded animate-pulse mb-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                            }`} />
                        <div className={`h-2 w-10 rounded animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`} />
                    </div>
                </div>
                <div className={`h-5 w-8 rounded-full animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`} />
            </div>
            <div className={`h-12 w-full rounded animate-pulse my-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                }`} />
            <div className="flex justify-between mt-2">
                <div className={`h-4 w-24 rounded animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`} />
                <div className={`h-4 w-12 rounded animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`} />
            </div>
        </div>
    )
}

function Sparkline({ prices, isPositive }: { prices: number[]; isPositive: boolean }) {
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const range = max - min || 1
    const points = prices
        .map((p, i) => `${(i / (prices.length - 1)) * 200},${100 - ((p - min) / range) * 100}`)
        .join(' ')
    const color = isPositive ? '#22c55e' : '#ef4444'

    return (
        <svg viewBox="0 0 200 100" className="w-full h-12" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`g-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline points={`${points} 200,100 0,100`} fill={`url(#g-${isPositive})`} stroke="none" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}

// Bug 1 was here: SortPill was destructuring the wrong things from the store
function SortPill({
    label,
    field,
}: {
    label: string
    field: 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h'
}) {
    const { sortBy, sortOrder, setSortBy, toggleSortOrder, isDarkMode } = useCryptoStore()
    const isActive = sortBy === field

    const handleClick = () => {
        if (isActive) toggleSortOrder()
        else setSortBy(field)
    }

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${isActive
                ? 'bg-blue-600 text-white'
                : isDarkMode
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            {label}
            {isActive ? (
                sortOrder === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
            ) : (
                <ArrowUpDown size={11} />
            )}
        </button>
    )
}

// Bug 2 was here: CoinCard was destructuring wrong things and missing setSelectedCoin
function CoinCard({ coin, index }: { coin: Coin; index: number }) {
    const { isDarkMode, setSelectedCoin } = useCryptoStore()
    const isPositive = coin.price_change_percentage_24h >= 0

    return (
        <div
            onClick={() => setSelectedCoin(coin)}
            style={{ animationDelay: `${index * 40}ms`, opacity: 0, animationFillMode: 'forwards' }}
            className={`animate-slide-up rounded-xl border p-3.5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${isDarkMode
                ? 'bg-gray-900 border-gray-800 hover:border-blue-500/40 hover:shadow-blue-500/5'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-100'
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div style={{ width: 36, height: 36, flexShrink: 0 }}>
                        <Image
                            src={coin.image}
                            alt={coin.name}
                            width={36}
                            height={36}
                            className="rounded-full"
                            style={{ width: '36px', height: '36px' }}
                        />
                    </div>
                    <div>
                        <p className={`text-sm font-semibold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            {coin.name}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                    </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                    #{coin.market_cap_rank}
                </span>
            </div>

            <div className="my-2">
                <Sparkline prices={coin.sparkline_in_7d.price} isPositive={isPositive} />
            </div>

            <div className="flex items-end justify-between mt-2">
                <p className={`text-base font-bold font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {formatCurrency(coin.current_price)}
                </p>
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </span>
            </div>

            <div className={`flex justify-between mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'
                }`}>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Market Cap</p>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatLarge(coin.market_cap)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Volume</p>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatLarge(coin.total_volume)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function CryptoTable() {
    // Bug 3 was here: coins was declared AFTER the useEffect that used it
    // Bug 4 was here: CryptoTable destructuring was missing coins
    const { isLoading, error, fetchCoins, isDarkMode, getFilteredAndSortedCoins, coins } = useCryptoStore()
    const [visibleCount, setVisibleCount] = useState(8)

    useEffect(() => {
        fetchCoins()
        const interval = setInterval(fetchCoins, 60000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (coins.length > 0) {
            const t = setTimeout(() => setVisibleCount(20), 300)
            return () => clearTimeout(t)
        }
    }, [coins.length])

    // coins from getFilteredAndSortedCoins is for the DISPLAY (filtered/sorted)
    // coins from the store is the RAW data used for the useEffect above
    const displayCoins = getFilteredAndSortedCoins()

    if (isLoading && displayCoins.length === 0) {
        return (
            <div>
                <div className="flex items-center gap-2 mb-5">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sort by</span>
                    <div className={`h-6 w-14 rounded-full animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                    <div className={`h-6 w-14 rounded-full animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                    <div className={`h-6 w-14 rounded-full animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} isDarkMode={isDarkMode} />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-red-400 font-medium">Failed to load data</p>
                <button
                    onClick={fetchCoins}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    if (displayCoins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No coins match your search.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sort by</span>
                <SortPill label="Rank" field="market_cap_rank" />
                <SortPill label="Price" field="current_price" />
                <SortPill label="24h %" field="price_change_percentage_24h" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayCoins.slice(0, visibleCount).map((coin, index) => (
                    <CoinCard key={coin.id} coin={coin} index={index} />
                ))}
            </div>
        </div>
    )
}