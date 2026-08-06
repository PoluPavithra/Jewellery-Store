import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ShopProvider } from './context/ShopContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { Home } from './pages/Home.jsx';
import { ProductListingPage } from './pages/ProductListingPage.jsx';
import { ProductDetails } from './pages/ProductDetails.jsx';
import { CollectionsPage } from './pages/CollectionsPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { OrderHistoryPage } from './pages/OrderHistoryPage.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { UserProfilePage } from './pages/UserProfilePage.jsx';
import { InvoicePage } from './pages/InvoicePage.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { WishlistDrawer } from './components/WishlistDrawer.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <div className="min-h-screen flex flex-col justify-between" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoice/:id"
                  element={
                    <ProtectedRoute>
                      <InvoicePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <CartDrawer />
            <WishlistDrawer />
            <AuthModal />
          </div>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}
