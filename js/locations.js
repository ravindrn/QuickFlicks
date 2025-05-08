const API_KEY = "cedbcf55b9ffbc8d9be7dcf1ec42d3d5"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w300";


const cinemas = [
  {
    id: "malabe",
    name: "QuickFlicks Malabe",
    location: "Malabe, Sri Lanka",
    phone: "+94 11 234 5678",
    theaters: 3,
    features: [
      "IMAX with Laser",
      "Dolby Atmos",
      "Luxury Recliners",
      "VIP Lounge"
    ],
    capacity: [
      { name: "Theater 1 (IMAX)", seats: 250 },
      { name: "Theater 2 (3D)", seats: 200 },
      { name: "Theater 3 (Standard)", seats: 150 }
    ]
  },
  {
    id: "bambalapitiya",
    name: "QuickFlicks Bambalapitiya",
    location: "Bambalapitiya, Colombo",
    phone: "+94 11 555 6789",
    theaters: 4,
    features: [
      "Dolby Vision",
      "Private Screenings",
      "Gourmet Food",
      "Valet Parking"
    ],
    capacity: [
      { name: "Theater 1 (4K Dolby)", seats: 220 },
      { name: "Theater 2 (3D)", seats: 180 },
      { name: "Theater 3 (Family)", seats: 160 },
      { name: "Theater 4 (VIP)", seats: 100 }
    ]
  },
  {
    id: "negombo",
    name: "QuickFlicks Negombo",
    location: "Negombo, Sri Lanka",
    phone: "+94 31 222 3333",
    theaters: 2,
    features: [
      "Ocean View Lounge",
      "Budget Pricing",
      "Free Parking",
      "Beachside Location"
    ],
    capacity: [
      { name: "Theater 1 (Premium 3D)", seats: 200 },
      { name: "Theater 2 (Standard)", seats: 150 }
    ]
  }
];

async function fetchNowPlayingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&region=US`);
    const data = await response.json();
    return data.results.slice(0, 8); 
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

async function renderCinemaLocations() {
  const container = document.getElementById('locations-container');
  const movies = await fetchNowPlayingMovies();

  container.innerHTML = cinemas.map(cinema => {
    const previewMovies = [...movies]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return `
      <a href="cinemas/${cinema.id}.html" class="location-card">
        <h2><i class="fas fa-map-marker-alt"></i> ${cinema.name}</h2>
        <div class="location-info">
          <div><i class="fas fa-location-dot"></i> ${cinema.location}</div>
          <div><i class="fas fa-film"></i> ${cinema.theaters} Theaters</div>
          <div><i class="fas fa-phone"></i> ${cinema.phone}</div>
        </div>
        
        <div class="current-movies">
          <h3><i class="fas fa-ticket-alt"></i> Now Showing Preview</h3>
          <div class="movie-posters">
            ${previewMovies.map(movie => `
              <img src="${movie.poster_path ? IMAGE_URL + movie.poster_path : 'images/poster-placeholder.jpg'}" 
                   alt="${movie.title}" 
                   title="${movie.title}"
                   onerror="this.src='images/poster-placeholder.jpg'">
            `).join('')}
          </div>
        </div>
        
        <div class="location-features">
          <h3><i class="fas fa-star"></i> Premium Features</h3>
          <ul>
            ${cinema.features.map(feature => `
              <li><i class="fas fa-check-circle"></i> ${feature}</li>
            `).join('')}
          </ul>
        </div>
        
        <div class="view-showtimes">
          <i class="fas fa-calendar-alt"></i> View All Showtimes
        </div>
      </a>
    `;
  }).join('') || '<div class="error">No cinema locations found</div>';
}

document.addEventListener('DOMContentLoaded', renderCinemaLocations);


function setActiveNavLink() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const locationsLink = document.querySelector('a[href="locations.html"]');
  if (locationsLink) {
    locationsLink.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCinemaLocations();
  setActiveNavLink(); 
});