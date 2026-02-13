// services/demoblazeClient.ts
import type { APIRequestContext, APIResponse } from "@playwright/test";
import { randomUUID } from "crypto";

export class DemoblazeClient {
  constructor(
    private request: APIRequestContext,
    private baseURL: string = "https://api.demoblaze.com/",
  ) {}

  private buildUrl(path: string): string {
    return new URL(path, this.baseURL).toString();
  }

  // ----------------------------------------------------------
  // ✔ SAFE JSON PARSER — handles empty, malformed & raw text
  // ----------------------------------------------------------
  private async safeJson(res: APIResponse) {
    const text = await res.text();

    if (!text || text.trim() === "") {
      return { success: true, raw: "" };
    }

    // Try JSON
    try {
      return JSON.parse(text);
    } catch {
      // Fallback to raw string
      return { raw: text };
    }
  }

  // ----------------------------------------------------------
  // ✔ PASSWORD ENCODING (Demoblaze requires BASE64)
  // ----------------------------------------------------------
  private encodePassword(password: string): string {
    return Buffer.from(password).toString("base64");
  }

  // ----------------------------------------------------------
  // ✔ TOKEN EXTRACTION (supports ALL Demoblaze formats)
  // ----------------------------------------------------------
  private extractToken(rawText: string): string | null {
    const text = rawText.trim();

    // Case 1: JSON parse
    try {
      const json = JSON.parse(text);
      if (json.auth_token) return json.auth_token;
      if (json.token) return json.token;
    } catch {
      // Not JSON → continue
    }

    // Case 2: Raw string "Auth_token: <value>"
    if (text.toLowerCase().startsWith("auth_token")) {
      const token = text.split(":")[1]?.trim();
      if (token) return token;
    }

    // Case 3: Fallback pattern — find base64 substring
    const base64Regex = /[A-Za-z0-9+/=]{8,}={0,2}/;
    const match = text.match(base64Regex);
    if (match) return match[0];

    return null;
  }

  // ----------------------------------------------------------
  // ✔ SIGNUP (must send base64 password)
  // ----------------------------------------------------------
  async signup(username: string, password: string) {
    const encoded = this.encodePassword(password);

    const res = await this.request.post(this.buildUrl("/signup"), {
      data: { username, password: encoded }
    });

    const json = await this.safeJson(res);
    console.log("signup response:", json);
    return json;
  }

  // ----------------------------------------------------------
  // ✔ LOGIN (handles weird API formats)
  // ----------------------------------------------------------
  async login(username: string, password: string) {
    const encodedPassword = this.encodePassword(password);

    const res = await this.request.post(this.buildUrl("/login"), {
      data: { username, password: encodedPassword }
    });

    const raw = await res.text();
    console.log("raw login response:", raw);

    const token = this.extractToken(raw);

    if (!token) {
      throw new Error("Login failed: no valid token found in response → " + raw);
    }

    // UI + backend expect EXACTLY this format:
    const cookie = `user=${token}`;

    return { token, cookie, raw };
  }

  // ----------------------------------------------------------
  // ✔ PRODUCTS LIST
  // ----------------------------------------------------------
  async getProducts() {
    const res = await this.request.get(this.buildUrl("/entries"));
    const json = await this.safeJson(res);
    console.log("Products:", json);
    return json;
  }

  // ----------------------------------------------------------
  // ✔ SINGLE PRODUCT
  // ----------------------------------------------------------
  async getProductById(id: number) {
    const res = await this.request.post(this.buildUrl("/view"), {
      data: { id }
    });

    const json = await this.safeJson(res);
    console.log("Product:", json);
    return json;
  }

  // ----------------------------------------------------------
  // ⭐ FINAL, REAL addToCart (the correct Demoblaze format)
  //
  // UI WEB FORMAT CONFIRMED:
  // {
  //   id: "<uuid>",       ✔ a random UUID, NOT productId
  //   cookie: "user=...", ✔ session from login()
  //   prod_id: productId, ✔ correct backend product ID
  //   flag: false         ✔ ALWAYS false for web version
  // }
  // ----------------------------------------------------------
  async addToCart(productId: number, cookie: string, flag = false) {

    const payload = {
      id: randomUUID(),
      cookie,
      prod_id: productId,
      flag
    };

    console.log("addToCart payload:", payload);

    const res = await this.request.post(this.buildUrl("/addtocart"), {
      data: payload
    });

    const json = await this.safeJson(res);
    console.log("addToCart response:", json);
    return json;
  }

  // ----------------------------------------------------------
  // ✔ DELETE CART
  // ----------------------------------------------------------
  async deleteCart(cookie: string) {
    const res = await this.request.post(this.buildUrl("/deletecart"), {
      data: { cookie }
    });

    const json = await this.safeJson(res);
    console.log("deleteCart response:", json);
    return json;
  }
}
