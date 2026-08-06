package com.aurelia.jewellery.service.impl;

import com.aurelia.jewellery.dto.request.ProductRequest;
import com.aurelia.jewellery.dto.response.ProductResponse;
import com.aurelia.jewellery.exception.ResourceNotFoundException;
import com.aurelia.jewellery.model.Category;
import com.aurelia.jewellery.model.Product;
import com.aurelia.jewellery.repository.CategoryRepository;
import com.aurelia.jewellery.repository.ProductRepository;
import com.aurelia.jewellery.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getProductsByCategory(String categorySlug) {
        return productRepository.findByCategorySlug(categorySlug).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> filterProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.filterProducts(keyword, categoryId, minPrice, maxPrice).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        List<String> images = request.getImages() != null ? request.getImages() : new ArrayList<>();
        if (!images.contains(request.getPrimaryImageUrl())) {
            images.add(0, request.getPrimaryImageUrl());
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .primaryImageUrl(request.getPrimaryImageUrl())
                .images(images)
                .category(category)
                .isNew(request.getIsNew() != null ? request.getIsNew() : false)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .isNewArrival(request.getIsNewArrival() != null ? request.getIsNewArrival() : false)
                .material(request.getMaterial())
                .gemstone(request.getGemstone())
                .weight(request.getWeight())
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(0)
                .stock(request.getStock())
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setPrimaryImageUrl(request.getPrimaryImageUrl());
        product.setCategory(category);
        if (request.getImages() != null) {
            product.setImages(request.getImages());
        }
        if (request.getIsNew() != null) product.setIsNew(request.getIsNew());
        if (request.getIsFeatured() != null) product.setIsFeatured(request.getIsFeatured());
        if (request.getIsNewArrival() != null) product.setIsNewArrival(request.getIsNewArrival());
        product.setMaterial(request.getMaterial());
        product.setGemstone(request.getGemstone());
        product.setWeight(request.getWeight());
        product.setStock(request.getStock());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .primaryImageUrl(product.getPrimaryImageUrl())
                .images(product.getImages())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .isNew(product.getIsNew())
                .isFeatured(product.getIsFeatured())
                .isNewArrival(product.getIsNewArrival())
                .material(product.getMaterial())
                .gemstone(product.getGemstone())
                .weight(product.getWeight())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .stock(product.getStock())
                .build();
    }
}
