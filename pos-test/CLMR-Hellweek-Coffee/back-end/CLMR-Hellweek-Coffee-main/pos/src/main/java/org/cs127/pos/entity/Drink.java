package org.cs127.pos.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("DRINK")
public class Drink extends Item {
    // Just in case if it needs specifications
}