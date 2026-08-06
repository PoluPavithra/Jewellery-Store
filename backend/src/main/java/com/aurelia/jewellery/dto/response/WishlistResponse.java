package com.aurelia.jewellery.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class WishlistResponse {
    private Long id;
    private List<ProductResponse> products;
    private Integer totalItems;
}
