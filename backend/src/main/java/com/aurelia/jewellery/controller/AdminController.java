package com.aurelia.jewellery.controller;

import com.aurelia.jewellery.dto.response.ApiResponse;
import com.aurelia.jewellery.dto.response.OrderResponse;
import com.aurelia.jewellery.dto.response.ProductResponse;
import com.aurelia.jewellery.dto.response.UserResponse;
import com.aurelia.jewellery.model.OrderStatus;
import com.aurelia.jewellery.model.Role;
import com.aurelia.jewellery.model.User;
import com.aurelia.jewellery.repository.OrderRepository;
import com.aurelia.jewellery.repository.ProductRepository;
import com.aurelia.jewellery.repository.UserRepository;
import com.aurelia.jewellery.service.OrderService;
import com.aurelia.jewellery.service.ProductService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;
    private final ProductService productService;

    @Data
    @Builder
    public static class AdminStatsResponse {
        private long totalProducts;
        private long totalOrders;
        private long totalCustomers;
        private BigDecimal totalRevenue;
        private long lowStockCount;
        private long pendingOrdersCount;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalCustomers = userRepository.count();

        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long lowStockCount = productRepository.findAll().stream()
                .filter(p -> p.getStock() != null && p.getStock() < 5)
                .count();

        long pendingOrdersCount = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == OrderStatus.PENDING || o.getStatus() == OrderStatus.PROCESSING)
                .count();

        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .totalRevenue(totalRevenue)
                .lowStockCount(lowStockCount)
                .pendingOrdersCount(pendingOrdersCount)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics fetched successfully", stats));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(ApiResponse.success("All customer orders retrieved", orders));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        OrderResponse updated = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated to " + status, updated));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllCustomers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId())
                        .email(u.getEmail())
                        .fullName(u.getFullName())
                        .phone(u.getPhone())
                        .role(u.getRole().name())
                        .createdAt(u.getCreatedAt() != null ? u.getCreatedAt().toString() : null)
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Customer registry retrieved", users));
    }

    @PutMapping("/customers/{userId}/role")
    public ResponseEntity<ApiResponse<Map<String, String>>> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(role.toUpperCase()));
        userRepository.save(user);

        Map<String, String> res = new HashMap<>();
        res.put("message", "User role updated to " + role);
        return ResponseEntity.ok(ApiResponse.success("Role updated", res));
    }
}
