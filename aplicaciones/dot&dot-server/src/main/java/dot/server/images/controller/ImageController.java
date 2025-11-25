package dot.server.images.controller;

import dot.server.images.service.ImageGetter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;

@RestController
@CrossOrigin("*")
@RequestMapping("/image")
public class ImageController {

    @Autowired
    private ImageGetter imageGetter;

    @GetMapping("/{userId}/{filename}")
    public ResponseEntity<byte[]> getUserImage(
            @PathVariable String userId,
            @PathVariable String filename
    ) {
        Resource image = imageGetter.getUserImage(userId, filename);

        if (image == null || !image.exists()) return ResponseEntity.notFound().build();

        try {
            String mime = Files.probeContentType(image.getFile().toPath());
            if (mime == null) mime = MediaType.APPLICATION_OCTET_STREAM_VALUE;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, mime)
                    .body(image.getContentAsByteArray());

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
