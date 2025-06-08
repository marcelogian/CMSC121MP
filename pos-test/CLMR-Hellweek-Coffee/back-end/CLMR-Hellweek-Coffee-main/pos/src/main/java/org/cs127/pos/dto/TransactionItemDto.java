package org.cs127.pos.dto;

import lombok.Data;

import java.util.List;

@Data
public class TransactionItemDto {
    private String itemCode;
    private String size;
    private int quantity;
    private List<CustomizationSelectionDto> customizations;
}
