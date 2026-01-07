package com.arpon007.netflixclone.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoStatsResponse {

    private Long totalViews;
    private Long publishedVideos;
    private Long totalDuration;
}
