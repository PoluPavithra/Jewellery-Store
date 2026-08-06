package com.aurelia.jewellery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String primaryImageUrl;
    private List<String> images;
    private Long categoryId;
    private String categoryName;
    private Boolean isNew;
    private Boolean isFeatured;
    private Boolean isNewArrival;
    private String material;
    private String gemstone;
    private String weight;
    private BigDecimal rating;
    private Integer reviewCount;
    private Integer stock;
}
