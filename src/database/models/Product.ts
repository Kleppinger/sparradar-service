import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Repository } from "typeorm";
import type { Market } from "./Market";
import { AppDataSource } from "../database";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    productId: string;

    @Column()
    grammage: string;

    @Column("integer")
    retailPrice: number;

    @ManyToOne("Market", (market: Market) => market.products)
    market: Market;

}

export function productRepository(): Repository<Product> {
    return AppDataSource?.getRepository(Product) as Repository<Product>;
}
