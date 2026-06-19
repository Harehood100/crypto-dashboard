import { create } from 'zustand'
import { Coin } from '@/types/crypto'

// Define the shape of our entire global state
interface CryptoStore {
    // --- DATA ---
    coins: Coin[]                    // all 20 coins from API
    isLoading: boolean               // are we fetching?
    error: string | null             // any error message

    // --- UI STATE ---
    searchQuery: string              // what user typed in search
    sortBy: 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h'
    sortOrder: 'asc' | 'desc'
    isDarkMode: boolean
    selectedCoin: Coin | null        // coin whose chart is open

    // --- ACTIONS (functions that change state) ---
    fetchCoins: () => Promise<void>
    setSearchQuery: (query: string) => void
    setSortBy: (field: CryptoStore['sortBy']) => void
    toggleSortOrder: () => void
    toggleDarkMode: () => void
    setSelectedCoin: (coin: Coin | null) => void

    // --- DERIVED DATA (computed from state) ---
    getFilteredAndSortedCoins: () => Coin[]
}

export const useCryptoStore = create<CryptoStore>((set, get) => ({
    // Initial values
    coins: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    sortBy: 'market_cap_rank',
    sortOrder: 'asc',
    isDarkMode: true,
    selectedCoin: null,

    // Fetch coins from OUR API route (not CoinGecko directly)
    fetchCoins: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await fetch('/api/crypto')
            if (!response.ok) throw new Error('Failed to fetch')
            const data: Coin[] = await response.json()
            set({ coins: data, isLoading: false })
        } catch (error) {
            set({ error: String(error), isLoading: false })
        }
    },

    setSearchQuery: (query) => set({ searchQuery: query }),

    setSortBy: (field) => set({ sortBy: field }),

    toggleSortOrder: () =>
        set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),

    toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

    setSelectedCoin: (coin) => set({ selectedCoin: coin }),

    // This runs filtering AND sorting in one go
    getFilteredAndSortedCoins: () => {
        const { coins, searchQuery, sortBy, sortOrder } = get()

        let filtered = coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )

        filtered.sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1
            return (a[sortBy] - b[sortBy]) * multiplier
        })

        return filtered
    },
}))