import type { QuoteDraft } from "@/types/quote";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PDF_MARGIN_MM = 8;

function safeFilePart(value: string): string {
  return value
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function preserveVisibleSpacesForCanvasClone(clonedDocument: Document): void {
  const element = clonedDocument.getElementById("printable-quote-sheet");

  if (!element) {
    return;
  }

  const walker = clonedDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    const textNode = currentNode as Text;

    if (textNode.nodeValue?.includes(" ")) {
      textNode.nodeValue = textNode.nodeValue.replace(/ /g, " \u00a0");
    }

    currentNode = walker.nextNode();
  }
}

export async function saveQuoteAsOnePagePdf(quote: QuoteDraft, serviceName: string): Promise<void> {
  const element = document.getElementById("printable-quote-sheet");

  if (!element) {
    throw new Error("Printable quote sheet was not found.");
  }

  const [{ jsPDF }, html2canvasModule] = await Promise.all([import("jspdf"), import("html2canvas")]);
  const html2canvas = html2canvasModule.default;

  await document.fonts.ready;
  element.classList.add("pdf-export-mode");
  await new Promise((resolve) => requestAnimationFrame(resolve));

  let canvas: HTMLCanvasElement;

  try {
    canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 3,
      useCORS: true,
      windowWidth: Math.max(element.scrollWidth, 960),
      onclone: preserveVisibleSpacesForCanvasClone
    });
  } finally {
    element.classList.remove("pdf-export-mode");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true
  });

  const usableWidth = A4_WIDTH_MM - PDF_MARGIN_MM * 2;
  const usableHeight = A4_HEIGHT_MM - PDF_MARGIN_MM * 2;
  const imageRatio = canvas.width / canvas.height;

  let imageWidth = usableWidth;
  let imageHeight = imageWidth / imageRatio;

  if (imageHeight > usableHeight) {
    imageHeight = usableHeight;
    imageWidth = imageHeight * imageRatio;
  }

  const x = (A4_WIDTH_MM - imageWidth) / 2;
  const y = PDF_MARGIN_MM;

  pdf.addImage(canvas.toDataURL("image/jpeg", 0.98), "JPEG", x, y, imageWidth, imageHeight);

  const patient = safeFilePart(quote.patientName) || "patient";
  const service = safeFilePart(serviceName) || "procedure";
  pdf.save(`yoo-quotation-${patient}-${service}.pdf`);
}
