// cinema.js - Theater Details and Reviews Version
const CINEMAS = {
  malabe: {
    id: "malabe",
    name: "QuickFlicks Malabe",
    location: "Malabe, Sri Lanka",
    phone: "+94 11 234 5678",
    openingHours: "9:00 AM - 11:00 PM Daily",
    facilities: [
      "Free Parking", 
      "Wheelchair Access", 
      "Dolby Atmos Sound", 
      "4K Projection",
      "VIP Lounge"
    ],
    theaters: [
      {
        name: "IMAX Experience",
        capacity: 250,
        features: ["Luxury Recliners", "Dolby Atmos", "Laser Projection"],
        screenSize: "22m × 16m"
      },
      {
        name: "3D Cinema",
        capacity: 200,
        features: ["Active 3D", "Dolby Digital", "Comfort Seating"],
        screenSize: "18m × 8m"
      },
      {
        name: "Standard",
        capacity: 150,
        features: ["Premium Seating", "DTS Sound"],
        screenSize: "15m × 6.5m"
      }
    ],
    reviews: [
      {
        author: "CinemaFan123",
        rating: 5,
        date: "2025-03-15",
        comment: "The IMAX theater is incredible! Best movie experience in Colombo."
      },
      {
        author: "MovieBuff",
        rating: 4,
        date: "2025-02-28",
        comment: "Great sound quality but could use more leg room in standard theaters."
      },
      {
        author: "FilmCritic",
        rating: 5,
        date: "2025-03-10",
        comment: "VIP service is worth every penny. The recliners are super comfortable!"
      }
    ]
  },
  
  bambalapitiya: {
    id: "bambalapitiya",
    name: "QuickFlicks Bambalapitiya",
    location: "Bambalapitiya, Colombo",
    phone: "+94 11 555 6789",
    openingHours: "10:00 AM - 12:00 AM Daily",
    facilities: [
      "Valet Parking", 
      "Ocean View Lounge", 
      "Dolby Vision", 
      "4K Laser Projection",
      "Gourmet Food Court",
      "VIP Private Boxes"
    ],
    theaters: [
      {
        name: "Premium 4K Dolby",
        capacity: 220,
        features: ["Dolby Vision", "Atmos Sound", "Leather Recliners"],
        screenSize: "24m × 14m"
      },
      {
        name: "Standard 3D",
        capacity: 180,
        features: ["Active 3D", "DTS:X Sound", "Premium Seating"],
        screenSize: "20m × 10m"
      },
      {
        name: "Family Friendly",
        capacity: 160,
        features: ["Kid-Friendly Volume", "Stadium Seating", "Stroller Access"],
        screenSize: "18m × 9m"
      },
      {
        name: "VIP Lounge",
        capacity: 100,
        features: ["Butler Service", "Private Bar", "Luxury Recliners"],
        screenSize: "15m × 8m"
      }
    ],
    reviews: [
      {
        author: "ColomboMovieGoer",
        rating: 5,
        date: "2025-03-18",
        comment: "The VIP lounge is absolutely worth it! Best cinema experience in Sri Lanka."
      },
      {
        author: "FamilyTraveler",
        rating: 4,
        date: "2025-02-15",
        comment: "Great family theater with perfect volume levels for kids. Loved it!"
      },
      {
        author: "Audiophile",
        rating: 5,
        date: "2025-03-05",
        comment: "The Dolby Atmos in the Premium theater is mind-blowing. Crystal clear sound!"
      }
    ]
  },

  negombo: {
    id: "negombo",
    name: "QuickFlicks Negombo",
    location: "Negombo Beach Road",
    phone: "+94 31 222 3333",
    openingHours: "9:30 AM - 11:30 PM Daily",
    facilities: [
      "Beachfront Location", 
      "Free Parking", 
      "Dolby Digital", 
      "3D Projection",
      "Sea View Cafe",
      "Budget-Friendly Pricing"
    ],
    theaters: [
      {
        name: "Premium 3D",
        capacity: 200,
        features: ["Active 3D", "Dolby Digital", "Recliner Seats"],
        screenSize: "20m × 12m"
      },
      {
        name: "Standard 2D",
        capacity: 150,
        features: ["Comfort Seating", "DTS Sound"],
        screenSize: "16m × 9m"
      }
    ],
    reviews: [
      {
        author: "BeachLover",
        rating: 4,
        date: "2025-03-12",
        comment: "Watching a movie with ocean breeze during intermission - amazing experience!"
      },
      {
        author: "BudgetTraveler",
        rating: 5,
        date: "2025-02-20",
        comment: "Best value cinema on the west coast. Great quality at reasonable prices."
      },
      {
        author: "LocalGuide",
        rating: 4,
        date: "2025-01-30",
        comment: "The Premium theater has excellent sound and picture quality. Highly recommend!"
      }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const cinemaId = document.body.dataset.cinemaId;
  const cinema = CINEMAS[cinemaId];
  
  if (!cinema) {
    console.error("Cinema configuration not found");
    showError();
    return;
  }

  renderCinemaHeader(cinema);
  renderTheaterDetails(cinema);
  renderReviews(cinema);
});

function renderCinemaHeader(cinema) {
  const header = document.querySelector('.cinema-header');
  if (!header) return;
  
  header.innerHTML = `
    <div class="cinema-title">
      <h1><i class="fas fa-film"></i> ${cinema.name}</h1>
      <div class="cinema-location">
        <i class="fas fa-map-marker-alt"></i> ${cinema.location}
      </div>
    </div>
    <div class="cinema-meta">
      <div><i class="fas fa-clock"></i> ${cinema.openingHours}</div>
      <div><i class="fas fa-phone"></i> ${cinema.phone}</div>
    </div>
  `;
}

function renderTheaterDetails(cinema) {
  const container = document.getElementById('theater-details');
  if (!container) return;
  
  container.innerHTML = `
    <div class="facilities-section">
      <h2><i class="fas fa-umbrella-beach"></i> Facilities</h2>
      <div class="facilities-grid">
        ${cinema.facilities.map(facility => `
          <div class="facility-badge">
            <i class="fas fa-check-circle"></i> ${facility}
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="theaters-section">
      <h2><i class="fas fa-theater-masks"></i> Our Theaters</h2>
      <div class="theaters-grid">
        ${cinema.theaters.map(theater => `
          <div class="theater-card">
            <h3>${theater.name}</h3>
            <div class="theater-specs">
              <div><i class="fas fa-users"></i> Capacity: ${theater.capacity}</div>
              <div><i class="fas fa-expand"></i> Screen: ${theater.screenSize}</div>
            </div>
            <div class="theater-features">
              ${theater.features.map(feature => `
                <span><i class="fas fa-star"></i> ${feature}</span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderReviews(cinema) {
  const container = document.getElementById('reviews-container');
  if (!container) return;
  
  if (cinema.reviews && cinema.reviews.length > 0) {
    container.innerHTML += `
      <div class="reviews-grid">
        ${cinema.reviews.map(review => `
          <div class="review-card">
            <div class="review-header">
              <div class="review-author">${review.author}</div>
              <div class="review-rating">
                ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
              </div>
              <div class="review-date">${review.date}</div>
            </div>
            <div class="review-comment">"${review.comment}"</div>
          </div>
        `).join('')}
      </div>
      <button class="add-review-btn">
        <i class="fas fa-plus"></i> Add Your Review
      </button>
    `;
  } else {
    container.innerHTML += `
      <div class="no-reviews">
        <p>No reviews yet. Be the first to review!</p>
        <button class="add-review-btn">
          <i class="fas fa-plus"></i> Add Your Review
        </button>
      </div>
    `;
  }
}

function showError(message = "Failed to load theater details") {
  const container = document.getElementById('theater-details') || document.querySelector('main');
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
      </div>
    `;
  }
}