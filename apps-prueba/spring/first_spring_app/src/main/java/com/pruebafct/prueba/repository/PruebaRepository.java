package com.pruebafct.prueba.repository;

import com.pruebafct.prueba.model.ObjetoPrueba;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PruebaRepository extends JpaRepository<ObjetoPrueba, Long> {
    Optional<ObjetoPrueba> findById(Long id);
}
