package org.cs127.pos.service;

import org.cs127.pos.dto.*;
import org.cs127.pos.entity.*;
import org.cs127.pos.errorhandling.MemberAlreadyExistsException;
import org.cs127.pos.errorhandling.MemberNotFoundException;
import org.cs127.pos.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final Random random = new Random();

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Customer createGuestCustomer(GuestCreationDto guestDto) {
        if (guestDto.getFirstName() == null || guestDto.getFirstName().isEmpty()) {
            throw new IllegalArgumentException("First name is required for guest customers");
        }

        Customer guest = new Customer();
        guest.setFirstName(guestDto.getFirstName());
        guest.setLastName(guestDto.getLastName()); // Optional
        guest.setMember(false);

        return customerRepository.save(guest);
    }

    @Transactional
    public Customer createMember(MemberCreationDto memberDto) {
        if (memberDto.getFirstName() == null || memberDto.getFirstName().isEmpty() ||
                memberDto.getLastName() == null || memberDto.getLastName().isEmpty()) {
            throw new IllegalArgumentException("First name and last name are required");
        }

        if ((memberDto.getEmail() == null || memberDto.getEmail().isEmpty()) &&
                (memberDto.getPhone() == null || memberDto.getPhone().isEmpty())) {
            throw new IllegalArgumentException("Either email or phone must be provided");
        }

        if (memberDto.getEmail() != null && !memberDto.getEmail().isEmpty() &&
                customerRepository.existsByEmail(memberDto.getEmail())) {
            throw new MemberAlreadyExistsException("Email already registered");
        }

        if (memberDto.getPhone() != null && !memberDto.getPhone().isEmpty() &&
                customerRepository.existsByPhone(memberDto.getPhone())) {
            throw new MemberAlreadyExistsException("Phone number already registered");
        }

        Customer member = new Customer();
        member.setFirstName(memberDto.getFirstName());
        member.setLastName(memberDto.getLastName());
        member.setDateOfBirth(LocalDate.parse(memberDto.getDateOfBirth()));
        member.setEmail(memberDto.getEmail());
        member.setPhone(memberDto.getPhone());
        member.setMember(true);
        member.setMemberId(generateMemberId());

        return customerRepository.save(member);
    }

    public Customer getMemberByMemberId(String memberId) {
        return customerRepository.findByMemberId(memberId)
                .orElseThrow(() -> new MemberNotFoundException("Member not found with ID: " + memberId));
    }

    public List<Customer> getAllMembers() {
        return customerRepository.findByIsMember(true);
    }

    @Transactional
    public Customer createGuestCustomer(String firstName) {
        if (firstName == null || firstName.isEmpty()) {
            throw new IllegalArgumentException("First name is required for guest customers");
        }

        Customer guest = new Customer();
        guest.setFirstName(firstName);
        guest.setMember(false);

        return customerRepository.save(guest);
    }

    @Transactional
    public Customer updateMember(String memberId, MemberCreationDto memberDto) {
        Customer existingMember = getMemberByMemberId(memberId);

        if (memberDto.getFirstName() != null) {
            existingMember.setFirstName(memberDto.getFirstName());
        }
        if (memberDto.getLastName() != null) {
            existingMember.setLastName(memberDto.getLastName());
        }
        if (memberDto.getDateOfBirth() != null) {
            existingMember.setDateOfBirth(LocalDate.parse(memberDto.getDateOfBirth()));
        }
        if (memberDto.getEmail() != null) {
            existingMember.setEmail(memberDto.getEmail());
        }
        if (memberDto.getPhone() != null) {
            existingMember.setPhone(memberDto.getPhone());
        }

        return customerRepository.save(existingMember);
    }

    @Transactional
    public void deactivateMember(String memberId) {
        Customer member = getMemberByMemberId(memberId);
        member.setMember(false);
        customerRepository.save(member);
    }


    private String generateMemberId() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder memberId = new StringBuilder();

        while (true) {
            for (int i = 0; i < 5; i++) {
                memberId.append(characters.charAt(random.nextInt(characters.length())));
            }

            String newId = memberId.toString();
            if (!customerRepository.existsByMemberId(newId)) {
                return newId;
            }
            memberId.setLength(0);
        }
    }
}