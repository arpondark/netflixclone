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
    public VideoResponse upload(VideoRequest request, MultipartFile videoFile) throws IOException {

        Video video = new Video();

        // map ONLY existing entity fields
        video.setTitle(request.getTitle());
        video.setSrcUuid(fileStorageService.saveVideo(videoFile));

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
