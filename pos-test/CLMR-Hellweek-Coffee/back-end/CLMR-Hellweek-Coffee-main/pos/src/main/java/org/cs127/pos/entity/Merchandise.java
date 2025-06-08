package org.cs127.pos.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("MERCHANDISE")
public class Merchandise extends Item {
    // Please add anything if needed
}