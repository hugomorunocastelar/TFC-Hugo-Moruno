package dot.server.images.service;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ImageGetter {
    public Resource getUserImage(String userId, String filename);
    public List<String> listUserImages(String userId);
    public List<String> listAllImages();
}
