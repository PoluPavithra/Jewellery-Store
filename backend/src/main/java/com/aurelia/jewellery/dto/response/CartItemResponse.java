package com.aurelia.jewellery.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class CartItemResponse {
    private Long id;
    private ProductResponse product;
    private Integer quantity;
    private String selectedSize;
    private BigDecimal itemTotal;
}
