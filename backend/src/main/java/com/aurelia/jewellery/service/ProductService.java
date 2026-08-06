package com.aurelia.jewellery.service;

import com.aurelia.jewellery.dto.request.ProductRequest;
import com.aurelia.jewellery.dto.response.ProductResponse;
import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(Long id);
    List<ProductResponse> getProductsByCategory(String categorySlug);
    List<ProductResponse> getFeaturedProducts();
    List<ProductResponse> getNewArrivals();
    List<ProductResponse> filterProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice);
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}
