package com.pruebafct.prueba.service.impl;

import com.pruebafct.prueba.model.ObjetoPrueba;
import com.pruebafct.prueba.repository.PruebaRepository;
import com.pruebafct.prueba.service.PruebaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PruebaServiceImpl implements PruebaService {

    @Autowired
    private PruebaRepository pruebaRepository;

    @Override
    public String getMessage(Long id) {
        ObjetoPrueba obj = pruebaRepository.findById(id).orElse(new ObjetoPrueba(-1L, "error"));
        return obj.getMessage();
    }
}
