import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function printBookings(bookings) {
  // Create a wrapper to hold all bookings vertically
  const wrapper = document.createElement("div");
  wrapper.style.background = "#fff";
  wrapper.style.padding = "20px";
  wrapper.style.width = "1024px"; // match your template width

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];

    // Load template HTML
    const response = await fetch("/printHwb.html");
    let html = await response.text();

    // Replace placeholders with booking data
    html = html
      .replace("DEREC CO", booking.shipper || "")
      .replace("CUGMAN, CDO", booking.origin_port || "")
      .replace("2020", booking.hwb_number || "");

    // Booking container
    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.marginBottom = "20px";

    wrapper.appendChild(container);

    // Add dashed separator except for the last booking
    if (i < bookings.length - 1) {
      const separator = document.createElement("div");
      separator.style.borderTop = "2px dashed #000";
      separator.style.margin = "30px 0";
      wrapper.appendChild(separator);
    }
  }

  document.body.appendChild(wrapper);

  // Render all in one canvas
  const canvas = await html2canvas(wrapper, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Create PDF
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  let position = 0;
  while (position < imgHeight) {
    pdf.addImage(
      imgData,
      "PNG",
      0,
      -position,
      pageWidth,
      imgHeight
    );
    position += pageHeight;
    if (position < imgHeight) pdf.addPage();
  }

  // Cleanup DOM
  document.body.removeChild(wrapper);

  // Open print dialog
  pdf.autoPrint();
  window.open(pdf.output("bloburl"));
}
