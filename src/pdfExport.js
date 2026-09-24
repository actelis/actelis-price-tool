/**
 * Actelis Price Tool — PDF Export
 * Matches the Access tool QuoteReport_Letter layout exactly.
 * Logo top-left · address top-right · info block · hw table · services table · footer
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import actelisLogoUrl from "./assets/actelis-logo.png";

const NAVY   = [11,  29,  58];
const AMBER  = [217, 119,  6];
const TEXT   = [30,  30,  30];
const MUTED  = [100, 100, 100];
const LIGHT  = [245, 245, 245];
const BORDER = [180, 180, 180];
const WHITE  = [255, 255, 255];
const HDRBG  = [30,  50,  90];

const TOTAL_PH = "{TOTAL_PAGES}";

const fmt = n =>
  n == null ? "" : `$${Number(n).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 })}`;

function todayStr() {
  return new Date().toLocaleDateString("en-US",
    { weekday:"long", year:"numeric", month:"long", day:"numeric" });
}

// Footer: date | "All prices are in USD" | page | V3.21
function drawFooter(doc) {
  const W  = doc.internal.pageSize.getWidth();
  const H  = doc.internal.pageSize.getHeight();
  const pg = doc.internal.getCurrentPageInfo().pageNumber;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(10, H - 10, W - 10, H - 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(todayStr(),          10,     H - 5);
  doc.text("All prices are in USD", W / 2, H - 5, { align:"center" });
  doc.text(`Page ${pg} of ${TOTAL_PH}`, W - 30, H - 5);
  doc.text("V3.21", W - 10, H - 5, { align:"right" });
}

// Convert logo to PNG via canvas so jsPDF can embed it cleanly
async function fetchLogoPng() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width  = img.naturalWidth  || 300;
        canvas.height = img.naturalHeight || 90;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = actelisLogoUrl;   // Vite-resolved URL — always correct
    setTimeout(() => resolve(null), 4000);
  });
}

// Draw logo: real PNG image if available, else styled text fallback
function drawLogo(doc, x, y, logoPng) {
  if (logoPng) {
    try {
      // Width ~55mm, height proportional (~18mm for the GIF aspect ratio)
      doc.addImage(logoPng, "PNG", x, y - 16, 55, 20);
      return;
    } catch { /* fall through */ }
  }
  drawLogoText(doc, x, y);
}

function drawLogoText(doc, x, y) {
  // Styled italic text logo matching the Actelis brand
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(26);
  doc.setTextColor(...AMBER);
  doc.text("A", x, y);
  const aW = doc.getTextWidth("A");
  doc.setTextColor(...NAVY);
  doc.text("ctelis", x + aW - 1, y);
}

const TAGLINE = "Gigabit-class performance to everyone, and everything, everywhere";

// Company address block, right-aligned at x
function drawAddress(doc, x, y) {
  const lines = [
    { text:"Actelis Networks, Inc.", bold:true },
    { text:"710 Lakeway Drive, Ste 200" },
    { text:"Sunnyvale, CA 94085" },
    { text:"Tel: (510) 545-1045" },
    { text:"Tel: (866) 228-3547" },
    { text:"Fax: (510) 657-8006" },
  ];
  doc.setFontSize(8);
  doc.setTextColor(...TEXT);
  lines.forEach((l, i) => {
    doc.setFont("helvetica", l.bold ? "bold" : "normal");
    doc.text(l.text, x, y + i * 4.6, { align:"right" });
  });
}

export async function exportQuotePDF(quote) {
  const doc = new jsPDF({ unit:"mm", format:"letter", compress:true });
  const W   = doc.internal.pageSize.getWidth();
  const ML  = 14;
  const MR  = 14;
  const CW  = W - ML - MR;
  const qn  = quote.quote_num || "DRAFT";

  // Fetch logo before building (async, canvas → PNG)
  const logoPng = await fetchLogoPng();

  drawFooter(doc);

  // ── HEADER ────────────────────────────────────────────────────────────────
  drawLogo(doc, ML, 22, logoPng);

  // Tagline below logo
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text(TAGLINE, ML, 29);
  drawAddress(doc, W - MR, 10);

  // Amber + thin grey double-rule
  let y = 33;
  doc.setDrawColor(...AMBER);
  doc.setLineWidth(1.2);
  doc.line(ML, y, W - MR, y);
  y += 1.2;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(ML, y, W - MR, y);
  y += 6;

  // ── INFO BLOCK ────────────────────────────────────────────────────────────
  // Left half: Quotation#, Customer Name, Contact, Address, Phone, Email
  // Right half: Date, Valid Until, Payment, Shipping, Quoted By
  const leftFields = [
    ["Quotation #:",       qn],
    ["Customer Name:",     quote.customer    || ""],
    ["Customer Contact:",  quote.contact     || ""],
    ["Address:",           quote.address     || ""],
    ["Phone/Fax:",         quote.phone       || ""],
    ["Email:",             quote.email       || ""],
  ];
  const rightFields = [
    ["Date:",              quote.date        || ""],
    ["Quote Valid Until:", quote.expiry      || ""],
    ["Payment Terms:",     quote.payment     || ""],
    ["Shipping Terms:",    quote.shipping    || ""],
    ["Quoted By:",         quote.quoted_by   || ""],
  ];

  const midX   = W / 2 + 4;
  const lLabel = ML;
  const lValue = ML + 36;
  const rLabel = midX;
  const rValue = midX + 36;
  const rowH   = 5.0;

  doc.setFontSize(8.5);
  const maxRows = Math.max(leftFields.length, rightFields.length);
  for (let i = 0; i < maxRows; i++) {
    const lf = leftFields[i];
    const rf = rightFields[i];
    if (lf) {
      doc.setFont("helvetica","bold");   doc.setTextColor(...TEXT); doc.text(lf[0], lLabel, y);
      doc.setFont("helvetica","normal"); doc.text(lf[1], lValue, y);
    }
    if (rf) {
      doc.setFont("helvetica","bold");   doc.setTextColor(...TEXT); doc.text(rf[0], rLabel, y);
      doc.setFont("helvetica","normal"); doc.text(rf[1], rValue, y);
    }
    y += rowH;
  }
  y += 4;

  // ── HARDWARE LINE ITEMS (grouped by site) ─────────────────────────────────
  const hwLines  = (quote.lines || []).filter(l => !l.is_svc);
  const svcLines = (quote.svc_lines || []);

  const siteMap = {};
  for (const l of hwLines) {
    const s = l.site || "";
    if (!siteMap[s]) siteMap[s] = [];
    siteMap[s].push(l);
  }

  let hwGrandTotal = 0;

  for (const site of Object.keys(siteMap)) {
    const rows = siteMap[site];

    // Site name label
    doc.setFont("helvetica","bold");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT);
    if (site) doc.text(`Site Name: ${site}`, ML, y);
    y += site ? 5 : 0;

    // Table rows
    const body = [];
    let siteTotal = 0;
    for (const l of rows) {
      const lp   = parseFloat(l.list_price || 0);
      const disc = parseFloat(l.discount   || 0);
      const qty  = parseInt(l.qty          || 1);
      const unit = lp * (1 - disc);
      const tot  = unit * qty;
      siteTotal   += tot;
      hwGrandTotal += tot;
      body.push([
        { content: l.pn || "",
          styles: { font:"courier", fontStyle:"bold", fontSize:7.5, textColor:NAVY } },
        { content: l.desc || "",
          styles: { fontSize:8 } },
        { content: fmt(unit),
          styles: { halign:"right", fontSize:8 } },
        { content: String(qty),
          styles: { halign:"center", fontSize:8 } },
        { content: fmt(tot),
          styles: { halign:"right", fontStyle:"bold", fontSize:8 } },
      ]);
    }
    // Site subtotal row
    body.push([
      { content:"Total Site Price", colSpan:4,
        styles:{ fontStyle:"bold", fontSize:8.5, fillColor:LIGHT, halign:"right",
                 cellPadding:{top:2,bottom:2,left:4,right:6} } },
      { content: fmt(siteTotal),
        styles:{ fontStyle:"bold", fontSize:9, halign:"right",
                 fillColor:LIGHT, textColor:NAVY,
                 cellPadding:{top:2,bottom:2,left:4,right:4} } },
    ]);

    autoTable(doc, {
      startY: y,
      margin: { left:ML, right:MR },
      head: [[
        { content:"Part Number", styles:{halign:"left"  } },
        { content:"Description", styles:{halign:"left"  } },
        { content:"Unit Price",  styles:{halign:"right" } },
        { content:"Qty",         styles:{halign:"center"} },
        { content:"Total Price", styles:{halign:"right" } },
      ]],
      body,
      headStyles: {
        fillColor: HDRBG, textColor:WHITE, fontSize:8.5, fontStyle:"bold",
        cellPadding:{top:3,bottom:3,left:4,right:4},
      },
      bodyStyles: {
        fontSize:8, textColor:TEXT,
        cellPadding:{top:3,bottom:3,left:4,right:4},
      },
      columnStyles: {
        0: { cellWidth:30 },
        1: { cellWidth:"auto" },
        2: { cellWidth:26, halign:"right"  },
        3: { cellWidth:14, halign:"center" },
        4: { cellWidth:28, halign:"right"  },
      },
      tableLineColor: BORDER,
      tableLineWidth: 0.2,
      didDrawPage: () => drawFooter(doc),
    });

    y = doc.lastAutoTable.finalY + 3;
  }

  // ── HW TOTAL SUMMARY LINES ────────────────────────────────────────────────
  const svcTotal  = svcLines.reduce((s, sv) => {
    const lp  = parseFloat(sv.list_price || 0);
    const pct = parseFloat(sv.pct        || 0);
    const qty = parseInt(sv.qty          || 1);
    return s + (pct > 0 ? hwGrandTotal * pct * qty : lp * qty);
  }, 0);

  // Financial adjustments
  const shippingAmt = quote.add_ship ? hwGrandTotal * 0.02 : 0;
  const ccFeeAmt    = quote.add_cc   ? hwGrandTotal * 0.03 : 0;
  const taxAmt      = quote.add_tax  ? hwGrandTotal * (parseFloat(quote.tax_rate || 0) / 100) : 0;
  const grandTotal  = hwGrandTotal + svcTotal + shippingAmt + ccFeeAmt + taxAmt;

  const RX  = W - MR;
  const LX  = RX - 84;

  function underlinedLine(label, value, yPos) {
    doc.setFont("helvetica","bold");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT);
    doc.text(label, LX, yPos);
    doc.text(value, RX, yPos, { align:"right" });
    doc.setDrawColor(...TEXT);
    doc.setLineWidth(0.4);
    const lw = doc.getTextWidth(label);
    const vw = doc.getTextWidth(value);
    doc.line(LX, yPos + 0.9, LX + lw, yPos + 0.9);
    doc.line(RX - vw, yPos + 0.9, RX, yPos + 0.9);
  }

  function plainLine(label, value, yPos) {
    doc.setFont("helvetica","normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT);
    doc.text(label, LX, yPos);
    doc.text(value, RX, yPos, { align:"right" });
  }

  underlinedLine("Total Price Excluding Services/Warranty", fmt(hwGrandTotal), y);
  y += 7;
  underlinedLine("Total Price Including Services/Warranty", fmt(hwGrandTotal + svcTotal), y);
  y += 7;

  // Show shipping, CC fee, tax as separate lines if active
  if (shippingAmt > 0) {
    plainLine("Shipping Cost (~2% of hardware total)", fmt(shippingAmt), y);
    y += 5;
  }
  if (ccFeeAmt > 0) {
    plainLine("Credit Card Fee (3% surcharge)", fmt(ccFeeAmt), y);
    y += 5;
  }
  if (taxAmt > 0) {
    plainLine(`Sales Tax (${parseFloat(quote.tax_rate || 0).toFixed(1)}%)`, fmt(taxAmt), y);
    y += 5;
  }
  if (shippingAmt > 0 || ccFeeAmt > 0 || taxAmt > 0) {
    y += 2;
    underlinedLine("Grand Total (All Inclusive)", fmt(grandTotal), y);
    y += 9;
  } else {
    y += 2;
  }

  // ── ADDITIONAL INFORMATION ────────────────────────────────────────────────
  doc.setFont("helvetica","bold");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT);
  doc.text("Additional Information:", ML, y);
  y += 5;
  if (quote.comments) {
    doc.setFont("helvetica","normal");
    doc.setFontSize(8.5);
    const cmtLines = doc.splitTextToSize(quote.comments, CW);
    doc.text(cmtLines, ML, y);
    y += cmtLines.length * 4.5 + 3;
  } else {
    y += 3;
  }

  // ── SERVICES / WARRANTY TABLE ─────────────────────────────────────────────
  if (svcLines.length > 0) {
    doc.setFont("helvetica","bold");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT);
    doc.text("Services/Warranty:", ML, y);
    y += 5;

    const svcBody = svcLines.map(sv => {
      const lp   = parseFloat(sv.list_price || 0);
      const pct  = parseFloat(sv.pct        || 0);
      const qty  = parseInt(sv.qty          || 1);
      const pctStr  = pct > 0 ? `${(pct*100).toFixed(1)}%` : "";
      const unitAmt = pct > 0 ? hwGrandTotal * pct : lp;
      const totAmt  = unitAmt * qty;
      return [
        { content: sv.pn || "",
          styles: { font:"courier", fontStyle:"bold", fontSize:7.5, textColor:NAVY } },
        { content: sv.desc || "", styles:{fontSize:8} },
        { content: pctStr,        styles:{halign:"center",fontSize:8} },
        { content: String(qty),   styles:{halign:"center",fontSize:8} },
        { content: fmt(unitAmt),  styles:{halign:"right", fontSize:8} },
        { content: fmt(totAmt),   styles:{halign:"right", fontStyle:"bold", fontSize:8} },
      ];
    });

    svcBody.push([
      { content:"Total Service/Warranty Price", colSpan:5,
        styles:{ fontStyle:"bold", fontSize:8.5, fillColor:LIGHT, halign:"right",
                 cellPadding:{top:2,bottom:2,left:4,right:6} } },
      { content: fmt(svcTotal),
        styles:{ fontStyle:"bold", fontSize:9, halign:"right",
                 fillColor:LIGHT, textColor:NAVY,
                 cellPadding:{top:2,bottom:2,left:4,right:4} } },
    ]);

    autoTable(doc, {
      startY: y,
      margin: { left:ML, right:MR },
      head: [[
        { content:"Part Number", styles:{halign:"left"  } },
        { content:"Description", styles:{halign:"left"  } },
        { content:"% of LP",     styles:{halign:"center"} },
        { content:"Qty",         styles:{halign:"center"} },
        { content:"Unit Price",  styles:{halign:"right" } },
        { content:"Total Price", styles:{halign:"right" } },
      ]],
      body: svcBody,
      headStyles: {
        fillColor:HDRBG, textColor:WHITE, fontSize:8.5, fontStyle:"bold",
        cellPadding:{top:3,bottom:3,left:4,right:4},
      },
      bodyStyles: {
        fontSize:8, textColor:TEXT,
        cellPadding:{top:3,bottom:3,left:4,right:4},
      },
      columnStyles: {
        0: { cellWidth:28 },
        1: { cellWidth:"auto" },
        2: { cellWidth:18, halign:"center" },
        3: { cellWidth:12, halign:"center" },
        4: { cellWidth:26, halign:"right"  },
        5: { cellWidth:26, halign:"right"  },
      },
      tableLineColor: BORDER,
      tableLineWidth: 0.2,
      didDrawPage: () => drawFooter(doc),
    });

    y = doc.lastAutoTable.finalY + 6;

    // Final grand total — show breakdowns then all-inclusive total
    if (shippingAmt > 0) { plainLine("Shipping Cost (~2% of hardware total)", fmt(shippingAmt), y); y += 5; }
    if (ccFeeAmt    > 0) { plainLine("Credit Card Fee (3% surcharge)", fmt(ccFeeAmt), y); y += 5; }
    if (taxAmt      > 0) { plainLine(`Sales Tax (${parseFloat(quote.tax_rate || 0).toFixed(1)}%)`, fmt(taxAmt), y); y += 5; }
    if (shippingAmt > 0 || ccFeeAmt > 0 || taxAmt > 0) { y += 2; }
    underlinedLine(
      (shippingAmt > 0 || ccFeeAmt > 0 || taxAmt > 0)
        ? "Grand Total (All Inclusive)"
        : "Total Price Including Services/Warranty",
      fmt(grandTotal), y
    );
  }

  // ── SAVE ──────────────────────────────────────────────────────────────────
  doc.putTotalPages(TOTAL_PH);
  const safe = qn.replace(/[/\\:*?"<>|]/g, "_").replace(/\s+/g, "_");
  doc.save(`Actelis_Quote_${safe}.pdf`);
}
