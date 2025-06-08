package org.cs127.pos.repository;

import org.cs127.pos.entity.Transaction;
import org.cs127.pos.entity.Customer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCustomer(Customer customer);
}