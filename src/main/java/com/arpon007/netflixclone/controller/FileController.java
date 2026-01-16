package com.arpon007.netflixclone.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${file.upload.video-dir}")
    private String videoDir;

    @Value("${file.upload.image-dir}")
    private String imageDir;

    @GetMapping("/video/{filename}")
    public ResponseEntity<org.springframework.core.io.support.ResourceRegion> streamVideo(
            @PathVariable String filename,
            @org.springframework.web.bind.annotation.RequestHeader(value = "Range", required = false) String rangeHeader) {
        try {
            Path filePath = Paths.get(videoDir).resolve(filename).normalize();
            FileSystemResource resource = new FileSystemResource(filePath);

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            long contentLength = resource.contentLength();
            org.springframework.core.io.support.ResourceRegion region;

            if (rangeHeader == null) {
                long rangeLength = Math.min(1024 * 1024, contentLength); // 1MB chunk
                region = new org.springframework.core.io.support.ResourceRegion(resource, 0, rangeLength);
            } else {
                long start = 0;
                long end = contentLength - 1;
                // Basic parsing "bytes=start-end"
                String[] ranges = rangeHeader.replace("bytes=", "").split("-");
                if (ranges.length > 0 && !ranges[0].isEmpty()) {
                    start = Long.parseLong(ranges[0]);
                }
                if (ranges.length > 1 && !ranges[1].isEmpty()) {
                    end = Long.parseLong(ranges[1]);
                }

                long rangeLength = Math.min(1024 * 1024, end - start + 1); // Cap at 1MB per request
                region = new org.springframework.core.io.support.ResourceRegion(resource, start, rangeLength);
            }

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM))
                    .body(region);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(imageDir).resolve(filename).normalize();
            Resource resource = new FileSystemResource(filePath);

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
