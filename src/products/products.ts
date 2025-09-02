import * as csv from "fast-csv";
import * as fs from "fs";
import * as path from "path";
import Fuse from "fuse.js";

interface Product {
    title: string;
    productId: string;
    grammage: string;
    retailPrice: number;
}

interface SearchProduct {
    title: string;
    productId: string;
    grammage: string;
    price: number;
}

export let products: Product[] = [];
export let productsFuse: Fuse<Product> | null = null;

export async function parseCsvProducts(filePath: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
        const results: Product[] = [];
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("data", (row) => {
                results.push({
                    title: row.title,
                    productId: row.productId,
                    grammage: row["listing.grammage"],
                    retailPrice: Number(row["listing.currentRetailPrice"])
                });
            })
            .on("error", (error) => {
                reject(error);
            })
            .on("end", () => {
                resolve(results);
            });
    });
}

export function searchMultiple(queries: string[]): { [query: string]: SearchProduct[] } {
    if (!productsFuse) return {};
    const result: { [query: string]: SearchProduct[] } = {};
    for (const query of queries) {
        const matches = productsFuse
            .search(query)
            .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
            .slice(0, 10)
            .map(res => ({
                title: res.item.title,
                productId: res.item.productId,
                grammage: res.item.grammage,
                price: res.item.retailPrice
            }));
        result[query] = matches;
    }
    return result;
}

export async function loadProducts() {
    const filePath = path.join(__dirname, "..", "..", "data", "products_stühlingen.csv");
    const rows = await parseCsvProducts(filePath);
    products = rows;
    productsFuse = new Fuse(products, {
        keys: ["title"],
        includeScore: true
    });
}