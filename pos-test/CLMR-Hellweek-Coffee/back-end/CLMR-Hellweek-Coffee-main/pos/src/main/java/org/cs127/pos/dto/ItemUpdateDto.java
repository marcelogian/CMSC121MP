package org.cs127.pos.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemUpdateDto {
    private String name;
    private Long categoryId;
    private double basePrice;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    // Add other fields that needs to be updated
}
