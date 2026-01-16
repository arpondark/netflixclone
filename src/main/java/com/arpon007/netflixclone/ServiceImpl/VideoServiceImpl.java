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

    private final com.arpon007.netflixclone.dao.UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<VideoResponse> getAll() {
        List<VideoResponse> responses = videoRepository.findAll()
                .stream()
                .map(VideoResponse::from)
                .toList();

        try {
            String email = org.springframework.security.core.context.SecurityContextHolder.getContext()
                    .getAuthentication().getName();
            if (email != null && !email.equals("anonymousUser")) {
                com.arpon007.netflixclone.entity.User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    java.util.Set<Long> watchlistIds = user.getWatchList().stream()
                            .map(Video::getVideo_id)
                            .collect(java.util.stream.Collectors.toSet());

                    responses.forEach(v -> v.setIsWatchList(watchlistIds.contains(v.getId())));
                }
            }
        } catch (Exception e) {
            // Ignore if no auth or error
        }

        return responses;
    }

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
    public Video getById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    @Override
    public VideoResponse update(Long id, com.arpon007.netflixclone.DTO.request.UpdateVideoRequest request,
            MultipartFile poster) throws IOException {
        Video video = getById(id);

        if (request.getTitle() != null) {
            video.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            video.setDescription(request.getDescription());
        }

        if (poster != null && !poster.isEmpty()) {
            // Delete old poster if exists (optional cleanup)
            // Save new poster
            video.setPosterUuid(fileStorageService.saveImage(poster));
        }

        Video updatedVideo = videoRepository.save(video);
        return VideoResponse.from(updatedVideo);
    }

    @Override
    public void delete(Long id) {
        Video video = getById(id);
        // Delete files (optional: implement file deletion in FileStorageService)
        // fileStorageService.deleteFile(video.getSrcUuid());
        // fileStorageService.deleteFile(video.getPosterUuid());

        videoRepository.delete(video);
    }
}
