package org.cs127.pos.service;

import org.cs127.pos.dto.SignupRequest;
import org.cs127.pos.entity.Role;
import org.cs127.pos.entity.User;
import org.cs127.pos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> authenticate(String username, String password, Role role) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password) && user.getRole() == role && user.isEnabled());
    }

    public User signup(SignupRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRole(String.valueOf(Role.valueOf(request.getRole().toUpperCase()))); // "cashier" => CASHIER
        user.setEnabled(true);

        return userRepository.save(user); // this line was failing before
    }
}
