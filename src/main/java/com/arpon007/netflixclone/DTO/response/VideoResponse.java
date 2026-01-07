package com.arpon007.netflixclone.DTO.response;


import com.arpon007.netflixclone.entity.Video;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor

public class VideoResponse {
    private Long id;
    private String title;
    private String description;
    private Integer year;
    private String rating;
    private Integer duration;
    private String src;
    private String poster;
    private boolean published;
    private List<String> categories;
    private Instant createdAt;
    private Instant updatedAt;
    private Boolean isWatchList;

    public VideoResponse(Long id, String title, String description, Integer year, String rating, Integer duration, String src, String poster, boolean published, List<String> categories, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.year = year;
        this.rating = rating;
        this.duration = duration;
        this.src = src;
        this.poster = poster;
        this.published = published;
        this.categories = categories;
    }
    public static VideoResponse from(Video video){
        VideoResponse response = new VideoResponse(video.getVideo_id(), video.getTitle(), video.getDescription(), video.getYear(), video.getRating(), video.getDuration(), video.getSrc(), video.getPoster(), video.isPublished(), video.getCategories(), video.getCreatedAt(), video.getUpdatedAt());
        if(video.getIsInWatchList()!=null){
            response.setIsWatchList(video.getIsInWatchList());
        }
        return response;
    }

}
