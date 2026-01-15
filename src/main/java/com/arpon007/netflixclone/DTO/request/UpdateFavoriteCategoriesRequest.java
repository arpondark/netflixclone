package com.arpon007.netflixclone.DTO.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateFavoriteCategoriesRequest {

    @NotNull(message = "Favorite categories are required")
    @Size(min = 1, max = 3, message = "You must select between 1 and 3 favorite categories")
    private Set<String> favoriteCategories;
}
