package org.cs127.pos.repository;import org.cs127.pos.entity.ItemType;
import org.cs127.pos.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByItemType(ItemType itemType);
}


