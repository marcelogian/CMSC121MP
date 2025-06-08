package org.cs127.pos.controller;

import org.cs127.pos.dto.*;
import org.cs127.pos.entity.*;
import org.cs127.pos.service.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;



@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    // Option 1: Using ResponseEntity (recommended)
    @PostMapping("/guest")
    public ResponseEntity<Customer> createGuest(@RequestBody GuestCreationDto guestDto) {
        Customer guest = customerService.createGuestCustomer(guestDto);
        return ResponseEntity.ok(guest);
    }

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/members")
    public Customer createMember(@RequestBody MemberCreationDto memberDto) {
        return customerService.createMember(memberDto);
    }

    @GetMapping("/members/{memberId}")
    public Customer getMember(@PathVariable String memberId) {
        return customerService.getMemberByMemberId(memberId);
    }
}
