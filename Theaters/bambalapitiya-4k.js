document.addEventListener("DOMContentLoaded", () => {
  const seatContainer = document.getElementById("seating");
  const confirmButton = document.getElementById("confirm-booking");

  const rows = 8;
  const cols = 18;
  const aisleIndex = Math.floor(cols / 2);
  const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  function createSeats() {
    seatContainer.style.gridTemplateColumns = `repeat(${cols + 1}, 1fr)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        if (c === aisleIndex + 1) {
          const aisleSpace = document.createElement("div");
          aisleSpace.classList.add("aisle");
          seatContainer.appendChild(aisleSpace);
        }

        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.textContent = `${rowLetters[r]}${c <= aisleIndex ? c : c - 1}`;
        seat.dataset.seat = `${rowLetters[r]}${c <= aisleIndex ? c : c - 1}`;

        if (r >= 6) {
          seat.classList.add("vip");
          seat.innerHTML += '<span class="vip-badge">VIP</span>';
        }

        seat.addEventListener("click", () => {
          seat.classList.toggle("selected");
        });

        seatContainer.appendChild(seat);
      }
    }
  }

  createSeats();

  confirmButton.addEventListener("click", () => {
    const selectedSeats = document.querySelectorAll(".seat.selected");
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    const seatNames = Array.from(selectedSeats).map(seat => seat.dataset.seat);
    alert(`You have booked the following seats: ${seatNames.join(", ")}`);
  });
});