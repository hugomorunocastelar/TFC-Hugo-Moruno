package dot.server.images.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface ImageSaver {
    String saveUserImage(String userId, MultipartFile image) throws IOException;
}
