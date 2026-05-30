import bedroom from '../images/bedroom.jpg';
import bedroom1 from '../images/bedroom1.jpg';
import bedroom2 from '../images/bedroom2.jpg';
import bedroom4 from '../images/bedroom4.jpg';
import dining from '../images/dining.jpg';
import afterDining from '../images/after-dining.jpg';
import living from '../images/living.jpg';
import living2 from '../images/living2.jpg';
import salon from '../images/salon.jpg';
import shopCarousel1 from '../images/shopCarousel1.jpg';
import shopCarousel2 from '../images/shopCarousel2.jpg';
import shopCarousel3 from '../images/shopCarousel3.jpg';

export const formatCurrency = (amount) =>
  `EGP ${Math.round(amount).toLocaleString()}`;

export const PRODUCTS = [
  {
    _id: 'shop-modern-bedroom-set',
    title: 'Modern Bedroom Set',
    price: 899,
    image: shopCarousel1,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'beds',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Natural Brown',
    isNewArrival: true
  },
  {
    _id: 'shop-luxury-living-sofa',
    title: 'Luxury Living Sofa',
    price: 1299,
    image: shopCarousel2,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'sofas',
    material: 'fabric',
    color: 'gray',
    colorLabel: 'Soft Gray',
    isNewArrival: true
  },
  {
    _id: 'shop-modern-dining-set',
    title: 'Modern Dining Set',
    price: 799,
    image: shopCarousel3,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'sets',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Walnut',
    isNewArrival: true
  },
  {
    _id: 'shop-modern-storage-cabinet',
    title: 'Modern Storage Cabinet',
    price: 599,
    image: shopCarousel1,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'dressers',
    material: 'wood',
    color: 'white',
    colorLabel: 'White',
    isNewArrival: true
  },
  {
    _id: 'shop-comfort-recliner',
    title: 'Comfort Recliner',
    price: 449,
    image: shopCarousel2,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'chairs',
    material: 'leather',
    color: 'black',
    colorLabel: 'Black',
    isBestSeller: true
  },
  {
    _id: 'shop-modern-nightstand',
    title: 'Modern Nightstand',
    price: 199,
    image: shopCarousel3,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'nightstands',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Oak',
    isBestSeller: true
  },
  {
    _id: 'shop-tall-bookshelf',
    title: 'Tall Bookshelf',
    price: 349,
    image: shopCarousel1,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'bookcases',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Dark Brown',
    isBestSeller: true
  },
  {
    _id: 'shop-marble-coffee-table',
    title: 'Marble Coffee Table',
    price: 599,
    image: shopCarousel2,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'tables',
    material: 'glass',
    color: 'white',
    colorLabel: 'White Marble',
    isBestSeller: true
  },
  {
    _id: 'bedroom-modern-bed',
    title: 'Modern Bed',
    price: 2499,
    image: bedroom1,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'beds',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Oak Wood'
  },
  {
    _id: 'bedroom-spacious-wardrobe',
    title: 'Spacious Wardrobe',
    price: 1899,
    image: bedroom2,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'wardrobes',
    material: 'wood',
    color: 'white',
    colorLabel: 'White'
  },
  {
    _id: 'bedroom-nightstand-set',
    title: 'Nightstand Set',
    price: 799,
    image: bedroom,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'nightstands',
    material: 'wood',
    color: 'black',
    colorLabel: 'Black'
  },
  {
    _id: 'bedroom-drawer-dresser',
    title: '6-Drawer Dresser',
    price: 1299,
    image: bedroom4,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'dressers',
    material: 'wood',
    color: 'gray',
    colorLabel: 'Gray'
  },
  {
    _id: 'bedroom-upholstered-bench',
    title: 'Upholstered Bench',
    price: 599,
    image: bedroom1,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'benches',
    material: 'upholstered',
    color: 'gray',
    colorLabel: 'Gray'
  },
  {
    _id: 'bedroom-king-size-bed',
    title: 'King Size Bed',
    price: 3299,
    image: bedroom2,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'beds',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Walnut'
  },
  {
    _id: 'bedroom-mirror-dresser',
    title: 'Mirror Dresser',
    price: 1599,
    image: bedroom,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'dressers',
    material: 'wood',
    color: 'white',
    colorLabel: 'White'
  },
  {
    _id: 'bedroom-storage-ottoman',
    title: 'Storage Ottoman',
    price: 449,
    image: bedroom4,
    category: 'Bedroom',
    routeCategory: 'bedroom',
    type: 'ottomans',
    material: 'upholstered',
    color: 'gray',
    colorLabel: 'Gray'
  },
  {
    _id: 'living-modern-sectional-sofa',
    title: 'Modern Sectional Sofa',
    price: 3999,
    image: living,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'sofas',
    material: 'fabric',
    color: 'gray',
    colorLabel: 'Charcoal'
  },
  {
    _id: 'living-glass-coffee-table',
    title: 'Glass Coffee Table',
    price: 1299,
    image: living2,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'tables',
    material: 'glass',
    color: 'black',
    colorLabel: 'Black'
  },
  {
    _id: 'living-media-console',
    title: 'Media Console',
    price: 1899,
    image: salon,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'storage',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Walnut'
  },
  {
    _id: 'living-luxury-recliner',
    title: 'Luxury Recliner',
    price: 2499,
    image: living,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'chairs',
    material: 'leather',
    color: 'black',
    colorLabel: 'Black'
  },
  {
    _id: 'living-accent-chair',
    title: 'Accent Chair',
    price: 899,
    image: bedroom,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'chairs',
    material: 'fabric',
    color: 'white',
    colorLabel: 'Ivory'
  },
  {
    _id: 'living-end-table-set',
    title: 'End Table Set',
    price: 699,
    image: salon,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'tables',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Brown'
  },
  {
    _id: 'living-bookshelf',
    title: 'Bookshelf',
    price: 1199,
    image: living,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'bookcases',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Oak'
  },
  {
    _id: 'living-ottoman',
    title: 'Ottoman',
    price: 549,
    image: living2,
    category: 'Living Room',
    routeCategory: 'living-room',
    type: 'ottomans',
    material: 'fabric',
    color: 'gray',
    colorLabel: 'Gray'
  },
  {
    _id: 'dining-table',
    title: 'Dining Table',
    price: 4299,
    image: dining,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'tables',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Walnut'
  },
  {
    _id: 'dining-chairs',
    title: 'Dining Chairs',
    price: 2199,
    image: afterDining,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'chairs',
    material: 'wood',
    color: 'black',
    colorLabel: 'Black'
  },
  {
    _id: 'dining-storage',
    title: 'Dining Storage',
    price: 1899,
    image: shopCarousel3,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'storage',
    material: 'wood',
    color: 'white',
    colorLabel: 'White'
  },
  {
    _id: 'dining-bar-stools',
    title: 'Bar Stools',
    price: 799,
    image: dining,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'barstools',
    material: 'metal',
    color: 'black',
    colorLabel: 'Black'
  },
  {
    _id: 'dining-set',
    title: 'Dining Set',
    price: 3599,
    image: afterDining,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'sets',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Natural Brown'
  },
  {
    _id: 'dining-modern-table',
    title: 'Modern Dining Table',
    price: 2799,
    image: shopCarousel3,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'tables',
    material: 'glass',
    color: 'gray',
    colorLabel: 'Gray'
  },
  {
    _id: 'dining-wood-table',
    title: 'Wood Dining Table',
    price: 1499,
    image: dining,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'tables',
    material: 'wood',
    color: 'brown',
    colorLabel: 'Oak'
  },
  {
    _id: 'dining-luxury-table',
    title: 'Luxury Dining Table',
    price: 599,
    image: afterDining,
    category: 'Dining Room',
    routeCategory: 'dining-room',
    type: 'tables',
    material: 'wood',
    color: 'black',
    colorLabel: 'Black'
  }
];

export const PRODUCT_FILTERS = {
  bedroom: {
    types: ['beds', 'wardrobes', 'nightstands', 'dressers', 'benches', 'ottomans'],
    materials: ['wood', 'metal', 'upholstered']
  },
  'living-room': {
    types: ['sofas', 'chairs', 'tables', 'storage', 'bookcases', 'ottomans'],
    materials: ['fabric', 'leather', 'wood', 'glass']
  },
  'dining-room': {
    types: ['tables', 'chairs', 'storage', 'barstools', 'sets'],
    materials: ['wood', 'metal', 'glass']
  }
};

export const SHOP_SECTIONS = [
  {
    title: 'New Arrivals',
    products: PRODUCTS.filter(product => product.isNewArrival)
  },
  {
    title: 'Best Sellers',
    products: PRODUCTS.filter(product => product.isBestSeller)
  }
];

export const getProductsByRoom = (routeCategory) =>
  PRODUCTS.filter(product => product.routeCategory === routeCategory && !product.isNewArrival && !product.isBestSeller);

export const labelFromValue = (value) =>
  value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
