package com.arpon007.netflixclone.controller;

import com.arpon007.netflixclone.DTO.request.VideoRequest;
import com.arpon007.netflixclone.DTO.response.VideoResponse;
import com.arpon007.netflixclone.Service.VideoService;
import jakarta.validation.Valid;
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
            @Valid @RequestPart("data") VideoRequest request,
            @RequestPart("video") MultipartFile video,
            @RequestPart("poster") MultipartFile poster
    ) throws IOException {
        return ResponseEntity.ok(videoService.upload(request, video, poster));
    }

    @GetMapping
    public ResponseEntity<List<VideoResponse>> list() {
        return ResponseEntity.ok(videoService.getAll());
    }
}
