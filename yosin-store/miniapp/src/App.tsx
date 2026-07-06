import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './screens/Home';
import { Catalog } from './screens/Catalog';
import { ProductScreen } from './screens/Product';
import { CartScreen } from './screens/Cart';
import { Checkout } from './screens/Checkout';
import { Orders } from './screens/Orders';
import { Profile } from './screens/Profile';

import { AdminProvider } from './admin/AdminContext';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/screens/Dashboard';
import { AdminProducts } from './admin/screens/Products';
import { AdminCategories } from './admin/screens/Categories';
import { AdminOrders } from './admin/screens/Orders';
import { AdminQuestions } from './admin/screens/Questions';
import { AdminBroadcast } from './admin/screens/Broadcast';
import { AdminSettings } from './admin/screens/Settings';

// Customer-facing shell: phone-width column with the tab bar. Sub-flows own the
// bottom of the screen with their own CTA bar, so the tab bar hides there.
function CustomerLayout() {
  const { pathname } = useLocation();
  const hideNav =
    pathname.startsWith('/product/') || pathname === '/cart' || pathname === '/checkout';
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Storefront */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin panel (separate provider, full-width, own auth gate) */}
      <Route path="/admin" element={<AdminProvider><AdminLayout /></AdminProvider>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="broadcast" element={<AdminBroadcast />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
