package dot.server.images.controller;

import dot.server.auth.jwt.JwtUtils;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.images.service.ImageGetter;
import dot.server.images.service.ImageSaver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;

@RestController
@CrossOrigin("*")
@RequestMapping("/image")
public class ImageController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private ImageSaver saver;

    @Autowired
    private ImageGetter getter;

    @PostMapping("/save")
    public ResponseEntity<?> uploadUserImage(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String token
    ) {
        if (file.isEmpty())
            return ResponseEntity.badRequest().body(new HttpResponse(HttpStatus.BAD_REQUEST, "El archivo está vacío"));

        String userId = jwtUtils.getUserNameFromJwtToken(token.substring(7));

        try {
            String filename = saver.saveUserImage(userId, file);
            return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, filename));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR,"Error guardando la imagen"));
        }
    }

    @GetMapping("/get/{filename}")
    public ResponseEntity<?> getUserImage(
            @RequestHeader("Authorization") String token,
            @PathVariable String filename
    ) {
        if (filename.isEmpty()) return ResponseEntity.ok(new HttpResponse(HttpStatus.BAD_REQUEST, "Debes especificar un nombre de imagen."));

        String userId = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        Resource image = getter.getUserImage(userId, filename);

        if (image == null || !image.exists()) return ResponseEntity.ok(new HttpResponse(HttpStatus.NOT_FOUND, "Imagen no encontrada"));

        try {
            String mime = Files.probeContentType(image.getFile().toPath());
            if (mime == null) mime = MediaType.APPLICATION_OCTET_STREAM_VALUE;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, mime)
                    .body(new HttpResponse(HttpStatus.OK, image.getContentAsByteArray()));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
