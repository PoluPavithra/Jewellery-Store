package com.aurelia.jewellery.service;

import com.aurelia.jewellery.dto.request.AddToCartRequest;
import com.aurelia.jewellery.dto.request.UpdateCartItemRequest;
import com.aurelia.jewellery.dto.response.CartResponse;

public interface CartService {
    CartResponse getUserCart(String userEmail);
    CartResponse addToCart(String userEmail, AddToCartRequest request);
    CartResponse updateCartItemQuantity(String userEmail, Long cartItemId, UpdateCartItemRequest request);
    CartResponse removeFromCart(String userEmail, Long cartItemId);
    CartResponse clearCart(String userEmail);
}
