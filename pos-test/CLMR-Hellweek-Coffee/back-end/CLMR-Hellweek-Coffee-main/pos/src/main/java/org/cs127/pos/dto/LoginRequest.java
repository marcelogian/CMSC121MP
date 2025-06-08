package org.cs127.pos.dto;

import org.cs127.pos.entity.Role;

public class LoginRequest {
    private String username;
    private String password;
    private Role role;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    // Getters and setters
}

