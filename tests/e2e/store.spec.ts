import { expect, test } from "@playwright/test";

test("home presenta la acción comercial principal", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Libros infantiles");
  await expect(page.getByRole("link", { name: /Ver los libros/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Conversar por WhatsApp" })).toBeVisible();
});

test("filtros de tienda producen una URL compartible", async ({ page }) => {
  await page.goto("/tienda");
  await page.getByLabel("Edad").selectOption({ label: "3–5 años" });
  await page.getByRole("button", { name: "Aplicar filtros" }).click();
  await expect(page).toHaveURL(/edad=3/);
  await expect(page.getByText("La casa de los abrazos").first()).toBeVisible();
});

test("carrito persiste y conduce al checkout invitado", async ({ page }) => {
  await page.goto("/producto/la-casa-de-los-abrazos");
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.getByRole("dialog", { name: "Carrito" })).toBeVisible();
  await page.getByRole("link", { name: "Continuar al checkout" }).click();
  await expect(page).toHaveURL(/checkout/);
  await expect(page.getByText("No necesitas crear una cuenta.")).toBeVisible();
  await expect(page.getByText("Tarjeta con Stripe")).toBeVisible();
  await expect(page.getByText("Mercado Pago")).toBeVisible();
  await expect(page.getByText("PayPal")).toBeVisible();
});
