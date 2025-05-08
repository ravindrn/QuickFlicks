// /js/theater.js
document.addEventListener('DOMContentLoaded', function() {
  // Get current theater ID from URL (e.g., 'malabe-imax.html' -> 'malabe-imax')
  const theaterId = window.location.pathname.split('/').pop().replace('.html', '');
  const config = getTheaterConfig(theaterId);
  
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
  
  // Set theater name based on ID
  const theaterName = {
    'malabe-imax': 'IMAX Experience - QuickFlicks Malabe',
    'malabe-3d': '3D Cinema - QuickFlicks Malabe',
    'malabe-standard': 'Standard - QuickFlicks Malabe',
    'bambalapitiya-4k': 'Premium 4K Dolby - QuickFlicks Bambalapitiya',
    'bambalapitiya-3d': 'Standard 3D - QuickFlicks Bambalapitiya',
    'bambalapitiya-family': 'Family Friendly - QuickFlicks Bambalapitiya',
    'bambalapitiya-vip': 'VIP Lounge - QuickFlicks Bambalapitiya',
    'negombo-3d': 'Premium 3D - QuickFlicks Negombo',
    'negombo-2d': 'Standard 2D - QuickFlicks Negombo'
  }[theaterId] || 'Theater';
  
  document.getElementById('theater-name').textContent = theaterName;
  
  // Generate seats
  const container = document.getElementById('seats-container');
  let selectedSeats = [];
  
  for (let row = 0; row < config.rows; row++) {
    const rowLetter = String.fromCharCode(65 + row);
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
          selectedSeats = selectedSeats.filter(s => s.id !== seatId);
        } else {
          this.classList.add('selected');
          
          const rowNum = rowLetter.charCodeAt(0) - 65;
          const isPremium = config.premiumRows.includes(rowNum);
          const price = isPremium ? 
            (config.price.premium || config.price.standard) : 
            (theaterId === 'bambalapitiya-family' && rowNum >= 4 ? config.price.child : config.price.standard);
          
          selectedSeats.push({
            id: seatId,
            type: isPremium ? 'premium' : (theaterId === 'bambalapitiya-family' && rowNum >= 4 ? 'child' : 'standard'),
            price: price
          });
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
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    totalPriceElement.textContent = `Rs. ${totalPrice.toLocaleString()}`;
  }
  
  // Confirm booking button
  document.getElementById('confirm-booking').addEventListener('click', function() {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    // Calculate total price
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    
    // At the start of your script
const today = new Date().toISOString().split('T')[0];
document.getElementById('booking-date').min = today;

// In your confirm booking handler
const bookingDate = document.getElementById('booking-date').value;

// Generate a reference number
function generateReferenceNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'QF-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const bookingDetails = {
  referenceNumber: generateReferenceNumber(),
  movieTitle: decodeURIComponent(movieTitle),
  cinema: 'QuickFlicks Malabe',
  theaterType: '3D Cinema',
  showtime: showtime,
  bookingDate: bookingDate,
  selectedSeats: selectedSeats.map(seat => ({
    id: seat.id,
    type: seat.type,
    price: seat.price
  })),
  totalPrice: totalPrice,
  currency: 'LKR'
};

sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    
    // Redirect to payment page
    window.location.href = '../payment.html';
  });
});

// In the seat generation loop (around line 40 in previous code)
for (let seatNum = 1; seatNum <= config.seatsPerRow; seatNum++) {
  const seatId = `${rowLetter}${seatNum}`;
  const seat = document.createElement('div');
  seat.className = 'seat';
  seat.dataset.seat = seatId;
  
  // Add seat number label
  const seatNumber = document.createElement('span');
  seatNumber.className = 'seat-number';
  seatNumber.textContent = seatNum;
  seat.appendChild(seatNumber);
  
  // Rest of seat setup...
}

// In the updateBookingSummary function
function updateBookingSummary() {
  const selectedSeatsCount = document.getElementById('selected-seats-count');
  const totalPriceElement = document.getElementById('total-price');
  
  // Display seat numbers
  const seatNumbers = selectedSeats.map(seat => seat.id).join(', ');
  selectedSeatsCount.textContent = `${selectedSeats.length} (${seatNumbers})`;
  
  // Calculate and display total in Rs.
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  totalPriceElement.textContent = `Rs. ${totalPrice.toLocaleString()}`;
}