import type { BunFile } from "bun";
import rawMarkets from "../data/markets.json" with { type: "json" };
import { MarketFranchise } from "./database/enums";
import * as path from "path";
import { parseCsvProducts } from "./products/products";
import { marketRepository } from "./database/models/Market";
import { productRepository } from "./database/models/Product";
import { initializeDatabase } from "./database/database";

interface ImportMarket {
    marketId: string;
    franchise: MarketFranchise;
    name: string;
    address: string;
    zipCode: string;
    city: string;
}

await initializeDatabase();

const markets: ImportMarket[] = rawMarkets as ImportMarket[];

for(let market of markets) {
    let csvFileName = path.join(__dirname, "..", "data", `products_${market.marketId}.csv`);
    let file: BunFile = Bun.file(csvFileName);

    if(!(await file.exists())) {
        console.warn(`File ${csvFileName} does not exist. Skipping market with ID ${market.marketId}.`);
        continue;
    }

    const products = await parseCsvProducts(csvFileName);
    console.info(`Loaded ${products.length} products for market with ID ${market.marketId}.`);

    console.info(`Importing market: ${market.name} (${market.marketId})...`);
    const dbMarket = await marketRepository().save({
        marketId: market.marketId,
        franchise: market.franchise,
        name: market.name,
        address: market.address,
        zipCode: market.zipCode,
        city: market.city
    });
    console.info(`Saved market: ${market.name} (${market.marketId}).`);

    let count = 0;
    for (let product of products) {
        await productRepository().save({
            ...product,
            market: dbMarket
        });
        count++;
        if (count % 100 === 0) {
            console.info(`  Imported ${count} products for market ${market.marketId}...`);
        }
    }
    console.info(`Finished importing ${count} products for market ${market.marketId}.`);


}