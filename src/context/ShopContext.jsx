import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productsData as initialProducts } from '../data/mockData.js';
import productService from '../services/productService.js';
import cartService from '../services/cartService.js';
import wishlistService from '../services/wishlistService.js';
import { useAuth } from './AuthContext.jsx';

const ShopContext = createContext(undefined);

export const ShopProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState(initialProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('aurelia_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('aurelia_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const refreshProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      setProducts(initialProducts);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    if (isAuthenticated) {
      const syncBackendUserData = async () => {
        try {
          const apiCart = await cartService.getCart();
          setCart(apiCart);
        } catch {
          // Keep local fallback
        }
        try {
          const apiWishlist = await wishlistService.getWishlist();
          setWishlist(apiWishlist);
        } catch {
          // Keep local fallback
        }
      };
      syncBackendUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('aurelia_cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('aurelia_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const addToCart = async (product, quantity = 1, selectedSize) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await cartService.addToCart(product.id, quantity, selectedSize);
        setCart(updatedCart);
      } catch (err) {
        setCart((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prev, { product, quantity }];
        });
      }
    } else {
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
    }
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId, cartItemId) => {
    if (isAuthenticated && cartItemId) {
      try {
        const updatedCart = await cartService.removeFromCart(cartItemId);
        setCart(updatedCart);
        return;
      } catch {
        // Fallback
      }
    }
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = async (productId, quantity, cartItemId) => {
    if (quantity <= 0) {
      await removeFromCart(productId, cartItemId);
      return;
    }

    if (isAuthenticated && cartItemId) {
      try {
        const updatedCart = await cartService.updateCartItem(cartItemId, quantity);
        setCart(updatedCart);
        return;
      } catch {
        // Fallback
      }
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch {
        // Fallback
      }
    }
    setCart([]);
  };

  const toggleWishlist = async (productId) => {
    const isCurrentlyIn = wishlist.includes(productId);
    if (isAuthenticated) {
      try {
        let updatedWishlist;
        if (isCurrentlyIn) {
          updatedWishlist = await wishlistService.removeFromWishlist(productId);
        } else {
          updatedWishlist = await wishlistService.addToWishlist(productId);
        }
        setWishlist(updatedWishlist);
        return;
      } catch {
        // Fallback
      }
    }

    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const addReview = (productId, newReviewData) => {
    const newReview = {
      ...newReviewData,
      id: 'rev_' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvgRating =
            updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: Math.round(newAvgRating * 10) / 10
          };
        }
        return p;
      })
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        wishlist,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addReview,
        cartTotal,
        cartCount,
        refreshProducts
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
