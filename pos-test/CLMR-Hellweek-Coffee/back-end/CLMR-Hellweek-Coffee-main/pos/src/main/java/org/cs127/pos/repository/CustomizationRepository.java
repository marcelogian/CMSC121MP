package org.cs127.pos.repository;

import org.cs127.pos.entity.Customization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomizationRepository extends JpaRepository<Customization, Long> {
}
