'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import { useCryptoStore } from '@/store/useCryptoStore'

// Load these after initial paint — not critical for first render
const StatsHero = dynamic(() => import('@/components/StatsHero'), {
  ssr: false,
  loading: () => <div style={{ height: '140px' }} />,
})

const CryptoTable = dynamic(() => import('@/components/CryptoTable'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

const PriceChart = dynamic(() => import('@/components/PriceChart'), {
  ssr: false,
})

export default function Home() {
  const { isDarkMode } = useCryptoStore()

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: isDarkMode ? '#0a0a0f' : '#f9fafb' }}
    >
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <StatsHero />
        <CryptoTable />
      </main>
      <PriceChart />
    </div>
  )
}