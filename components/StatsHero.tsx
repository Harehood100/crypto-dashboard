'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, BarChart2, Bitcoin, Layers } from 'lucide-react'
import { useCryptoStore } from '@/store/useCryptoStore'

function useCountUp(target: number, duration = 1200, decimals = 2) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (target === 0) return
        const steps = 50
        const stepTime = duration / steps
        const increment = target / steps
        let step = 0

        const timer = setInterval(() => {
            step++
            if (step >= steps) {
                setValue(target)
                clearInterval(timer)
            } else {
                setValue(parseFloat((increment * step).toFixed(decimals)))
            }
        }, stepTime)

        return () => clearInterval(timer)
    }, [target])

    return value
}

function StatCard({
    label,
    formatted,
    badge,
    badgeType,
    icon: Icon,
    iconColor,
    delay,
}: {
    label: string
    formatted: string
    badge?: string
    badgeType?: 'up' | 'down' | 'neutral'
    icon: any
    iconColor: string
    delay: string
}) {
    const { isDarkMode } = useCryptoStore()

    const badgeStyles = {
        up: 'bg-green-500/10 text-green-400',
        down: 'bg-red-500/10 text-red-400',
        neutral: 'bg-blue-500/10 text-blue-400',
    }

    return (
        <div
            className={`animate-slide-up rounded-xl p-4 border transition-all ${isDarkMode
                ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
            style={{ animationDelay: delay, opacity: 0, animationFillMode: 'forwards' }}
        >
            <div className="flex items-center justify-between mb-2">
                <p className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                    {label}
                </p>
                <div className={`p-1 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Icon size={12} className={iconColor} />
                </div>
            </div>

            <p className={`text-xl font-bold font-mono mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{ minHeight: '28px' }}>
                {formatted}
            </p>

            {badge && badgeType && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStyles[badgeType]}`}>
                    {badge}
                </span>
            )}
        </div>
    )
}

export default function StatsHero() {
    const { coins, isDarkMode } = useCryptoStore()

    const totalMarketCap = coins.reduce((sum, c) => sum + c.market_cap, 0)
    const totalVolume = coins.reduce((sum, c) => sum + c.total_volume, 0)
    const btcDominance = coins.length > 0 ? (coins[0].market_cap / totalMarketCap) * 100 : 0
    const gainers = coins.filter(c => c.price_change_percentage_24h > 0).length

    const animMarketCap = useCountUp(totalMarketCap / 1_000_000_000_000, 1200, 2)
    const animVolume = useCountUp(totalVolume / 1_000_000_000, 1200, 1)
    const animDominance = useCountUp(btcDominance, 1000, 1)
    const animGainers = useCountUp(gainers, 800, 0)

    if (coins.length === 0) return null

    return (
        <div className="mb-6 animate-fade-in">
            <div className="mb-4">
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Crypto Markets
                </h1>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Top 20 coins · Live prices · Updates every 60s
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Market Cap"
                    formatted={`$${animMarketCap.toFixed(2)}T`}
                    badge="Top 20 coins"
                    badgeType="neutral"
                    icon={BarChart2}
                    iconColor="text-blue-400"
                    delay="0ms"
                />
                <StatCard
                    label="24h Volume"
                    formatted={`$${animVolume.toFixed(1)}B`}
                    badge="Last 24 hours"
                    badgeType="neutral"
                    icon={TrendingUp}
                    iconColor="text-purple-400"
                    delay="80ms"
                />
                <StatCard
                    label="BTC Dominance"
                    formatted={`${animDominance.toFixed(1)}%`}
                    badge={btcDominance > 50 ? 'BTC leading' : 'Altcoin season'}
                    badgeType={btcDominance > 50 ? 'up' : 'down'}
                    icon={Bitcoin}
                    iconColor="text-orange-400"
                    delay="160ms"
                />
                <StatCard
                    label="Gainers Today"
                    formatted={`${Math.round(animGainers)} / 20`}
                    badge={gainers >= 10 ? 'Bullish' : 'Bearish'}
                    badgeType={gainers >= 10 ? 'up' : 'down'}
                    icon={Layers}
                    iconColor="text-green-400"
                    delay="240ms"
                />
            </div>
        </div>
    )
}