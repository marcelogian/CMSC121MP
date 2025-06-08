package org.cs127.pos.repository;

import org.cs127.pos.entity.Item;
import org.cs127.pos.entity.ItemType;
import org.cs127.pos.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, String> {
    List<Item> findByCategory(Category category);
    List<Item> findByCategoryItemType(ItemType itemType);
    Item findByItemCode(String itemCode);

    long countByCategory(Category category);
}
