export interface Property {
  id: string
  title: string
  type: 'Villa' | 'Appartement' | 'Penthouse' | 'Local commercial' | 'Entrepôt'
  price_rent: number
  price_buy: number
  habitants: number
  capacity: number
  featured: boolean
  description: string
  images: string[]
}
