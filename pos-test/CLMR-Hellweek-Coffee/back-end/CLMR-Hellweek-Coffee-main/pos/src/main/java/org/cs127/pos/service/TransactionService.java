package org.cs127.pos.service;

import jakarta.persistence.EntityNotFoundException;
import org.cs127.pos.dto.*;
import org.cs127.pos.entity.*;
import org.cs127.pos.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              CustomerRepository customerRepository,
                              ItemRepository itemRepository) {
        this.transactionRepository = transactionRepository;
        this.customerRepository = customerRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public Transaction createTransaction(Long cashierId, String memberId, List<TransactionItemDto> items) {

        Customer customer = null;
        if (memberId != null && !memberId.isEmpty()) {
            customer = customerRepository.findByMemberId(memberId)
                    .orElseThrow(() -> new RuntimeException("Member not found"));
        }

        Transaction transaction = new Transaction();
        transaction.setCustomer(customer);
        transaction.setTransactionDate(LocalDateTime.now());

        double total = 0;

        for (TransactionItemDto itemDto : items) {
            Item item = itemRepository.findById(itemDto.getItemCode())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + itemDto.getItemCode()));

            TransactionItem transactionItem = new TransactionItem();
            transactionItem.setTransaction(transaction);
            transactionItem.setItem(item);
            transactionItem.setSize(itemDto.getSize());
            transactionItem.setQuantity(itemDto.getQuantity());

            double itemPrice = calculateItemPrice(item, itemDto);
            transactionItem.setPrice(itemPrice);

            total += itemPrice * itemDto.getQuantity();

            // Add customizations if any
        }

        transaction.setTotal(total);
        return transactionRepository.save(transaction);
    }

    private double calculateItemPrice(Item item, TransactionItemDto itemDto) {
        // Please fill in this method too hehe
        return 0; // Placeholder
    }

    public Transaction getTransactionById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Transaction ID cannot be null");
        }

        return transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with id: " + id));
    }
}