package dot.server.auth.user.service;

import dot.server.auth.user.model.FavoriteGame;
import dot.server.auth.user.model.User;
import dot.server.auth.user.repository.FavoriteGameRepository;
import dot.server.auth.user.repository.UserRepository;
import dot.server.data.Match.model.Game;
import dot.server.data.Match.model.dto.GameDto;
import dot.server.data.Match.repository.GameRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteGameService {

    @Autowired
    private FavoriteGameRepository favoriteGameRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    public List<GameDto> getUserFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        List<Game> games = favoriteGameRepository.findGamesByUser(user);
        return games.stream()
                .map(game -> new GameDto().to(game))
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoriteGame addFavorite(String username, Long gameId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        
        if (favoriteGameRepository.existsByUserAndGame(user, game)) {
            throw new RuntimeException("El partido ya está en favoritos");
        }

        FavoriteGame favorite = new FavoriteGame(user, game);
        return favoriteGameRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(String username, Long gameId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        favoriteGameRepository.deleteByUserAndGame(user, game);
    }

    public boolean isFavorite(String username, Long gameId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        return favoriteGameRepository.existsByUserAndGame(user, game);
    }

    public long countUserFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return favoriteGameRepository.countByUser(user);
    }
}
