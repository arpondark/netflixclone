package com.arpon007.netflixclone.controller;

import com.arpon007.netflixclone.DTO.request.VideoRequest;
import com.arpon007.netflixclone.DTO.response.VideoResponse;
import com.arpon007.netflixclone.Service.VideoService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor

public class VideoController {
    private final VideoService videoService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VideoResponse> uplloadVideo(
            @RequestPart("data")VideoRequest request,
            @RequestPart("video") MultipartFile video
            )throws IOException {
        return ResponseEntity.ok(videoService.upload(request,video));

    }
    @GetMapping
    public ResponseEntity<List<VideoResponse>> list() {
        return ResponseEntity.ok(videoService.getAll());
    }
}
