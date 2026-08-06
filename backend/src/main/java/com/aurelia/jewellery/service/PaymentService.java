package com.aurelia.jewellery.service;

import com.aurelia.jewellery.dto.request.PaymentVerificationRequest;
import com.aurelia.jewellery.dto.request.RazorpayOrderRequest;
import com.aurelia.jewellery.dto.response.PaymentResponse;

public interface PaymentService {

    PaymentResponse createRazorpayOrder(RazorpayOrderRequest request, String userEmail);

    PaymentResponse verifyPaymentSignature(PaymentVerificationRequest request, String userEmail);

    PaymentResponse handlePaymentFailure(Long orderId, String reason);
}
