package com.aurelia.jewellery.controller;

import com.aurelia.jewellery.dto.response.ApiResponse;
import com.aurelia.jewellery.dto.response.WishlistResponse;
import com.aurelia.jewellery.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<WishlistResponse>> getWishlist(Authentication authentication) {
        WishlistResponse wishlist = wishlistService.getUserWishlist(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Wishlist fetched successfully", wishlist));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(
            Authentication authentication,
            @PathVariable Long productId) {
        WishlistResponse wishlist = wishlistService.addToWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(ApiResponse.success("Product added to wishlist", wishlist));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<WishlistResponse>> removeFromWishlist(
            Authentication authentication,
            @PathVariable Long productId) {
        WishlistResponse wishlist = wishlistService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(ApiResponse.success("Product removed from wishlist", wishlist));
    }
}
