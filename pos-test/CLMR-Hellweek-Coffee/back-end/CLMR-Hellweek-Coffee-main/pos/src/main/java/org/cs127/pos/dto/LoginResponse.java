package org.cs127.pos.dto;
import lombok.Data;
import org.cs127.pos.entity.User;

@Data
public class LoginResponse {
    private String message;
    private User user;

    public LoginResponse(String message, User user) {
        this.message = message;
        this.user = user;
    }
}
