package com.arpon007.netflixclone.config;

import com.arpon007.netflixclone.dao.CategoryRepository;
import com.arpon007.netflixclone.entity.Category;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(1) // Run before AdminSeeder
public class CategorySeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        seedCategories();
    }

    private void seedCategories() {
        List<CategoryData> predefinedCategories = Arrays.asList(
            new CategoryData("Action", "High-energy films with physical stunts, chases, and battles"),
            new CategoryData("Adventure", "Exciting stories involving journeys and exploration"),
            new CategoryData("Animation", "Animated films and cartoons for all ages"),
            new CategoryData("Biography", "Stories based on real people's lives"),
            new CategoryData("Comedy", "Humorous content designed to make audiences laugh"),
            new CategoryData("Crime", "Stories involving criminal activities and investigations"),
            new CategoryData("Documentary", "Non-fiction films presenting factual information"),
            new CategoryData("Drama", "Serious, plot-driven narratives with emotional themes"),
            new CategoryData("Family", "Content suitable for all family members"),
            new CategoryData("Fantasy", "Imaginative stories with magical or supernatural elements"),
            new CategoryData("Film-Noir", "Dark, cynical films with crime themes from the 1940s-50s era"),
            new CategoryData("History", "Films set in historical periods or depicting historical events"),
            new CategoryData("Horror", "Frightening content designed to scare and thrill"),
            new CategoryData("Music", "Films centered around music, musicians, or musical performances"),
            new CategoryData("Musical", "Films featuring song and dance as integral storytelling elements"),
            new CategoryData("Mystery", "Suspenseful stories involving solving crimes or puzzles"),
            new CategoryData("Romance", "Love stories and romantic relationships"),
            new CategoryData("Sci-Fi", "Science fiction with futuristic or scientific themes"),
            new CategoryData("Sport", "Films centered around sports and athletic competitions"),
            new CategoryData("Thriller", "Suspenseful, edge-of-your-seat entertainment"),
            new CategoryData("War", "Films depicting warfare and military conflicts"),
            new CategoryData("Western", "Stories set in the American Old West")
        );

        int createdCount = 0;
        int existingCount = 0;

        for (CategoryData categoryData : predefinedCategories) {
            if (!categoryRepository.existsByName(categoryData.name)) {
                Category category = new Category(categoryData.name, categoryData.description);
                categoryRepository.save(category);
                createdCount++;
                log.info("Created category: {}", categoryData.name);
            } else {
                existingCount++;
            }
        }

        log.info("Category seeding completed: {} created, {} already existed", createdCount, existingCount);
    }

    private static class CategoryData {
        String name;
        String description;

        CategoryData(String name, String description) {
            this.name = name;
            this.description = description;
        }
    }
}
