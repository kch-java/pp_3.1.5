package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;

@Controller
public class UsersController {

    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/")
    public String loginPage() {
        return "loginPage";
    }

    @GetMapping("/admin")
    public String listUsers(Model model, Principal principal){
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", userService.getUserById(user.getId()));
        model.addAttribute("listUsers", userService.listUsers());
        return "adminPanel";
    }

    @PostMapping("/admin/add")
    public String addUser(@ModelAttribute("user") User user, BindingResult bindingResult) {
        if (userService.findByUsername(user.getUsername()) != null) {
            bindingResult.addError(new FieldError("user", "username",
                    String.format("User with Username \"'%s'\" is already exist / " +
                            "Пользователь с именем \"'%s'\" уже существует", user.getUsername(), user.getUsername())));
            return "newUser";
        }
        userService.add(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/admin/remove/{id}")
    public String removeUser(@PathVariable("id") Long id) {
        userService.remove(id);
        return "redirect:/admin";
    }

    @GetMapping("/admin/edit/{id}")
    public String editUser(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "newUser";
    }

    @PostMapping("/admin/{id}")
    public String updateUser(@PathVariable Long id, @ModelAttribute("user") User user, BindingResult bindingResult) {
        if (userService.findByUsername(user.getUsername()) != null
                && !userService.getUserById(id).getUsername().equals(user.getUsername())) {
            bindingResult.addError(new FieldError("user", "username",
                    String.format("User with Username \"'%s'\" is already exist / " +
                            "Пользователь с именем \"'%s'\" уже существует", user.getUsername(), user.getUsername())));
            return "newUser";
        }
        userService.update(user);
        return "redirect:/admin";
    }

    @GetMapping("/user")
    public String getUser(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", userService.getUserById(user.getId()));
        return "userPage";
    }
}
