package com.arpon007.netflixclone.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "videos")
@Data
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long video_id;

    private String title;
    @Column(length = 4000)
    private String description;
    private Integer year;
    private String rating;
    @Column(name = "src")
    @JsonIgnore
    private String srcUuid;
    private String poster;
    private Integer duration;
    @Column(nullable = false)
    private boolean published=false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "video_categories", joinColumns = @JoinColumn(name = "video_id"))
    @Column(name = "category")
    private List<String> categories=new ArrayList<>();
    @Column(name = "poster", insertable = false, updatable = false)
    private String posterUuid;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @Transient
    @JsonProperty("isInWatchList")
    private Boolean isInWatchList;

    @JsonProperty("src")
    public String getSrc() {
        if (srcUuid != null && !srcUuid.isEmpty()) {
            String baseUrl = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .toUriString();
            return baseUrl + "/api/files/video/" + srcUuid;
        }
        return null;
    }

    @JsonProperty("poster")
    public String getPoster() {
        if (posterUuid != null && !posterUuid.isEmpty()) {
            String baseUrl = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .toUriString();
            return baseUrl + "/api/files/video/" + posterUuid;
        }
        return null;
    }


}
