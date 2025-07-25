// src/lib/utils/pdf-generator.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface WishlistProduct {
  id: string;
  name: string;
  price: string;
  description?: string;
  stockQuantity?: number;
  variants?: any[];
}

export const generateWishlistPDF = async (products: WishlistProduct[]) => {
  const doc = new jsPDF();

  // Add logo to the header
  const logoUrl = "/assets/gamezonetech.png"; // Path to the logo
  const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve("");
      img.src = url;
    });
  };

  const logoBase64 = await loadImageAsBase64(logoUrl);
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 20, 10, 30, 30); // Add logo to the top-left corner
  }

  // Add company name and tagline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22); // Increased font size for "Game Zone Tech"
  doc.setTextColor(245, 158, 11); // Amber color
  doc.text("Game Zone Tech", 55, 20); // Position next to the logo

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100); // Gray color
  doc.text("Your Trusted Tech Partner", 55, 25);

  // Add contact information
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text("Email: gamezonetechinfo@gmail.com", 20, 50);
  doc.text("Contact: +94 76 023 0340 | +94 71 930 8389", 20, 45);

  // Add separator line below the header
  doc.setLineWidth(0.5);
  doc.setDrawColor(245, 158, 11); // Amber color
  doc.line(20, 55, 190, 55); // Horizontal line across the page

  // Add date
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 65);

  // Add customer info section
  doc.setFontSize(12);
  doc.text("Customer Information:", 20, 80);
  doc.setFontSize(10);
  doc.text("Name: _________________________", 20, 90);
  doc.text("Email: _________________________", 20, 100);
  doc.text("Phone: _________________________", 20, 110);
  doc.text("Company: _________________________", 20, 120);

  // Calculate total price
  const totalPrice = products.reduce((sum, product) => {
    const price = parseFloat(product.price.replace(/[^\d.-]/g, ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  // Prepare table data
  const tableData = products.map((product, index) => [
    index + 1,
    product.name,
    `LKR ${product.price}`,
    product.stockQuantity && product.stockQuantity > 0
      ? "In Stock"
      : "Out of Stock",
    "1", // Default quantity requested set to 1
  ]);

  // Add table
  autoTable(doc, {
    head: [
      ["#", "Product Name", "Unit Price", "Availability", "Qty Requested"],
    ],
    body: tableData,
    startY: 130,
    theme: "grid",
    headStyles: {
      fillColor: [245, 158, 11], // Amber color
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 80 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
    },
  });

  // Add total price section
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Total Estimated Price:", 20, finalY);
  doc.setFontSize(14);
  doc.setTextColor(245, 158, 11); // Amber color
  doc.text(
    `LKR ${totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    20,
    finalY + 10
  );

  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Black color for footer text
  doc.text("Notes/Special Requirements:", 20, finalY + 30);
  doc.text(
    "_________________________________________________________",
    20,
    finalY + 40
  );
  doc.text(
    "_________________________________________________________",
    20,
    finalY + 50
  );
  doc.text(
    "_________________________________________________________",
    20,
    finalY + 60
  );

  // Add contact info
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0); // Black color for contact info
  doc.text(
    "Contact us: +94 76 023 0340 | gamezonetechinfo@gmail.com",
    20,
    finalY + 80
  );
  doc.text(
    "Visit us: No.20 Suderis Silva Mawatha, Horana, Sri Lanka",
    20,
    finalY + 90
  );

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `wishlist-quotation-${timestamp}.pdf`;

  // Download the PDF
  doc.save(filename);
};
