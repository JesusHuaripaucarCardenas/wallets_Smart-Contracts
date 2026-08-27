export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  emoji: string;
  tag?: string;
}

export interface Category {
  key: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { key: 'todos', label: 'Todos', emoji: '🧺' },
  { key: 'frutas', label: 'Frutas y verduras', emoji: '🥦' },
  { key: 'lacteos', label: 'Lácteos', emoji: '🧀' },
  { key: 'abarrotes', label: 'Abarrotes', emoji: '🌾' },
  { key: 'bebidas', label: 'Bebidas', emoji: '🥤' },
  { key: 'panaderia', label: 'Panadería', emoji: '🥖' },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Palta fuerte', category: 'frutas', price: 6.9, unit: 'kg', emoji: '🥑', tag: 'Cosecha local' },
  { id: 'p2', name: 'Plátano de la isla', category: 'frutas', price: 3.5, unit: 'kg', emoji: '🍌' },
  { id: 'p3', name: 'Camote amarillo', category: 'frutas', price: 2.8, unit: 'kg', emoji: '🍠' },
  { id: 'p4', name: 'Choclo serrano', category: 'frutas', price: 4.2, unit: 'kg', emoji: '🌽', tag: 'Oferta' },
  { id: 'p5', name: 'Leche evaporada', category: 'lacteos', price: 4.5, unit: 'lata 400g', emoji: '🥛' },
  { id: 'p6', name: 'Queso fresco', category: 'lacteos', price: 14.9, unit: 'kg', emoji: '🧀' },
  { id: 'p7', name: 'Yogurt natural', category: 'lacteos', price: 7.3, unit: 'botella 1L', emoji: '🍶' },
  { id: 'p8', name: 'Arroz extra', category: 'abarrotes', price: 5.6, unit: 'bolsa 5kg', emoji: '🍚' },
  { id: 'p9', name: 'Quinua orgánica', category: 'abarrotes', price: 12.4, unit: 'bolsa 1kg', emoji: '🌾', tag: 'Oferta' },
  { id: 'p10', name: 'Aceite vegetal', category: 'abarrotes', price: 9.9, unit: 'botella 1L', emoji: '🫙' },
  { id: 'p11', name: 'Chicha morada', category: 'bebidas', price: 6.5, unit: 'botella 1.5L', emoji: '🥤' },
  { id: 'p12', name: 'Agua sin gas', category: 'bebidas', price: 2.2, unit: 'botella 625ml', emoji: '💧' },
  { id: 'p13', name: 'Pan francés', category: 'panaderia', price: 0.4, unit: 'unidad', emoji: '🥖' },
  { id: 'p14', name: 'Tres leches', category: 'panaderia', price: 18.0, unit: 'torta', emoji: '🍰', tag: 'Nuevo' },
];
