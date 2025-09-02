import { DataSource } from "typeorm";
import { User } from "./models/User";
import * as path from "path"
import { Market } from "./models/Market";
import { Product } from "./models/Product";

export let AppDataSource: DataSource|null = null;

export async function initializeDatabase() {
    try {
        AppDataSource = new DataSource({
            type: "sqlite",
            database: path.join(__dirname, "..", "..", "db.sqlite"),
            synchronize: true,
            logging: false,
            entities: [User, Market, Product]
        });

        await AppDataSource?.initialize();
        console.log("Database connection established");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}