import { db } from "@api/db";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@api/types";
import type { QuotationWithItems } from "../../lib/pdf-generator";
import type { GeneratePDFRoute } from "./quotation.routes";

/**
 * Generate PDF for quotation handler
 */
export const generatePDF: AppRouteHandler<GeneratePDFRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    // Fetch quotation with full details
    const quotation = await db.query.quotations.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        items: {
          with: {
            product: {
              columns: {
                id: true,
                name: true,
                sku: true
              }
            },
            variant: {
              columns: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!quotation) {
      return c.json(
        { message: "Quotation not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Import PDF generator
    const { generateSimpleQuotationPDF } = await import(
      "../../lib/pdf-generator"
    );

    // Generate PDF buffer
    const pdfBuffer = generateSimpleQuotationPDF(
      quotation as QuotationWithItems
    );

    // Set headers for PDF download
    c.header("Content-Type", "application/pdf");
    c.header(
      "Content-Disposition",
      `attachment; filename="quotation-${quotation.quotationNumber}.pdf"`
    );
    c.header("Content-Length", pdfBuffer.length.toString());

    return c.body(pdfBuffer);
  } catch (error) {
    console.error("Generate PDF error:", error);
    return c.json(
      { message: "Failed to generate PDF" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
