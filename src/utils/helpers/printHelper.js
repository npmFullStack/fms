import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Helper function to format volume display
function getVolumeDisplay(booking) {
    if (!booking.quantity) return "";
    
    // Check if we have container data
    if (booking.containers && booking.containers.length > 0) {
        // Get the first container's size (assuming all containers are same size for this booking)
        const containerSize = booking.containers[0]?.size || "";
        return `${booking.quantity}X${containerSize}`;
    }
    
    // Fallback to just quantity if no container data
    return `${booking.quantity}X`;
}

// Add this helper function
function getLocationDisplay(booking) {
    // If pickup_location exists, use it
    if (booking.pickup_location) return booking.pickup_location;
    
    // Otherwise, build from address components
    if (booking.pickup_city && booking.pickup_province) {
        return `${booking.pickup_city}, ${booking.pickup_province}`;
    }
    
    return "";
}

function getDeliveryLocationDisplay(booking) {
    // If delivery_location exists, use it
    if (booking.delivery_location) return booking.delivery_location;
    
    // Otherwise, build from address components
    if (booking.delivery_city && booking.delivery_province) {
        return `${booking.delivery_city}, ${booking.delivery_province}`;
    }
    
    return "";
}


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

        // Replace ALL placeholders with actual data
        html = html
            .replace(/{{SHIPPER}}/g, booking.shipper || "")
            .replace(/{{ORIGIN}}/g, booking.origin_port || "")
            .replace(/{{DESTINATION}}/g, booking.destination_port || "")
            .replace(/{{HWB#}}/g, booking.hwb_number || "")
            .replace(/{{COMMODITY}}/g, booking.commodity || "")
            .replace(/{{SHIPPER PHONE NUMBER}}/g, booking.shipper_phone || "")
            .replace(/{{CONSIGNEE}}/g, booking.consignee || "")
            .replace(/{{CONSIGNEE PHONE NUMBER}}/g, booking.consignee_phone || "")
            .replace(/{{VOLUME}}/g, getVolumeDisplay(booking)) 
            .replace(/{{COMMODITY}}/g, booking.commodity || "")
            .replace(/{{VAN_NUMBER}}/g, booking.container_vans || "")
.replace(/{{PICKUP_LOCATION}}/g, getLocationDisplay(booking))
    .replace(/{{DELIVERY_LOCATION}}/g, getDeliveryLocationDisplay(booking));

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
        const printWindow = window.open(pdf.output("bloburl"), "_blank");
        
        if (printWindow) {
            printWindow.addEventListener("afterprint", () => {
                printWindow.close();
            });
        }
    }
}


export async function printCargoMonitoring(bookingIds, mode = "print") {
  try {
    // 🔹 Fetch full data from backend
    const response = await fetch(`/api/bookings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: bookingIds }),
    });

    if (!response.ok) throw new Error("Failed to fetch monitoring data");

    const bookings = await response.json();

    // 🔹 Use new HTML template
    return await buildPdfFromHtml(bookings, "/printCargoMonitoring.html", mode);
  } catch (err) {
    console.error("printCargoMonitoring error:", err);
    alert("Failed to generate Cargo Monitoring PDF");
  }
}

/**
 * Shared PDF builder
 */
async function buildPdfFromHtml(bookings, templateUrl, mode = "print") {
  // Build wrapper
  const wrapper = document.createElement("div");
  wrapper.style.background = "#fff";
  wrapper.style.padding = "20px";
  wrapper.style.width = "1024px";

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];

    // Fetch template HTML
    const response = await fetch(templateUrl);
    let html = await response.text();

    // Replace placeholders (add more as needed)
    html = html
      .replace(/{{SHIPPER}}/g, booking.shipper || "")
      .replace(/{{ORIGIN}}/g, booking.origin_port || "")
      .replace(/{{DESTINATION}}/g, booking.destination_port || "")
      .replace(/{{HWB}}/g, booking.hwb_number || "")
      .replace(/{{STATUS}}/g, booking.status || "")
      .replace(/{{MODE}}/g, booking.booking_mode || "")
      .replace(/{{CONTAINERS}}/g,
        (booking.containers || [])
          .map(c => `${c.van_number} (${c.size})`)
          .join(", ")
      );

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
    pdf.save("HouseWayBill.pdf");
  } else {
    pdf.autoPrint();
    const printWindow = window.open(pdf.output("bloburl"), "_blank");
    if (printWindow) {
      printWindow.addEventListener("afterprint", () => {
        printWindow.close();
      });
    }
  }
}
