package org.cs127.pos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "transaction_item_customizations")
public class TransactionItemCustomization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "transaction_item_id", nullable = false)
    private TransactionItem transactionItem;

    @ManyToOne
    @JoinColumn(name = "customization_option_id", nullable = false)
    private CustomizationOption customizationOption;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransactionItem getTransactionItem() {
        return transactionItem;
    }

    public void setTransactionItem(TransactionItem transactionItem) {
        this.transactionItem = transactionItem;
    }

    public CustomizationOption getCustomizationOption() {
        return customizationOption;
    }

    public void setCustomizationOption(CustomizationOption customizationOption) {
        this.customizationOption = customizationOption;
    }
}
