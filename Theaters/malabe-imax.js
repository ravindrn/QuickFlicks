document.addEventListener("DOMContentLoaded", () => {
  const seatContainer = document.getElementById("seating");
  const confirmButton = document.getElementById("confirm-booking");

  const rows = 10; 
  const cols = 24; 
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

        seat.addEventListener("click", () => {
          if (!seat.classList.contains("occupied")) {
            seat.classList.toggle("selected");
          }
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

document.addEventListener('DOMContentLoaded', function() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const movieTitle = urlParams.get('movie');
  const showtime = urlParams.get('time');
  
  // Set movie title and showtime
  if (movieTitle) {
    document.getElementById('movie-title').textContent = decodeURIComponent(movieTitle);
  }
  
  if (showtime) {
    document.getElementById('showtime').textContent = showtime;
  }
  
  // Theater configuration
  const config = {
    rows: 8,
    seatsPerRow: 12,
    premiumRows: [0, 1], // First two rows are premium
    price: {
      standard: 1500,
      premium: 2000
    },
    bookedSeats: ['A5', 'B3', 'C7', 'D4'] // Sample booked seats
  };
  
  // Generate seats
  const container = document.getElementById('seats-container');
  let selectedSeats = [];
  
  for (let row = 0; row < config.rows; row++) {
    const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';
    
    for (let seatNum = 1; seatNum <= config.seatsPerRow; seatNum++) {
      const seatId = `${rowLetter}${seatNum}`;
      const seat = document.createElement('div');
      seat.className = 'seat';
      seat.dataset.seat = seatId;
      
      // Check if seat is premium
      if (config.premiumRows.includes(row)) {
        seat.classList.add('premium');
      } else {
        seat.classList.add('standard');
      }
      
      // Check if seat is booked
      if (config.bookedSeats.includes(seatId)) {
        seat.classList.add('booked');
        seat.classList.remove('available');
      } else {
        seat.classList.add('available');
      }
      
      seat.addEventListener('click', function() {
        if (this.classList.contains('booked')) return;
        
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          selectedSeats = selectedSeats.filter(s => s !== seatId);
        } else {
          this.classList.add('selected');
          selectedSeats.push(seatId);
        }
        
        updateBookingSummary();
      });
      
      rowDiv.appendChild(seat);
    }
    
    container.appendChild(rowDiv);
  }
  
  // Update booking summary
  function updateBookingSummary() {
    const selectedSeatsCount = document.getElementById('selected-seats-count');
    const totalPriceElement = document.getElementById('total-price');
    
    selectedSeatsCount.textContent = selectedSeats.length;
    
    // Calculate total price
    let totalPrice = 0;
    selectedSeats.forEach(seatId => {
      const rowLetter = seatId.charAt(0);
      const rowNum = rowLetter.charCodeAt(0) - 65;
      const isPremium = config.premiumRows.includes(rowNum);
      totalPrice += isPremium ? config.price.premium : config.price.standard;
    });
    
    totalPriceElement.textContent = `Rs. ${totalPrice.toLocaleString()}`;
  }
  
  // Confirm booking button
  document.getElementById('confirm-booking').addEventListener('click', function() {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    // Calculate total price
    let totalPrice = 0;
    const seatDetails = selectedSeats.map(seatId => {
      const rowLetter = seatId.charAt(0);
      const rowNum = rowLetter.charCodeAt(0) - 65;
      const isPremium = config.premiumRows.includes(rowNum);
      const price = isPremium ? config.price.premium : config.price.standard;
      
      totalPrice += price;
      
      return {
        seat: seatId,
        type: isPremium ? 'premium' : 'standard',
        price: price
      };
    });
    
    // Store booking details
    const bookingDetails = {
      movieTitle: decodeURIComponent(movieTitle),
      cinema: 'QuickFlicks Malabe',
      theaterType: 'IMAX',
      showtime: showtime,
      selectedSeats: seatDetails,
      totalPrice: totalPrice,
      currency: 'LKR'
    };
    
    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    
    // Redirect to payment page
    window.location.href = '../payment.html';
  });
});
