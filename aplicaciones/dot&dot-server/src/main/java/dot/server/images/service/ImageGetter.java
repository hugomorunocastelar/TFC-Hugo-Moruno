package dot.server.images.service;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ImageGetter {
    Resource getUserImage(String userId, String filename);
    List<String> listUserImages(String userId);
    List<String> listAllImages();
}
