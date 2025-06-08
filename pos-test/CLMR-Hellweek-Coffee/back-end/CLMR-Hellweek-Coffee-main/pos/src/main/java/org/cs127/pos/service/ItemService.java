package org.cs127.pos.service;

import org.cs127.pos.entity.*;
import org.cs127.pos.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;


@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final CustomizationRepository customizationRepository;

    public ItemService(ItemRepository itemRepository,
                       CategoryRepository categoryRepository,
                       CustomizationRepository customizationRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.customizationRepository = customizationRepository;
    }

    @Transactional
    public Item createItem(String name, Long categoryId, double basePrice) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String itemCode = generateItemCode(category, name);

        Item item = new Item();
        item.setItemCode(itemCode);
        item.setName(name);
        item.setCategory(category);
        item.setBasePrice(basePrice);

        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItem(String itemCode, String name, Long categoryId, double basePrice) {
        Item item = itemRepository.findByItemCode(itemCode);
        item.setName(name);
        item.setCategory(categoryRepository.findById(categoryId)
            .orElseThrow(() -> new EntityNotFoundException("Category not found")));
        item.setBasePrice(basePrice);
        return itemRepository.save(item);
    }

    @Transactional
    public void deleteItem(String itemCode) {
        Item item = itemRepository.findByItemCode(itemCode);
        itemRepository.delete(item);
    }


    private String generateItemCode(Category category, String itemName) {
        String categoryAbbr = category.getName().substring(0, 1) +
                category.getName().substring(category.getName().length() - 1);
        String namePart = itemName.substring(0, Math.min(4, itemName.length())).toUpperCase();

        long count = itemRepository.countByCategory(category);
        String numberPart = String.format("%03d", count + 1);

        return categoryAbbr + "-" + namePart + "-" + numberPart;
    }

    public List<Item> getItemsByType(ItemType itemType) {
        return itemRepository.findByCategoryItemType(itemType);
    }

    // Add other methods for sizes, flavors, tc.
}
