package org.cs127.pos.controller;

import org.cs127.pos.dto.*;
import org.cs127.pos.service.*;
import org.cs127.pos.entity.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cashier/transactions")
@CrossOrigin(origins = "http://localhost:3000") // allow React dev server
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody TransactionCreationDto transactionDto) {
        return transactionService.createTransaction(
                transactionDto.getCashierId(),
                transactionDto.getMemberId(),
                transactionDto.getItems()
        );
    }

    @GetMapping("/{id}")
    public Transaction getTransaction(@PathVariable Long id) {
        return transactionService.getTransactionById(id);
    }
}
