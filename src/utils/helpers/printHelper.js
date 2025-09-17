import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function printBookings(bookings, mode = "print") {
  // Build the long HTML wrapper
  const wrapper = document.createElement("div");
  wrapper.style.background = "#fff";
  wrapper.style.padding = "20px";
  wrapper.style.width = "1024px";

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];

    const response = await fetch("/printHwb.html");
    let html = await response.text();

    html = html
      .replace(/{{SHIPPER}}/g, booking.shipper || "")
      .replace(/{{ORIGIN}}/g, booking.origin_port || "")
      .replace(/{{DESTINATION}}/g, booking.destination_port || "")
      .replace(/{{HWB}}/g, booking.hwb_number || "");

    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.marginBottom = "20px";
    wrapper.appendChild(container);

    if (i < bookings.length - 1) {
      const separator = document.createElement("div");
      separator.style.borderTop = "2px dashed #000";
      separator.style.margin = "30px 0";
      wrapper.appendChild(separator);
    }
  }

  document.body.appendChild(wrapper);

  // Render to canvas
  const canvas = await html2canvas(wrapper, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Build PDF
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  let position = 0;
  while (position < imgHeight) {
    pdf.addImage(imgData, "PNG", 0, -position, pageWidth, imgHeight);
    position += pageHeight;
    if (position < imgHeight) pdf.addPage();
  }

  document.body.removeChild(wrapper);

  // Actions
  if (mode === "download") {
    pdf.save("Waybills.pdf");
  } else {
    pdf.autoPrint();

    // Open the PDF in a new tab with autoPrint embedded
    const printWindow = window.open(pdf.output("bloburl"), "_blank");

    if (printWindow) {
      // Close tab after printing dialog closes
      printWindow.addEventListener("afterprint", () => {
        printWindow.close();
      });
    }
  }
}
