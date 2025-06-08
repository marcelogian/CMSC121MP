package org.cs127.pos.repository;

import org.cs127.pos.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByMemberId(String memberId);
    List<Customer> findByIsMember(boolean isMember);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByMemberId(String memberId);
}
