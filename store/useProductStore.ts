import { create } from 'zustand';
import { Product } from '@/types';

// Mock product data
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    price: 29.99,
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The Swiss Cheese Plant, known for its iconic split leaves, is a popular houseplant that adds tropical vibes to any space.',
    size: 'Medium',
    careLevel: 'Easy',
    category: 'popular',
  },
  {
    id: 2,
    name: 'Fiddle Leaf Fig',
    price: 49.99,
    image: 'https://images.pexels.com/photos/2382325/pexels-photo-2382325.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The trendy Fiddle Leaf Fig features large, violin-shaped leaves that create a striking focal point in any room.',
    size: 'Large',
    careLevel: 'Moderate',
    category: 'featured',
  },
  {
    id: 3,
    name: 'Snake Plant',
    price: 19.99,
    image: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Also known as Mother-in-Law\'s Tongue, this hardy plant features stiff, upright leaves and is nearly impossible to kill.',
    size: 'Small',
    careLevel: 'Easy',
    category: 'popular',
  },
  {
    id: 4,
    name: 'Peace Lily',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1320370/pexels-photo-1320370.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The Peace Lily is known for its white "flowers" and air-purifying qualities, making it both beautiful and functional.',
    size: 'Medium',
    careLevel: 'Easy',
    category: 'new',
  },
  {
    id: 5,
    name: 'Pothos',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1029844/pexels-photo-1029844.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The effortless Pothos is perfect for beginners, with trailing vines that can transform any space into a green oasis.',
    size: 'Small',
    careLevel: 'Easy',
    category: 'sale',
  },
  {
    id: 6,
    name: 'Bird of Paradise',
    price: 59.99,
    image: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'With its large, tropical foliage, the Bird of Paradise makes a dramatic statement in any space.',
    size: 'Large',
    careLevel: 'Moderate',
    category: 'featured',
  },
  {
    id: 7,
    name: 'ZZ Plant',
    price: 22.99,
    image: 'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The ZZ Plant is practically indestructible, thriving on neglect with its glossy, dark green leaves.',
    size: 'Medium',
    careLevel: 'Easy',
    category: 'popular',
  },
  {
    id: 8,
    name: 'Rubber Plant',
    price: 34.99,
    image: 'https://images.pexels.com/photos/3806840/pexels-photo-3806840.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The Rubber Plant features large, glossy leaves and is known for its air-purifying properties.',
    size: 'Medium',
    careLevel: 'Moderate',
    category: 'new',
  },
  {
    id: 9,
    name: 'Boston Fern',
    price: 18.99,
    image: 'https://images.pexels.com/photos/1918334/pexels-photo-1918334.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The classic Boston Fern has feathery fronds that add a touch of elegance to any space.',
    size: 'Medium',
    careLevel: 'Moderate',
    category: 'sale',
  },
];

interface ProductStore {
  products: Product[];
  featured: Product[];
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: PRODUCTS,
  featured: PRODUCTS.filter(product => product.category === 'featured'),
  
  getProductById: (id: number) => {
    return get().products.find((product) => product.id === id);
  },
  
  getProductsByCategory: (category: string) => {
    return get().products.filter((product) => product.category === category);
  },
}));