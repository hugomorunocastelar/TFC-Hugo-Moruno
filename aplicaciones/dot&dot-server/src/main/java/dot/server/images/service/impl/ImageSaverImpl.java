package dot.server.images.service.impl;

import dot.server.images.service.ImageSaver;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Component
public class ImageSaverImpl implements ImageSaver {

    private final File imagesRoot = new File("images");

    @PostConstruct
    void init() {
        if (!imagesRoot.exists()) imagesRoot.mkdirs();
    }

    @Override
    public String saveUserImage(String userId, MultipartFile image) throws IOException {
        File userFolder = new File(imagesRoot, userId);

        if (!userFolder.exists()) userFolder.mkdirs();

        String extension = getExtension(image.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;

        File destino = new File(userFolder, filename);

        image.transferTo(destino);

        return filename;
    }

    private String getExtension(String originalName) {
        if (originalName == null) return "";
        int dotIndex = originalName.lastIndexOf('.');
        return (dotIndex >= 0) ? originalName.substring(dotIndex) : "";
    }
}
