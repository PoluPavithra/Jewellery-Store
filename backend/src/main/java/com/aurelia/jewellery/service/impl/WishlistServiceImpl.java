package com.aurelia.jewellery.service.impl;

import com.aurelia.jewellery.dto.response.ProductResponse;
import com.aurelia.jewellery.dto.response.WishlistResponse;
import com.aurelia.jewellery.exception.ResourceNotFoundException;
import com.aurelia.jewellery.model.Product;
import com.aurelia.jewellery.model.User;
import com.aurelia.jewellery.model.Wishlist;
import com.aurelia.jewellery.repository.ProductRepository;
import com.aurelia.jewellery.repository.UserRepository;
import com.aurelia.jewellery.repository.WishlistRepository;
import com.aurelia.jewellery.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public WishlistResponse getUserWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Wishlist wishlist = getOrCreateWishlist(user);
        return mapToWishlistResponse(wishlist);
    }

    @Override
    @Transactional
    public WishlistResponse addToWishlist(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Wishlist wishlist = getOrCreateWishlist(user);
        wishlist.getProducts().add(product);
        wishlistRepository.save(wishlist);

        return mapToWishlistResponse(wishlist);
    }

    @Override
    @Transactional
    public WishlistResponse removeFromWishlist(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Wishlist wishlist = getOrCreateWishlist(user);
        wishlist.getProducts().remove(product);
        wishlistRepository.save(wishlist);

        return mapToWishlistResponse(wishlist);
    }

    private Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wishlist newWishlist = Wishlist.builder().user(user).build();
                    return wishlistRepository.save(newWishlist);
                });
    }

    private WishlistResponse mapToWishlistResponse(Wishlist wishlist) {
        List<ProductResponse> products = wishlist.getProducts().stream()
                .map(product -> ProductResponse.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .primaryImageUrl(product.getPrimaryImageUrl())
                        .images(product.getImages())
                        .categoryId(product.getCategory().getId())
                        .categoryName(product.getCategory().getName())
                        .isNew(product.getIsNew())
                        .isFeatured(product.getIsFeatured())
                        .isNewArrival(product.getIsNewArrival())
                        .material(product.getMaterial())
                        .gemstone(product.getGemstone())
                        .weight(product.getWeight())
                        .rating(product.getRating())
                        .reviewCount(product.getReviewCount())
                        .stock(product.getStock())
                        .build())
                .collect(Collectors.toList());

        return WishlistResponse.builder()
                .id(wishlist.getId())
                .products(products)
                .totalItems(products.size())
                .build();
    }
}
