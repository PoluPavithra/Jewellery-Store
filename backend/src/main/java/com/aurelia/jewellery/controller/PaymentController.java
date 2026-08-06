package com.aurelia.jewellery.controller;

import com.aurelia.jewellery.dto.request.PaymentVerificationRequest;
import com.aurelia.jewellery.dto.request.RazorpayOrderRequest;
import com.aurelia.jewellery.dto.response.ApiResponse;
import com.aurelia.jewellery.dto.response.PaymentResponse;
import com.aurelia.jewellery.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<PaymentResponse>> createRazorpayOrder(
            @Valid @RequestBody RazorpayOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : "client@aurelia.com";
        PaymentResponse response = paymentService.createRazorpayOrder(request, email);
        return ResponseEntity.ok(ApiResponse.success("Razorpay payment order created", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPaymentSignature(
            @Valid @RequestBody PaymentVerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : "client@aurelia.com";
        PaymentResponse response = paymentService.verifyPaymentSignature(request, email);
        return ResponseEntity.ok(ApiResponse.success("Payment verification result", response));
    }

    @PostMapping("/cancel/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> cancelPayment(
            @PathVariable Long orderId,
            @RequestParam(required = false, defaultValue = "User cancelled payment window") String reason) {
        PaymentResponse response = paymentService.handlePaymentFailure(orderId, reason);
        return ResponseEntity.ok(ApiResponse.success("Payment cancellation processed", response));
    }
}
