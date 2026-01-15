package com.arpon007.netflixclone.ServiceImpl;

import com.arpon007.netflixclone.DTO.request.VideoRequest;
import com.arpon007.netflixclone.DTO.response.VideoResponse;
import com.arpon007.netflixclone.Service.VideoService;
import com.arpon007.netflixclone.dao.VideoRepository;
import com.arpon007.netflixclone.entity.Video;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

    private final VideoRepository videoRepository;
    private final FileStorageService fileStorageService;

    @Override
    public VideoResponse upload(VideoRequest request, MultipartFile videoFile, MultipartFile posterFile) throws IOException {

        Video video = new Video();

        // Map all required fields from request
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());

        // Set optional fields
        video.setYear(request.getYear());
        video.setRating(request.getRating());
        video.setDuration(request.getDuration());
        video.setPublished(request.isPublished());

        // Set categories (required)
        if (request.getCategories() != null && !request.getCategories().isEmpty()) {
            video.setCategories(request.getCategories());
        }

        // Save video file (required)
        video.setSrcUuid(fileStorageService.saveVideo(videoFile));

        // Save poster image (required)
        if (posterFile != null && !posterFile.isEmpty()) {
            video.setPosterUuid(fileStorageService.saveImage(posterFile));
        } else {
            throw new IllegalArgumentException("Poster image is required");
        }

        Video saved = videoRepository.save(video);

        return VideoResponse.from(saved);
    }

    @Override
    public List<VideoResponse> getAll() {
        return videoRepository.findAll()
                .stream()
                .map(VideoResponse::from)
                .toList();
    }

    @Override
    public Video getById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }
}
