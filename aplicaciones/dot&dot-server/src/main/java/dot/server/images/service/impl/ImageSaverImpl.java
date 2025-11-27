package dot.server.images.service.impl;

import dot.server.images.service.ImageSaver;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Component
public class ImageSaverImpl implements ImageSaver {

    @Value("${images.folder.path}")
    private String imagesUrl;

    private File imagesRoot;

    @PostConstruct
    void init() {
        imagesRoot = new File(imagesUrl);
        if (!imagesRoot.exists()) imagesRoot.mkdirs();
    }

    @Override
    public String saveUserImage(String userId, MultipartFile image) {
        File userFolder = new File(imagesRoot, userId);

        if (!userFolder.exists()) userFolder.mkdirs();

        String filename = image.getOriginalFilename();

        assert filename != null;
        File destino = new File(userFolder, filename);

        try {
            image.transferTo(destino);
            return filename;
        } catch (Exception e) {
            return null;
        }
    }

    private String getExtension(String originalName) {
        if (originalName == null) return "";
        int dotIndex = originalName.lastIndexOf('.');
        return (dotIndex >= 0) ? originalName.substring(dotIndex) : "";
    }
}
