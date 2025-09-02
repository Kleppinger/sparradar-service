import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Repository } from "typeorm";
import { MarketFranchise } from "../enums";
import type { Product } from "./Product";
import { AppDataSource } from "../database";

@Entity()
export class Market {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    marketId: string;

    @Column({
        type: "simple-enum",
        enum: MarketFranchise
    })
    franchise: MarketFranchise;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    zipCode: string;

    @Column()
    city: string;

    @OneToMany("Product", (product: Product) => product.market)
    products: Product[]

}

export function marketRepository(): Repository<Market> {
    return AppDataSource?.getRepository(Market) as Repository<Market>;
}