export interface Property {
  id: string
  title: string
  type: 'Villa' | 'Appartement' | 'Penthouse' | 'Maison' | 'Hotel' | 'Garage' | 'Entrepôt' | 'Autre'
  price_rent: number
  price_buy: number
  habitants: number
  capacity: number
  featured: boolean
  description: string
  images: string[]
}
