document.addEventListener("DOMContentLoaded", () => {
  const seatContainer = document.getElementById("seating");
  const confirmButton = document.getElementById("confirm-booking");

  // Theater configuration
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]; // 8 rows
  const seatsPerRow = 16; // Total seats per row (8 each side)
  const aisleAfter = 8; // Aisle after seat 8

  function createTheater() {
    seatContainer.innerHTML = '';
    
    rows.forEach(row => {
      // Add row indicator
      const rowIndicator = document.createElement("div");
      rowIndicator.className = "row-indicator";
      rowIndicator.textContent = `Row ${row}`;
      seatContainer.appendChild(rowIndicator);

      // Create seats for this row
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        // Add aisle space
        if (seatNum === aisleAfter + 1) {
          const aisle = document.createElement("div");
          aisle.className = "aisle-space";
          aisle.innerHTML = '<i class="fas fa-arrows-alt-h"></i>';
          seatContainer.appendChild(aisle);
        }

        const seat = document.createElement("div");
        seat.className = "seat";
        seat.dataset.seat = `${row}${seatNum}`;
        
        // Add click handler
        seat.addEventListener("click", () => {
          seat.classList.toggle("selected");
        });

        seatContainer.appendChild(seat);
      }
    });
  }

  createTheater();

  confirmButton.addEventListener("click", () => {
    const selectedSeats = document.querySelectorAll(".seat.selected");
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    const seatNames = Array.from(selectedSeats).map(seat => seat.dataset.seat);
    alert(`Booked seats: ${seatNames.join(", ")}`);
    
    // In real app: window.location.href = `booking-confirm.html?seats=${seatNames.join(',')}`;
  });
});