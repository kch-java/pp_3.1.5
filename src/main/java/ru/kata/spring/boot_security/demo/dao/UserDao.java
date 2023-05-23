package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserDao {
    void add(User user);
    void update(User user);
    void remove(Long id);
    User getUserById(Long id);
    List<User> listUsers();
}
