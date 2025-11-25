package dot.server.images.service;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class ImageGetter {

    private final File imagesRoot = new File("images");

    @PostConstruct
    void init() {
        if (!imagesRoot.exists()) imagesRoot.mkdirs();
    }

    public Resource getUserImage(String userId, String filename) {
        File userFolder = new File(imagesRoot, userId);
        File imageFile = new File(userFolder, filename);
        if (imageFile.exists() && imageFile.isFile()) return new FileSystemResource(imageFile);
        return null;
    }

    public List<String> listUserImages(String userId) {
        File userFolder = new File(imagesRoot, userId);
        if (!userFolder.exists() || !userFolder.isDirectory()) return List.of();

        return Arrays.stream(Objects.requireNonNull(userFolder.listFiles()))
                .filter(File::isFile)
                .map(File::getName)
                .collect(Collectors.toList());
    }

    public List<String> listAllImages() {
        if (!imagesRoot.exists() || !imagesRoot.isDirectory()) return List.of();

        return Arrays.stream(Objects.requireNonNull(imagesRoot.listFiles()))
                .filter(File::isFile)
                .map(File::getName)
                .collect(Collectors.toList());
    }
}
