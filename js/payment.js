document.addEventListener('DOMContentLoaded', function() {
  // Get booking details from session storage
  const bookingDetails = JSON.parse(sessionStorage.getItem('bookingDetails'));
  
  // Format seat information correctly
  const seatDetails = bookingDetails.selectedSeats.map(seat => {
      return `${seat.id} (${seat.type})`;
  }).join(', ');

  // Display booking summary with proper formatting
  document.getElementById('movie-title').textContent += bookingDetails.movieTitle;
  document.getElementById('showtime').textContent += bookingDetails.showtime;
  document.getElementById('seats').textContent += seatDetails;
  document.getElementById('total-price').textContent += `Rs. ${bookingDetails.totalPrice.toLocaleString()}`;

  // Handle form submission
  const paymentForm = document.getElementById('payment-form');
  paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // In a real app, you would process payment here with a payment gateway
      // For this demo, we'll simulate a successful payment
      
      // Generate a unique reference number
      const referenceNumber = 'QF-' + Math.floor(Math.random() * 1000000);
      
      // Store booking confirmation
      const confirmationDetails = {
          ...bookingDetails,
          referenceNumber,
          paymentDate: new Date().toLocaleString()
      };
      
      sessionStorage.setItem('confirmationDetails', JSON.stringify(confirmationDetails));
      
      // Redirect to confirmation page
      window.location.href = 'confirmation.html';
  });
});

// Modify the booking summary display
document.getElementById('movie-title').textContent += bookingDetails.movieTitle;
document.getElementById('showtime').textContent += bookingDetails.showtime;

// Format seat display
const seatDisplay = bookingDetails.selectedSeats.map(seat => seat.id).join(', ');
document.getElementById('seats').textContent += seatDisplay;

// Display total in Rs.
document.getElementById('total-price').textContent += `Rs. ${bookingDetails.totalPrice.toLocaleString()}`;