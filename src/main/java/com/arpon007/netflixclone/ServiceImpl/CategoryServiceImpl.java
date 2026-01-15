package com.arpon007.netflixclone.ServiceImpl;

import com.arpon007.netflixclone.DTO.response.CategoryResponse;
import com.arpon007.netflixclone.Service.CategoryService;
import com.arpon007.netflixclone.dao.CategoryRepository;
import com.arpon007.netflixclone.entity.Category;
import com.arpon007.netflixclone.exception.ResourceNotFoundExCeption;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findAll()
                .stream()
                .filter(Category::isActive)
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExCeption("Category not found with id: " + id));
        return CategoryResponse.from(category);
    }
}
