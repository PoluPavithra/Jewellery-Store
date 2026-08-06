package com.aurelia.jewellery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private String razorpayOrderId;
    private String razorpayKeyId;
    private Long orderId;
    private Double amount;
    private String currency;
    private String status; // CREATED, PAID, FAILED
    private String message;
}
