package com.arpon007.netflixclone.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class VideoRequest {
    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 4000, message = "Description cannot be more than 4000 characters")
    private String description;

    @NotEmpty(message = "At least one category must be selected")
    private List<String> categories;

    private Integer duration;
    private Integer year;
    private String rating;
    private String src;
    private String poster;
    private boolean published;

}
