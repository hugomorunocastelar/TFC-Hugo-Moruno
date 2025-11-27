package dot.server.images.service.impl;

import dot.server.images.service.ImageGetter;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class ImageGetterImpl implements ImageGetter {

    @Value("${images.folder.path}")
    private String imagesUrl;

    private File imagesRoot;

    @PostConstruct
    void init() {
        imagesRoot = new File(imagesUrl);
        if (!imagesRoot.exists()) imagesRoot.mkdirs();
    }

    @Override
    public Resource getUserImage(String userId, String filename) {
        File userFolder = new File(imagesRoot, userId);
        File imageFile = new File(userFolder, filename);
        if (imageFile.exists() && imageFile.isFile()) return new FileSystemResource(imageFile);
        return null;
    }

    @Override
    public List<String> listUserImages(String userId) {
        File userFolder = new File(imagesRoot, userId);
        if (!userFolder.exists() || !userFolder.isDirectory()) return List.of();

        return Arrays.stream(Objects.requireNonNull(userFolder.listFiles()))
                .filter(File::isFile)
                .map(File::getName)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> listAllImages() {
        if (!imagesRoot.exists() || !imagesRoot.isDirectory()) return List.of();

        return Arrays.stream(Objects.requireNonNull(imagesRoot.listFiles()))
                .filter(File::isFile)
                .map(File::getName)
                .collect(Collectors.toList());
    }
}
