package com.aurelia.jewellery.service;

import com.aurelia.jewellery.dto.request.OrderRequest;
import com.aurelia.jewellery.dto.response.OrderResponse;
import com.aurelia.jewellery.model.OrderStatus;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(String userEmail, OrderRequest orderRequest);
    List<OrderResponse> getUserOrders(String userEmail);
    OrderResponse getOrderById(String userEmail, Long orderId);
    OrderResponse getOrderByOrderNumber(String userEmail, String orderNumber);
    OrderResponse updateOrderStatus(Long orderId, OrderStatus status);
    List<OrderResponse> getAllOrdersForAdmin();
}
