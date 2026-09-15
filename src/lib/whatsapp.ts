import type { CartItem } from "./cart-store";

export function formatFcfa(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export function buildWhatsappUrl(phoneDigitsOnly: string, message: string): string {
  const normalized = phoneDigitsOnly.replace(/\D/g, "");
  const withCountryCode = normalized.startsWith("225") ? normalized : `225${normalized.replace(/^0/, "")}`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}

export function buildSingleProductMessage(params: {
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  customization?: string;
  price: number;
}): string {
  const { name, quantity, size, color, customization, price } = params;
  const total = price * quantity;
  const lines = [
    "Bonjour, je souhaite commander :",
    `Produit : ${name}`,
    `Quantité : ${quantity}`,
    size ? `Taille : ${size}` : null,
    color ? `Couleur : ${color}` : null,
    customization ? `Personnalisation : ${customization}` : null,
    `Prix : ${formatFcfa(price)}`,
    `Total : ${formatFcfa(total)}`,
    "",
    "Merci de m'indiquer les modalités de livraison et de paiement."
  ].filter(Boolean);
  return lines.join("\n");
}

export function buildCartMessage(items: CartItem[], subtotal: number): string {
  const lines = ["Bonjour, je souhaite commander :", ""];
  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`   Quantité : ${item.quantity}`);
    if (item.size) lines.push(`   Taille : ${item.size}`);
    if (item.color) lines.push(`   Couleur : ${item.color}`);
    if (item.customization) lines.push(`   Personnalisation : ${item.customization}`);
    lines.push(`   Prix unitaire : ${formatFcfa(item.price)}`);
    lines.push("");
  });
  lines.push(`Sous-total : ${formatFcfa(subtotal)}`);
  lines.push("");
  lines.push("Merci de m'indiquer les frais de livraison et les modalités de paiement.");
  return lines.join("\n");
}
