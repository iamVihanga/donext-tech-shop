import type { Quotation, QuotationItem } from "@repo/database";

export interface QuotationWithItems extends Quotation {
  items: Array<QuotationItem & {
    product: {
      id: string;
      name: string;
      sku?: string | null;
    };
    variant?: {
      id: string;
      name: string;
    } | null;
  }>;
}

export function generateQuotationPDF(quotation: QuotationWithItems): Buffer {
  // Create a simple HTML template for the PDF
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Quotation ${quotation.quotationNumber}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          line-height: 1.6;
        }
        
        .header {
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .company-info {
          text-align: right;
          margin-bottom: 20px;
        }
        
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 5px;
        }
        
        .quotation-title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }
        
        .quotation-number {
          font-size: 16px;
          color: #6b7280;
          margin-top: 5px;
        }
        
        .customer-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        
        .customer-info {
          flex: 1;
        }
        
        .quotation-details {
          flex: 1;
          text-align: right;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #374151;
          margin-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        
        .info-row {
          margin-bottom: 5px;
        }
        
        .label {
          font-weight: 600;
          color: #4b5563;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .items-table th {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          color: #374151;
        }
        
        .items-table td {
          border: 1px solid #e5e7eb;
          padding: 12px 8px;
          vertical-align: top;
        }
        
        .items-table tr:nth-child(even) {
          background-color: #fafafa;
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-center {
          text-align: center;
        }
        
        .totals-section {
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
        }
        
        .totals-table {
          width: 300px;
          border-collapse: collapse;
        }
        
        .totals-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .totals-table .total-row td {
          border-top: 2px solid #2563eb;
          border-bottom: 2px solid #2563eb;
          font-weight: bold;
          font-size: 16px;
          background-color: #f8fafc;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        
        .notes {
          margin-bottom: 20px;
        }
        
        .terms {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-draft {
          background-color: #f3f4f6;
          color: #374151;
        }
        
        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .status-approved {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .status-rejected {
          background-color: #fee2e2;
          color: #991b1b;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <div class="company-name">GameZone Tech</div>
          <div>Your Technology Partner</div>
        </div>
        <h1 class="quotation-title">QUOTATION</h1>
        <div class="quotation-number">
          #${quotation.quotationNumber}
          <span class="status-badge status-${quotation.status}">${quotation.status}</span>
        </div>
      </div>

      <div class="customer-section">
        <div class="customer-info">
          <div class="section-title">Bill To:</div>
          <div class="info-row"><strong>${quotation.customerName}</strong></div>
          ${quotation.customerCompany ? `<div class="info-row">${quotation.customerCompany}</div>` : ''}
          <div class="info-row">${quotation.customerEmail}</div>
          ${quotation.customerPhone ? `<div class="info-row">${quotation.customerPhone}</div>` : ''}
          ${quotation.customerAddress ? `
            <div class="info-row">
              ${JSON.parse(quotation.customerAddress).street || ''}<br>
              ${JSON.parse(quotation.customerAddress).city || ''}, ${JSON.parse(quotation.customerAddress).state || ''} ${JSON.parse(quotation.customerAddress).postalCode || ''}<br>
              ${JSON.parse(quotation.customerAddress).country || ''}
            </div>
          ` : ''}
        </div>
        
        <div class="quotation-details">
          <div class="section-title">Quotation Details:</div>
          <div class="info-row">
            <span class="label">Date:</span> ${new Date(quotation.createdAt).toLocaleDateString()}
          </div>
          ${quotation.validUntil ? `
            <div class="info-row">
              <span class="label">Valid Until:</span> ${new Date(quotation.validUntil).toLocaleDateString()}
            </div>
          ` : ''}
          <div class="info-row">
            <span class="label">Status:</span> ${quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
          </div>
        </div>
      </div>

      ${quotation.title ? `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #374151; margin-bottom: 10px;">${quotation.title}</h2>
          ${quotation.description ? `<p style="color: #6b7280;">${quotation.description}</p>` : ''}
        </div>
      ` : ''}

      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 40%;">Product</th>
            <th style="width: 15%;" class="text-center">Quantity</th>
            <th style="width: 15%;" class="text-right">Unit Price</th>
            <th style="width: 15%;" class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${quotation.items.map(item => `
            <tr>
              <td>
                <strong>${item.product.name}</strong>
                ${item.product.sku ? `<br><small style="color: #6b7280;">SKU: ${item.product.sku}</small>` : ''}
                ${item.variant ? `<br><small style="color: #2563eb;">Variant: ${item.variant.name}</small>` : ''}
                ${item.notes ? `<br><small style="color: #6b7280; font-style: italic;">${item.notes}</small>` : ''}
              </td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">$${parseFloat(item.unitPrice).toFixed(2)}</td>
              <td class="text-right">$${parseFloat(item.totalPrice).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals-section">
        <table class="totals-table">
          <tr>
            <td><span class="label">Subtotal:</span></td>
            <td class="text-right">$${parseFloat(quotation.subtotal).toFixed(2)}</td>
          </tr>
          ${parseFloat(quotation.discountAmount) > 0 ? `
            <tr>
              <td><span class="label">Discount:</span></td>
              <td class="text-right">-$${parseFloat(quotation.discountAmount).toFixed(2)}</td>
            </tr>
          ` : ''}
          ${parseFloat(quotation.taxAmount) > 0 ? `
            <tr>
              <td><span class="label">Tax:</span></td>
              <td class="text-right">$${parseFloat(quotation.taxAmount).toFixed(2)}</td>
            </tr>
          ` : ''}
          <tr class="total-row">
            <td><span class="label">Total Amount:</span></td>
            <td class="text-right">$${parseFloat(quotation.totalAmount).toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        ${quotation.notes ? `
          <div class="notes">
            <div class="section-title">Notes:</div>
            <p>${quotation.notes}</p>
          </div>
        ` : ''}
        
        ${quotation.terms ? `
          <div class="terms">
            <div class="section-title">Terms & Conditions:</div>
            <p>${quotation.terms}</p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // For now, return the HTML as a buffer
  // In a real implementation, you would use a library like puppeteer or html-pdf
  // to convert HTML to PDF
  return Buffer.from(html, 'utf8');
}

// Alternative simple text-based PDF generation
export function generateSimpleQuotationPDF(quotation: QuotationWithItems): Buffer {
  const content = `
QUOTATION #${quotation.quotationNumber}
========================================

Date: ${new Date(quotation.createdAt).toLocaleDateString()}
Status: ${quotation.status.toUpperCase()}

CUSTOMER INFORMATION:
--------------------
Name: ${quotation.customerName}
${quotation.customerCompany ? `Company: ${quotation.customerCompany}\n` : ''}Email: ${quotation.customerEmail}
${quotation.customerPhone ? `Phone: ${quotation.customerPhone}\n` : ''}
${quotation.title ? `\nTITLE: ${quotation.title}\n` : ''}
${quotation.description ? `DESCRIPTION: ${quotation.description}\n` : ''}

ITEMS:
------
${quotation.items.map((item, index) => `
${index + 1}. ${item.product.name}
   ${item.product.sku ? `SKU: ${item.product.sku}\n   ` : ''}${item.variant ? `Variant: ${item.variant.name}\n   ` : ''}Quantity: ${item.quantity}
   Unit Price: $${parseFloat(item.unitPrice).toFixed(2)}
   Total: $${parseFloat(item.totalPrice).toFixed(2)}
   ${item.notes ? `Notes: ${item.notes}\n` : ''}
`).join('')}

TOTALS:
-------
Subtotal: $${parseFloat(quotation.subtotal).toFixed(2)}
${parseFloat(quotation.discountAmount) > 0 ? `Discount: -$${parseFloat(quotation.discountAmount).toFixed(2)}\n` : ''}${parseFloat(quotation.taxAmount) > 0 ? `Tax: $${parseFloat(quotation.taxAmount).toFixed(2)}\n` : ''}TOTAL AMOUNT: $${parseFloat(quotation.totalAmount).toFixed(2)}

${quotation.notes ? `\nNOTES:\n${quotation.notes}\n` : ''}
${quotation.terms ? `\nTERMS & CONDITIONS:\n${quotation.terms}\n` : ''}

Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
  `;

  return Buffer.from(content, 'utf8');
}
