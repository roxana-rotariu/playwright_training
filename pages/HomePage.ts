import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

export class HomePage extends BasePage {

    navbar: Navbar;
    sidebar: Sidebar;

    constructor(page: Page) {
        super(page);
        this.navbar = new Navbar(page);
        this.sidebar = new Sidebar(page);
    }

    async gotoHome() {
        // 1️⃣ Navigate to homepage (absolute URL = CI safe)
        await this.page.goto("https://www.demoblaze.com", {
            timeout: 30000
        });

        // 2️⃣ Initialize navbar (requires scroll)
        await this.navbar.waitForLoad();

        // 3️⃣ Initialize sidebar AFTER navbar loads
        await this.sidebar.waitForLoad();

        // 4️⃣ Ensure product grid loads correctly
        await this.page.locator(".hrefch").first().waitFor({ timeout: 20000 });
    }
}