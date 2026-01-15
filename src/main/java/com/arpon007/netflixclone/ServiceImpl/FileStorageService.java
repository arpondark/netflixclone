package com.arpon007.netflixclone.ServiceImpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${file.upload.video-dir}")
    private String videoDir;

    @Value("${file.upload.image-dir}")
    private String imageDir;

    /**
     * Save video file to the server
     */
    public String saveVideo(MultipartFile file) throws IOException {
        Files.createDirectories(Paths.get(videoDir));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(videoDir, fileName);
        Files.copy(file.getInputStream(), path);
        return fileName;
    }

    /**
     * Save image file (poster/thumbnail) to the server
     */
    public String saveImage(MultipartFile file) throws IOException {
        Files.createDirectories(Paths.get(imageDir));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(imageDir, fileName);
        Files.copy(file.getInputStream(), path);
        return fileName;
    }

}
