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

    /*
    this function is for save video file to the server
     */
    public String saveVideo(MultipartFile file) throws IOException {
        Files.createDirectories(Paths.get(videoDir));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(videoDir, fileName);
        Files.copy(file.getInputStream(), Paths.get(videoDir).resolve(fileName));
        return fileName;
    }


}
