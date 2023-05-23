package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.User;

import javax.validation.Valid;
import java.util.List;

public interface UserService {
    void add(User user);
    void update(@Valid User user);
    void remove(Long id);
    User getUserById(Long id);
    User findByUsername(String username);
    List<User> listUsers();
    void createAdmin();
}
