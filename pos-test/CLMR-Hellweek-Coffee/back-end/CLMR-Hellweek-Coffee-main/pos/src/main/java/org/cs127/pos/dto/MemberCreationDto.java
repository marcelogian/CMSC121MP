package org.cs127.pos.dto;

import lombok.Data;

import javax.validation.constraints.*;

@Data
public class MemberCreationDto {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotNull
    @Past
    private String dateOfBirth;

    @Email
    private String email;

    @Pattern(regexp = "^[0-9]{10,15}$")
    private String phone;

    private String memberId;
}
