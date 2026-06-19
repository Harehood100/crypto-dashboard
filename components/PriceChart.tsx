'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'
import { useCryptoStore } from '@/store/useCryptoStore'

function buildChartData(prices: number[]) {
    return prices.map((price, index) => {
        const daysAgo = 7 - (index / prices.length) * 7
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: parseFloat(price.toFixed(2)),
        }
    })
}

function CustomTooltip({ active, payload, label, isDarkMode }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className={`px-3 py-2 rounded-lg text-sm shadow-lg border ${isDarkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-200 text-gray-900'
            }`}>
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className="font-semibold">${payload[0].value.toLocaleString()}</p>
        </div>
    )
}

export default function PriceChart() {
    const { selectedCoin, setSelectedCoin, isDarkMode } = useCryptoStore()
    const [ready, setReady] = useState(false)

    // Wait one frame before rendering chart so container has a size
    useEffect(() => {
        if (selectedCoin) {
            setReady(false)
            const t = setTimeout(() => setReady(true), 50)
            return () => clearTimeout(t)
        } else {
            setReady(false)
        }
    }, [selectedCoin])

    if (!selectedCoin) return null

    const isPositive = selectedCoin.price_change_percentage_24h >= 0
    const chartColor = isPositive ? '#22c55e' : '#ef4444'
    const chartData = buildChartData(selectedCoin.sparkline_in_7d.price)

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                onClick={() => setSelectedCoin(null)}
            />

            {/* Modal */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-5 shadow-2xl animate-slide-up
          md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:rounded-2xl md:w-full md:max-w-2xl ${isDarkMode
                        ? 'bg-gray-900 border border-gray-800'
                        : 'bg-white border border-gray-200'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <img
                            src={selectedCoin.image}
                            alt={selectedCoin.name}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {selectedCoin.name}
                            </h2>
                            <p className="text-gray-500 uppercase text-xs">{selectedCoin.symbol}</p>
                        </div>
                    </div>

                    <div className="text-right flex-1 mx-4">
                        <p className={`text-lg font-bold font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${selectedCoin.current_price.toLocaleString()}
                        </p>
                        <p className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{selectedCoin.price_change_percentage_24h.toFixed(2)}% (24h)
                        </p>
                    </div>

                    <button
                        onClick={() => setSelectedCoin(null)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${isDarkMode
                            ? 'hover:bg-gray-800 text-gray-400'
                            : 'hover:bg-gray-100 text-gray-500'
                            }`}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Chart — only renders after 50ms delay so container has width */}
                <div style={{ width: '100%', height: 220 }}>
                    {ready ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                                <defs>
                                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={isDarkMode ? '#1f2937' : '#f3f4f6'}
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                                    width={72}
                                />
                                <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={chartColor}
                                    strokeWidth={2}
                                    fill="url(#priceGradient)"
                                    dot={false}
                                    activeDot={{ r: 4, fill: chartColor }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-2 gap-4 mt-5 pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'
                    }`}>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Market Cap</p>
                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${(selectedCoin.market_cap / 1_000_000_000).toFixed(2)}B
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">24h Volume</p>
                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${(selectedCoin.total_volume / 1_000_000_000).toFixed(2)}B
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}