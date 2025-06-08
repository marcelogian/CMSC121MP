package org.cs127.pos.controller;

import org.cs127.pos.dto.*;
import org.cs127.pos.service.*;
import org.cs127.pos.entity.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager/items")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public Item createItem(@RequestBody ItemCreationDto itemDto) {
        return itemService.createItem(itemDto.getName(), itemDto.getCategoryId(), itemDto.getBasePrice());
    }

    @PutMapping("/{itemCode}")
    public Item updateItem(@PathVariable String itemCode, @RequestBody ItemUpdateDto itemDto) {
        return itemService.updateItem(itemCode, itemDto.getName(), itemDto.getCategoryId(), itemDto.getBasePrice());
    }

    @DeleteMapping("/{itemCode}")
    public void deleteItem(@PathVariable String itemCode) {
        itemService.deleteItem(itemCode);
    }

    // Other method mapping for sizes, customizations, etc.
}