package com.aurelia.jewellery.config;

import com.aurelia.jewellery.model.*;
import com.aurelia.jewellery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (categoryRepository.count() == 0) {
            seedCategoriesAndProducts();
        }
    }

    private void seedUsers() {
        User admin = User.builder()
                .email("admin@aurelia.com")
                .password(passwordEncoder.encode("Admin@123"))
                .fullName("Aurelia Administrator")
                .phone("+1 800 555 0199")
                .role(Role.ROLE_ADMIN)
                .build();
        User savedAdmin = userRepository.save(admin);
        cartRepository.save(Cart.builder().user(savedAdmin).build());
        wishlistRepository.save(Wishlist.builder().user(savedAdmin).build());

        User customer = User.builder()
                .email("client@aurelia.com")
                .password(passwordEncoder.encode("Client@123"))
                .fullName("Eleanor Vance")
                .phone("+1 212 555 0142")
                .role(Role.ROLE_USER)
                .build();
        User savedCustomer = userRepository.save(customer);
        cartRepository.save(Cart.builder().user(savedCustomer).build());
        wishlistRepository.save(Wishlist.builder().user(savedCustomer).build());
    }

    private void seedCategoriesAndProducts() {
        Category rings = categoryRepository.save(Category.builder()
                .name("Rings")
                .slug("rings")
                .description("Handcrafted solid gold and platinum diamond rings.")
                .imageUrl("https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop")
                .build());

        Category necklaces = categoryRepository.save(Category.builder()
                .name("Necklaces")
                .slug("necklaces")
                .description("Timeless pendants, pearl strands, and diamond chokers.")
                .imageUrl("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop")
                .build());

        Category earrings = categoryRepository.save(Category.builder()
                .name("Earrings")
                .slug("earrings")
                .description("Brilliant diamond studs, drop earrings, and gold hoops.")
                .imageUrl("https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop")
                .build());

        Category bracelets = categoryRepository.save(Category.builder()
                .name("Bracelets")
                .slug("bracelets")
                .description("Eternity tennis bracelets and delicate chain wristlets.")
                .imageUrl("https://images.unsplash.com/photo-1708220040823-7171b8369b38?q=80&w=800&auto=format&fit=crop")
                .build());

        Category bangles = categoryRepository.save(Category.builder()
                .name("Bangles")
                .slug("bangles")
                .description("Imperial solid 22k gold bangles and diamond cuff bangles.")
                .imageUrl("https://images.unsplash.com/photo-1708221235465-0c63b2e4f813?q=80&w=800&auto=format&fit=crop")
                .build());

        // Products
        Product p1 = Product.builder()
                .name("Aurelia Solitaire Diamond Ring")
                .description("An exquisite 2.5 carat round brilliant diamond solitaire set in handcrafted 18k yellow gold with micro-pavié band.")
                .price(BigDecimal.valueOf(3450))
                .primaryImageUrl("https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop")
                .images(List.of(
                        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
                ))
                .category(rings)
                .isNew(true)
                .isFeatured(true)
                .isNewArrival(true)
                .material("18k Yellow Gold")
                .gemstone("2.5ct Round Diamond")
                .weight("4.2g")
                .rating(BigDecimal.valueOf(4.9))
                .reviewCount(24)
                .stock(5)
                .build();

        Product p2 = Product.builder()
                .name("Imperial Sapphire Pendant Necklace")
                .description("Deep royal blue oval natural sapphire surrounded by a brilliant halo of VS diamonds on a delicate 18k white gold chain.")
                .price(BigDecimal.valueOf(1280))
                .primaryImageUrl("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop")
                .images(List.of(
                        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"
                ))
                .category(necklaces)
                .isNew(false)
                .isFeatured(true)
                .isNewArrival(false)
                .material("18k White Gold")
                .gemstone("Natural Blue Sapphire & Diamonds")
                .weight("5.1g")
                .rating(BigDecimal.valueOf(4.8))
                .reviewCount(18)
                .stock(8)
                .build();

        Product p3 = Product.builder()
                .name("Emerald Royal Gold Bangle")
                .description("Ornate handcrafted 22k yellow gold bangle embellished with vivid natural Zambian emerald accents and hand-engraved filigree.")
                .price(BigDecimal.valueOf(1850))
                .primaryImageUrl("https://images.unsplash.com/photo-1708221235465-0c63b2e4f813?q=80&w=800&auto=format&fit=crop")
                .images(List.of(
                        "https://images.unsplash.com/photo-1708221235465-0c63b2e4f813?q=80&w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
                ))
                .category(bangles)
                .isNew(true)
                .isFeatured(true)
                .isNewArrival(true)
                .material("22k Yellow Gold")
                .gemstone("Natural Emeralds")
                .weight("18.5g")
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(14)
                .stock(4)
                .build();

        Product p4 = Product.builder()
                .name("Eternity Tennis Diamond Bracelet")
                .description("A seamless strand of hand-matched round brilliant diamonds set in a four-prong 18k white gold tennis bracelet frame.")
                .price(BigDecimal.valueOf(2400))
                .primaryImageUrl("https://images.unsplash.com/photo-1639065643006-e217c4fee12e?q=80&w=800&auto=format&fit=crop")
                .images(List.of(
                        "https://images.unsplash.com/photo-1639065643006-e217c4fee12e?q=80&w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1708220040823-7171b8369b38?q=80&w=800&auto=format&fit=crop"
                ))
                .category(bracelets)
                .isNew(true)
                .isFeatured(true)
                .isNewArrival(true)
                .material("18k White Gold")
                .gemstone("Round Brilliant Diamonds (3.0 ctw)")
                .weight("11.2g")
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(19)
                .stock(6)
                .build();

        productRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
    }
}
