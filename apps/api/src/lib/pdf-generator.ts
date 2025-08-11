import { quotationItems, quotations } from "@repo/database";

type QuotationSelect = typeof quotations.$inferSelect;
type QuotationItemSelect = typeof quotationItems.$inferSelect;

export interface QuotationWithItems extends QuotationSelect {
  items: Array<
    QuotationItemSelect & {
      product: {
        id: string;
        name: string;
        sku?: string | null;
      };
      variant?: {
        id: string;
        name: string;
      } | null;
    }
  >;
}

// Simple text-based PDF generation that creates a readable text file
export function generateSimpleQuotationPDF(
  quotation: QuotationWithItems
): Buffer {
  const content = `
========================================
         QUOTATION #${quotation.quotationNumber}
========================================

Date: ${new Date(quotation.createdAt).toLocaleDateString()}
Status: ${quotation.status.toUpperCase()}

CUSTOMER INFORMATION:
--------------------
Name: ${quotation.customerName}
${quotation.customerCompany ? `Company: ${quotation.customerCompany}\n` : ""}Email: ${quotation.customerEmail}
${quotation.customerPhone ? `Phone: ${quotation.customerPhone}\n` : ""}

${quotation.title ? `TITLE: ${quotation.title}\n` : ""}
${quotation.description ? `DESCRIPTION: ${quotation.description}\n` : ""}

ITEMS:
------
${quotation.items
  .map(
    (item, index) => `
${index + 1}. ${item.product.name}
   ${item.product.sku ? `SKU: ${item.product.sku}\n   ` : ""}${item.variant ? `Variant: ${item.variant.name}\n   ` : ""}Quantity: ${item.quantity}
   Unit Price: $${parseFloat(item.unitPrice).toFixed(2)}
   Total: $${parseFloat(item.totalPrice).toFixed(2)}
   ${item.notes ? `Notes: ${item.notes}\n` : ""}
`
  )
  .join("")}

TOTALS:
-------
Subtotal: $${parseFloat(quotation.subtotal).toFixed(2)}
${parseFloat(quotation.discountAmount) > 0 ? `Discount: -$${parseFloat(quotation.discountAmount).toFixed(2)}\n` : ""}${parseFloat(quotation.taxAmount) > 0 ? `Tax: $${parseFloat(quotation.taxAmount).toFixed(2)}\n` : ""}----------------------------------------
TOTAL AMOUNT: $${parseFloat(quotation.totalAmount).toFixed(2)}

${quotation.notes ? `\nNOTES:\n${quotation.notes}\n` : ""}
${quotation.terms ? `\nTERMS & CONDITIONS:\n${quotation.terms}\n` : ""}

========================================
Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
GameZone Tech - Your Technology Partner
========================================
  `;

  return Buffer.from(content, "utf8");
}
