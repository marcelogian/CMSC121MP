package org.cs127.pos.dto;

import lombok.Data;
import java.util.List;

@Data
public class TransactionCreationDto {
    private Long cashierId;
    private String memberId;
    private List<TransactionItemDto> items;
}
