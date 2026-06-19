'use client'

import Navbar from '@/components/Navbar'
import StatsHero from '@/components/StatsHero'
import CryptoTable from '@/components/CryptoTable'
import PriceChart from '@/components/PriceChart'
import { useCryptoStore } from '@/store/useCryptoStore'

export default function Home() {
  const { isDarkMode } = useCryptoStore()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <StatsHero />
        <CryptoTable />
      </main>
      <PriceChart />
    </div>
  )
}