package com.aurelia.jewellery.service;

import com.aurelia.jewellery.dto.response.WishlistResponse;

public interface WishlistService {
    WishlistResponse getUserWishlist(String userEmail);
    WishlistResponse addToWishlist(String userEmail, Long productId);
    WishlistResponse removeFromWishlist(String userEmail, Long productId);
}
