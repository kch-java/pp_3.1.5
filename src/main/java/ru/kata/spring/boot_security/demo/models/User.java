package ru.kata.spring.boot_security.demo.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.Collection;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    @Pattern(regexp = "^[a-zA-Zа-яА-Я]{1,25}$",
            message = "The name must contain from 1 to 25 characters " +
                    "/ Имя должно содержать от 1 до 25 символов.")
    private String firstName;

    @Column(name = "last_name")
    @Pattern(regexp = "^[a-zA-Zа-яА-Я]{1,25}$",
            message = "The last name must contain from 1 to 25 characters " +
                    "/ Фамилия должна содержать от 1 до 25 символов.")
    private String lastName;

    @Column(name = "age")
    @NotNull(message = "Age must not be null / Возраст не должен быть равен null")
    @Digits(integer = 3, fraction = 0, message = "Age should be / Возраст должен быть от 0 до 122")
    @Min(value = 0, message = "Age should be / Возраст должен быть >= 0")
    @Max(value = 122, message = "Age should be / Возраст должен быть < 123")
    private Integer age;

    @Column(name = "email")
    @Pattern(regexp = "^[_A-Za-z0-9-+]+(\\.[_A-Za-z0-9-]+)*@" +
                     "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$", message = "Enter a valid email address " +
            "/ Введите действительный адрес электронной почты")
    private String email;

    @NotEmpty(message = "Username cannot be empty / Имя пользователя не может быть пустым")
    @Size(min = 1, max = 15, message = "Username must contain from 1 to 15 characters / " +
            "Имя пользователя должно содержать от 1 до 15 символов")
    @Column(name = "username", unique = true)
    private String username;

    @NotEmpty(message = "Password cannot be empty / Пароль не может быть пустым")
    @Size(min = 4,message = "Password must be more than 4 characters / Пароль должен быть больше 4 символов")
    @Column(name = "password")
    private String password;

    @ManyToMany
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    @NotEmpty(message = "Select a role for the user / Выберите роль для пользователя")
    private Collection<Role> roles;

    public User() {
    }

    public User(String firstName, String lastName, Integer age, String email, String username, String password, Collection<Role> roles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.email = email;
        this.username = username;
        this.password = password;
        this.roles = roles;
    }

    public User(String username, String password, Collection<? extends GrantedAuthority> grantedAuthorities) {
        this.username = username;
        this.password = password;
        this.roles = (Collection<Role>) grantedAuthorities;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Collection<Role> getRoles() {
        return roles;
    }

    public void setRoles(Collection<Role> roles) {
        this.roles = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
