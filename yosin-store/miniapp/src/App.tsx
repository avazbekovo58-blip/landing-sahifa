import { Routes, Route, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './screens/Home';
import { Catalog } from './screens/Catalog';
import { ProductScreen } from './screens/Product';
import { CartScreen } from './screens/Cart';
import { Checkout } from './screens/Checkout';
import { Orders } from './screens/Orders';
import { Profile } from './screens/Profile';

export default function App() {
  const { pathname } = useLocation();
  // Sub-flows own the bottom of the screen with their own CTA bar, so the tab
  // bar is hidden there to avoid two stacked bars.
  const hideNav =
    pathname.startsWith('/product/') || pathname === '/cart' || pathname === '/checkout';

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <main className="flex-1 pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
