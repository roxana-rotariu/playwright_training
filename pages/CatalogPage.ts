import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { Category } from "../fixtures/types";
import { Sidebar } from "../components/Sidebar";
import { ProductGrid } from "../components/ProductGrid";

export class CatalogPage extends BasePage {

    sidebar: Sidebar;
    grid: ProductGrid;

    constructor(page: Page) {
        super(page);
        this.sidebar = new Sidebar(page);
        this.grid = new ProductGrid(page);
    }

    /**
     * Selects a category from sidebar and waits for product grid.
     */
    async filterCategory(category: Category) {
        await this.sidebar.select(category);
        if (typeof this.grid?.waitForLoad === "function") {
            await this.grid.waitForLoad();
        } else {
            await this.page.locator(".hrefch").first().waitFor({ timeout: 15000 });
        }
    }

    /**
     * Select product by name from the grid.
     * Works across multiple pages.
     */
    async findAndSelectProduct(productName: string) {
        await this.grid.selectProduct(productName);
    }

    /**
     * Returns the list of product names visible on the current grid page.
     */
    async listProducts(): Promise<string[]> {
        return await this.grid.listProductNames();
    }
}
