import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { WalletConnectComponent } from '../wallet-connect/wallet-connect';
import { WalletDashboardComponent } from '../wallet-dashboard/wallet-dashboard';
import { CATEGORIES, Category, PRODUCTS, Product } from '../../core/data/products.data';

interface CartLine {
  product: Product;
  qty: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WalletConnectComponent, WalletDashboardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly categories: Category[] = CATEGORIES;
  readonly products: Product[] = PRODUCTS;

  private readonly activeCategorySignal = signal<string>('todos');
  private readonly cartSignal = signal<Record<string, CartLine>>({});

  readonly activeCategory = computed(() => this.activeCategorySignal());

  readonly filteredProducts = computed(() => {
    const category = this.activeCategorySignal();
    if (category === 'todos') return this.products;
    return this.products.filter((product) => product.category === category);
  });

  readonly cartLines = computed(() => Object.values(this.cartSignal()));

  readonly cartCount = computed(() =>
    this.cartLines().reduce((total, line) => total + line.qty, 0),
  );

  readonly cartTotal = computed(() =>
    this.cartLines().reduce((total, line) => total + line.qty * line.product.price, 0),
  );

  selectCategory(key: string): void {
    this.activeCategorySignal.set(key);
  }

  addToCart(product: Product): void {
    this.cartSignal.update((cart) => {
      const existing = cart[product.id];
      const qty = existing ? existing.qty + 1 : 1;
      return { ...cart, [product.id]: { product, qty } };
    });
  }

  removeFromCart(productId: string): void {
    this.cartSignal.update((cart) => {
      const existing = cart[productId];
      if (!existing) return cart;

      if (existing.qty <= 1) {
        const { [productId]: _removed, ...rest } = cart;
        return rest;
      }

      return { ...cart, [productId]: { ...existing, qty: existing.qty - 1 } };
    });
  }

  scrollToCheckout(): void {
    if (typeof document === 'undefined') return;
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
