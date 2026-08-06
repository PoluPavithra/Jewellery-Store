package com.aurelia.jewellery.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    @NotNull(message = "Shipping address is required")
    @Valid
    private AddressDto shippingAddress;
}
