package com.aurelia.jewellery.service.impl;

import com.aurelia.jewellery.dto.request.AddressDto;
import com.aurelia.jewellery.dto.request.OrderRequest;
import com.aurelia.jewellery.dto.response.OrderItemResponse;
import com.aurelia.jewellery.dto.response.OrderResponse;
import com.aurelia.jewellery.dto.response.ProductResponse;
import com.aurelia.jewellery.exception.BadRequestException;
import com.aurelia.jewellery.exception.ResourceNotFoundException;
import com.aurelia.jewellery.model.*;
import com.aurelia.jewellery.repository.CartRepository;
import com.aurelia.jewellery.repository.OrderRepository;
import com.aurelia.jewellery.repository.ProductRepository;
import com.aurelia.jewellery.repository.UserRepository;
import com.aurelia.jewellery.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(String userEmail, OrderRequest orderRequest) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty or not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create an order with an empty cart");
        }

        // Validate stock
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getStock() < item.getQuantity()) {
                throw new BadRequestException("Product " + item.getProduct().getName() + " does not have enough stock");
            }
        }

        String orderNumber = "AUR-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        AddressDto shipAddr = orderRequest.getShippingAddress();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .status(OrderStatus.PENDING)
                .shippingStreet(shipAddr.getStreet())
                .shippingCity(shipAddr.getCity())
                .shippingState(shipAddr.getState())
                .shippingPostalCode(shipAddr.getPostalCode())
                .shippingCountry(shipAddr.getCountry())
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();

            // Deduct stock
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            BigDecimal itemPrice = product.getPrice();
            BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(item.getQuantity())
                    .priceAtPurchase(itemPrice)
                    .selectedSize(item.getSelectedSize())
                    .build();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after placing order
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Order does not belong to the user");
        }

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String userEmail, String orderNumber) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Order does not belong to the user");
        }

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrdersForAdmin() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponse(updatedOrder);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    BigDecimal total = item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity()));
                    ProductResponse pResp = ProductResponse.builder()
                            .id(item.getProduct().getId())
                            .name(item.getProduct().getName())
                            .price(item.getProduct().getPrice())
                            .primaryImageUrl(item.getProduct().getPrimaryImageUrl())
                            .categoryId(item.getProduct().getCategory().getId())
                            .categoryName(item.getProduct().getCategory().getName())
                            .build();

                    return OrderItemResponse.builder()
                            .id(item.getId())
                            .product(pResp)
                            .quantity(item.getQuantity())
                            .priceAtPurchase(item.getPriceAtPurchase())
                            .selectedSize(item.getSelectedSize())
                            .itemTotal(total)
                            .build();
                })
                .collect(Collectors.toList());

        AddressDto addressDto = AddressDto.builder()
                .street(order.getShippingStreet())
                .city(order.getShippingCity())
                .state(order.getShippingState())
                .postalCode(order.getShippingPostalCode())
                .country(order.getShippingCountry())
                .build();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .items(itemResponses)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(addressDto)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
