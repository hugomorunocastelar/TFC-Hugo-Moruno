package com.pruebafct.prueba.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pruebafct")
public class ObjetoPrueba {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;

    public ObjetoPrueba() {

    }

    public ObjetoPrueba(Long id, String message) {
        this.id = id;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

