package com.arpon007.netflixclone.Service;

import com.arpon007.netflixclone.DTO.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();

    List<CategoryResponse> getActiveCategories();

    CategoryResponse getCategoryById(Long id);
}
