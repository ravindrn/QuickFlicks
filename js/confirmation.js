document.addEventListener('DOMContentLoaded', function() {
  const confirmationDetails = JSON.parse(sessionStorage.getItem('bookingDetails'));
  
  if (!confirmationDetails) {
    window.location.href = '../index.html';
    return;
  }

  // Format date for display (e.g., "15 June 2023")
  const bookingDate = new Date(confirmationDetails.bookingDate);
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Format seat information
  const seatDetails = confirmationDetails.selectedSeats.map(seat => {
    return `${seat.id} (${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)})`;
  }).join(', ');

  // Display confirmation details
  document.getElementById('confirmation-ref').textContent += confirmationDetails.referenceNumber;
  document.getElementById('confirmation-movie').textContent += confirmationDetails.movieTitle;
  document.getElementById('confirmation-cinema').textContent += confirmationDetails.cinema;
  document.getElementById('confirmation-theater').textContent += confirmationDetails.theaterType;
  document.getElementById('confirmation-date').textContent += formattedDate;
  document.getElementById('confirmation-showtime').textContent += confirmationDetails.showtime;
  document.getElementById('confirmation-seats').textContent += seatDetails;
  document.getElementById('confirmation-total').textContent += `Rs. ${confirmationDetails.totalPrice.toLocaleString()}`;
});

document.getElementById('print-ticket').addEventListener('click', function() {
  const bookingDetails = JSON.parse(sessionStorage.getItem('bookingDetails'));
  const moviePoster = bookingDetails.moviePoster || 'https://via.placeholder.com/500x750';
  
  // Generate QR code data
  const qrData = JSON.stringify({
    ref: bookingDetails.referenceNumber,
    movie: bookingDetails.movieTitle,
    cinema: bookingDetails.cinema,
    showtime: `${bookingDetails.bookingDate} ${bookingDetails.showtime}`,
    seats: bookingDetails.selectedSeats.map(s => s.id).join(',')
  });
  // Create ticket HTML with background image
  const ticketHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>QuickFlicks Ticket - ${bookingDetails.movieTitle}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        
        body {
  font-family: 'Orbitron', sans-serif;
  margin: 0;
  padding: 0;
  background: #0D1321;
  color: #EAEAEA;
}

.qr-code {
          width: 150px;
          height: 150px;
          margin: 0 auto;
          padding: 10px;
          background: white;
          border-radius: 10px;
        }
        .qr-code canvas {
          width: 100% !important;
          height: auto !important;
        }

.ticket-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(13, 19, 33, 0.95);
  position: relative;
  padding: 20px;
}

.ticket-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url('${moviePoster}') center/cover no-repeat;
  opacity: 0.2;
  z-index: -1;
}

.ticket {
  width: 100%;
  max-width: 540px;
  background: #1A1A1A;
  border: 2px solid #00FFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.ticket-header {
  background: linear-gradient(135deg, #FF1493, #00BFFF);
  padding: 20px;
  text-align: center;
  color: #fff;
}

.ticket-header h2 {
  margin: 0;
  font-size: 24px;
  letter-spacing: 1.5px;
  text-shadow: 0 0 8px #000;
}

.ticket-body {
  padding: 20px;
}

.movie-title {
  font-size: 22px;
  margin-bottom: 15px;
  color: #00FFFF;
  text-align: center;
  text-shadow: 0 0 8px #00FFFF;
}

.ticket-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.ticket-label {
  font-weight: 600;
  color: #FF1493;
}

.ticket-value {
  color: #EAEAEA;
  text-align: right;
  word-break: break-word;
}

.ticket-qr {
  margin-top: 20px;
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px dashed #00FFFF;
  border-radius: 10px;
}

.qr-placeholder {
  width: 100px;
  height: 100px;
  background: #fff;
  color: #000;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 8px;
}

.ticket-footer {
  background: #0D1321;
  padding: 10px;
  font-size: 10px;
  text-align: center;
  border-top: 1px solid #00FFFF;
}

.ticket-footer p {
  margin: 4px 0;
}

@media print {
  body {
    background: #fff !important;
  }
  .ticket {
    box-shadow: none;
    border: none;
    margin: 0;
    width: 100%;
    max-width: 100%;
  }
}

        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="ticket">
          <div class="ticket-header">
            <h2>QuickFlicks e-Ticket</h2>
          </div>
          <div class="ticket-body">
            <div class="movie-title">${bookingDetails.movieTitle}</div>
            
            <div class="ticket-row">
              <div class="ticket-label">Reference:</div>
              <div class="ticket-value">${bookingDetails.referenceNumber}</div>
            </div>
            
            <div class="ticket-row">
              <div class="ticket-label">Cinema:</div>
              <div class="ticket-value">${bookingDetails.cinema}</div>
            </div>
            
            <div class="ticket-row">
              <div class="ticket-label">Theater:</div>
              <div class="ticket-value">${bookingDetails.theaterType}</div>
            </div>
            
            <div class="ticket-row">
              <div class="ticket-label">Date:</div>
              <div class="ticket-value">${
                new Date(bookingDetails.bookingDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              }</div>
              
            </div>
            
            <div class="ticket-row">
              <div class="ticket-label">Time:</div>
              <div class="ticket-value">${bookingDetails.showtime}</div>
            </div>
            
            <div class="ticket-row">
              <div class="ticket-label">Seats:</div>
              <div class="ticket-value">${
                bookingDetails.selectedSeats.map(s => `${s.id} (${s.type})`).join(', ')
              }</div>
            </div>
            
            <div class="ticket-row">
              <div class="ticket-label">Total:</div>
              <div class="ticket-value">Rs. ${bookingDetails.totalPrice.toLocaleString()}</div>
            </div>
            
            <div class="ticket-qr">
              <div class="qr-placeholder">QR Code</div>
              <p>Scan this code at theater entrance</p>
            </div>
          </div>
          
          <div class="ticket-footer">
            <p>Thank you for choosing QuickFlicks! Enjoy your movie experience.</p>
            <p>• Ticket valid only for selected showtime • No refunds or exchanges •</p>
            <p>Present this ticket at concession for 10% discount</p>
          </div>
        </div>
      </div>
      
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <script>
        // Generate PDF
        setTimeout(() => {
          const element = document.querySelector('.ticket');
          const opt = {
            margin: 10,
            filename: 'QuickFlicks_Ticket_${bookingDetails.referenceNumber}.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
          };
          
          // Generate PDF
          html2pdf().set(opt).from(element).save().then(() => {
            // Close the window after PDF is generated
            setTimeout(() => window.close(), 1000);
          });
        }, 500);
      </script>
    </body>
    </html>
  `;

  // Open new window for PDF generation
  const ticketWindow = window.open('', '_blank');
  ticketWindow.document.write(ticketHTML);
  ticketWindow.document.close();
});