package com.aurelia.jewellery.service.impl;

import com.aurelia.jewellery.dto.request.AddToCartRequest;
import com.aurelia.jewellery.dto.request.UpdateCartItemRequest;
import com.aurelia.jewellery.dto.response.CartItemResponse;
import com.aurelia.jewellery.dto.response.CartResponse;
import com.aurelia.jewellery.dto.response.ProductResponse;
import com.aurelia.jewellery.exception.BadRequestException;
import com.aurelia.jewellery.exception.ResourceNotFoundException;
import com.aurelia.jewellery.model.*;
import com.aurelia.jewellery.repository.CartItemRepository;
import com.aurelia.jewellery.repository.CartRepository;
import com.aurelia.jewellery.repository.ProductRepository;
import com.aurelia.jewellery.repository.UserRepository;
import com.aurelia.jewellery.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getUserCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(String userEmail, AddToCartRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStock() + ")");
        }

        Cart cart = getOrCreateCart(user);

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStock() + ")");
            }
            existingItem.setQuantity(newQuantity);
            if (request.getSelectedSize() != null) {
                existingItem.setSelectedSize(request.getSelectedSize());
            }
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .selectedSize(request.getSelectedSize())
                    .build();
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }

        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItemQuantity(String userEmail, Long cartItemId, UpdateCartItemRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to the user's cart");
        }

        if (cartItem.getProduct().getStock() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(String userEmail, Long cartItemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to user's cart");
        }

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse clearCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToCartResponse(cart);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> {
                    BigDecimal total = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    ProductResponse pResp = ProductResponse.builder()
                            .id(item.getProduct().getId())
                            .name(item.getProduct().getName())
                            .price(item.getProduct().getPrice())
                            .primaryImageUrl(item.getProduct().getPrimaryImageUrl())
                            .categoryId(item.getProduct().getCategory().getId())
                            .categoryName(item.getProduct().getCategory().getName())
                            .stock(item.getProduct().getStock())
                            .build();

                    return CartItemResponse.builder()
                            .id(item.getId())
                            .product(pResp)
                            .quantity(item.getQuantity())
                            .selectedSize(item.getSelectedSize())
                            .itemTotal(total)
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::getItemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = itemResponses.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .build();
    }
}
