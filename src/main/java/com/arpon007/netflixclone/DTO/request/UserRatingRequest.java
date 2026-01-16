package com.arpon007.netflixclone.DTO.request;

import lombok.Data;

@Data
public class UserRatingRequest {
    private Long videoId;
    private Integer rating;
}
