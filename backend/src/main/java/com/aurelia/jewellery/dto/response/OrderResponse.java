package com.aurelia.jewellery.dto.response;

import com.aurelia.jewellery.dto.request.AddressDto;
import com.aurelia.jewellery.model.OrderStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private AddressDto shippingAddress;
    private LocalDateTime createdAt;
}
