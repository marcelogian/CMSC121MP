package org.cs127.pos.dto;

import lombok.Data;

@Data
public class ItemCreationDto {
    private String name;
    private Long categoryId;
    private double basePrice;

}


