import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h',
            {
                next: { revalidate: 60 },
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        )

        // NEW: Log exactly what CoinGecko says
        console.log('Status:', response.status)
        console.log('Status text:', response.statusText)

        if (!response.ok) {
            const errorBody = await response.text()
            console.log('Error body:', errorBody)
            throw new Error(`CoinGecko responded with ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.log('Caught error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch crypto data', detail: String(error) },
            { status: 500 }
        )
    }
}