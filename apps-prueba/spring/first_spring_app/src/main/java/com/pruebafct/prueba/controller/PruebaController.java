package com.pruebafct.prueba.controller;

import com.pruebafct.prueba.service.impl.PruebaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class PruebaController {

    @Autowired
    PruebaServiceImpl pruebaService;

    @GetMapping("/health")
    public ResponseEntity<Object> checkHealth() {
        return  ResponseEntity.ok(1);
    }

    @GetMapping("/datos/{id}")
    public ResponseEntity<Object> getDatos(
            @PathVariable Long id
    ) {
        String message = pruebaService.getMessage(id);
        if (!message.equals("error")) {
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.internalServerError().body(message);
        }
    }

}
