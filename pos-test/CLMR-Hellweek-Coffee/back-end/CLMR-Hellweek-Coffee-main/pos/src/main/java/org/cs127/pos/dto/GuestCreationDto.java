package org.cs127.pos.dto;

import javax.validation.constraints.NotBlank;

public class GuestCreationDto {
    @NotBlank(message = "First name is required")
    private String firstName;
    private String lastName;

    // Getters and setters
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
}
