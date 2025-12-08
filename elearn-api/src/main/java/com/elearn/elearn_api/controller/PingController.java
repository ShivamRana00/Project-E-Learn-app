package com.elearn.elearn_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Spring Boot";
    }
}
