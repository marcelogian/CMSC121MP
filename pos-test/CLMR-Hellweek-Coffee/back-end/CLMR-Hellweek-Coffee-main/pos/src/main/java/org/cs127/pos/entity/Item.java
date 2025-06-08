package org.cs127.pos.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @Column(name = "item_code", length = 11)
    private String itemCode;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "base_price", nullable = false)
    private double basePrice;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private List<ItemSize> sizes;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private List<ItemCustomization> availableCustomizations;

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public List<ItemSize> getSizes() {
        return sizes;
    }

    public void setSizes(List<ItemSize> sizes) {
        this.sizes = sizes;
    }

    public List<ItemCustomization> getAvailableCustomizations() {
        return availableCustomizations;
    }

    public void setAvailableCustomizations(List<ItemCustomization> availableCustomizations) {
        this.availableCustomizations = availableCustomizations;
    }
}
