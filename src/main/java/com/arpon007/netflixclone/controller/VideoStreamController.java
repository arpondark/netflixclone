package com.arpon007.netflixclone.controller;

import com.arpon007.netflixclone.Service.VideoService;
import com.arpon007.netflixclone.entity.Video;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoStreamController {

    private final VideoService videoService;

    @GetMapping("/stream/{id}")
    public ResponseEntity<Resource> stream(@PathVariable Long id) throws Exception {

        Video video = videoService.getById(id);

        Path path = Paths.get("uploads/videos", video.getSrcUuid());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
