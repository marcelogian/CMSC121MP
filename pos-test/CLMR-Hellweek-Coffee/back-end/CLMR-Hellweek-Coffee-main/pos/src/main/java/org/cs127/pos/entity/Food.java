package org.cs127.pos.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("FOOD")
public class Food extends Item {
    // Please put anything if needed
}