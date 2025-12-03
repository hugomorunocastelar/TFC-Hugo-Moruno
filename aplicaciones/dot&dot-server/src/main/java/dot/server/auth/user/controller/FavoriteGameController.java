package dot.server.auth.user.controller;

import dot.server.auth.payload.response.HttpResponse;
import dot.server.auth.user.service.FavoriteGameService;
import dot.server.data.Match.model.dto.GameDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/favorites")
@CrossOrigin("*")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('REFEREE')")
@Tag(name = "User Favorites", description = "Gestión de partidos favoritos del usuario")
public class FavoriteGameController {

    @Autowired
    private FavoriteGameService favoriteGameService;

    @GetMapping
    @Operation(summary = "Obtener todos los partidos favoritos del usuario")
    public ResponseEntity<?> getUserFavorites(Authentication authentication) {
        String username = authentication.getName();
        List<GameDto> favorites = favoriteGameService.getUserFavorites(username);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/{gameId}")
    @Operation(summary = "Añadir un partido a favoritos")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long gameId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            favoriteGameService.addFavorite(username, gameId);
            return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, "Partido añadido a favoritos"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new HttpResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
        }
    }

    @DeleteMapping("/{gameId}")
    @Operation(summary = "Eliminar un partido de favoritos")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long gameId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            favoriteGameService.removeFavorite(username, gameId);
            return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, "Partido eliminado de favoritos"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new HttpResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
        }
    }

    @GetMapping("/check/{gameId}")
    @Operation(summary = "Verificar si un partido está en favoritos")
    public ResponseEntity<?> checkFavorite(
            @PathVariable Long gameId,
            Authentication authentication) {
        String username = authentication.getName();
        boolean isFavorite = favoriteGameService.isFavorite(username, gameId);
        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, isFavorite));
    }

    @GetMapping("/count")
    @Operation(summary = "Obtener el número total de favoritos del usuario")
    public ResponseEntity<?> countFavorites(Authentication authentication) {
        String username = authentication.getName();
        long count = favoriteGameService.countUserFavorites(username);
        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, count));
    }
}
