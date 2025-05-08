const API_KEY = "cedbcf55b9ffbc8d9be7dcf1ec42d3d5";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// DOM Elements
const heroSlide = document.querySelector('.hero-slide');
const movieTitle = document.getElementById('movie-title');
const movieOverview = document.getElementById('movie-overview');
const trailerButton = document.getElementById('trailer-button');
const nowShowingGrid = document.getElementById('now-showing-movies');
const comingSoonGrid = document.getElementById('coming-soon-movies');
const prevBtn = document.getElementById('prev-hero');
const nextBtn = document.getElementById('next-hero');
const heroBuyTicketsBtn = document.getElementById('hero-buy-tickets');

// State
let trendingMovies = [];
let currentHeroIndex = 0;
let carouselInterval;

// Initialize
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  fetchTrendingMovies();
  fetchNowShowing();
  fetchComingSoon();
  
  // Setup event listeners
  prevBtn.addEventListener('click', showPrevMovie);
  nextBtn.addEventListener('click', showNextMovie);
  
  // Handle trailer buttons
  document.addEventListener('click', handleTrailerClick);
}


// ===== HERO CAROUSEL FUNCTIONS =====
async function fetchTrendingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    trendingMovies = data.results.slice(0, 5); // Get top 5 trending
    
    if (trendingMovies.length > 0) {
      loadHeroMovie(currentHeroIndex);
      startCarousel();
    } else {
      movieOverview.textContent = "No trending movies found";
    }
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    movieOverview.textContent = "Error loading featured movies";
  }
}


async function loadHeroMovie(index) {
  const movie = trendingMovies[index];
  if (!movie) return;

  heroSlide.style.opacity = 0;
  
  setTimeout(() => {
    heroSlide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${IMAGE_URL}${movie.backdrop_path || movie.poster_path})`;
    movieTitle.textContent = movie.title;
    movieOverview.textContent = movie.overview || "Description not available";
    
    // Update hero buy tickets button with movie data
    heroBuyTicketsBtn.href = `select-cinema.html?movie=${encodeURIComponent(movie.title)}`;
    
    fetchTrailerForHero(movie.id);
    heroSlide.style.opacity = 1;
  }, 300);
}

async function fetchTrailerForHero(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    
    const trailerBtn = document.getElementById('trailer-button');
    if (trailer) {
      trailerBtn.href = `https://youtube.com/watch?v=${trailer.key}`;
      trailerBtn.style.display = 'flex';
    } else {
      trailerBtn.style.display = 'none';
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
  }
}

function startCarousel() {
  clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    showNextMovie();
  }, 5000);
}

function showPrevMovie() {
  currentHeroIndex = (currentHeroIndex - 1 + trendingMovies.length) % trendingMovies.length;
  loadHeroMovie(currentHeroIndex);
  startCarousel(); // Reset timer when manually navigating
}

function showNextMovie() {
  currentHeroIndex = (currentHeroIndex + 1) % trendingMovies.length;
  loadHeroMovie(currentHeroIndex);
  startCarousel(); // Reset timer when manually navigating
}

// ===== MOVIE GRID FUNCTIONS =====
async function fetchNowShowing() {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&region=US`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      displayMovies(data.results, nowShowingGrid, true);
    } else {
      nowShowingGrid.innerHTML = '<div class="error">No movies currently showing</div>';
    }
  } catch (error) {
    console.error("Error fetching now showing:", error);
    nowShowingGrid.innerHTML = '<div class="error">Error loading movies</div>';
  }
}

async function fetchComingSoon() {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&region=US`);
    const data = await response.json();
    
    // Filter movies with release dates
    const upcomingMovies = data.results.filter(movie => movie.release_date);
    
    if (upcomingMovies.length > 0) {
      displayMovies(upcomingMovies, comingSoonGrid, false);
    } else {
      comingSoonGrid.innerHTML = '<div class="error">No upcoming movies found</div>';
    }
  } catch (error) {
    console.error("Error fetching coming soon:", error);
    comingSoonGrid.innerHTML = '<div class="error">Error loading upcoming movies</div>';
  }
}

function displayMovies(movies, container, isNowShowing) {
  container.innerHTML = '';
  
  movies.slice(0, 8).forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const releaseDate = movie.release_date 
      ? new Date(movie.release_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : 'Coming soon';
    
    card.innerHTML = `
      <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" onerror="this.src='placeholder.jpg'">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p class="movie-date">${releaseDate}</p>
        <div class="movie-actions">
          <a href="#" class="watch-trailer-btn" data-id="${movie.id}">TRAILER</a>
          ${isNowShowing 
            ? `<a href="select-cinema.html" class="buy-tickets-btn" data-movie-id="${movie.id}" data-movie-title="${encodeURIComponent(movie.title)}">TICKETS</a>`
            : '<a href="#" class="notify-btn">NOTIFY ME</a>'}
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function handleTrailerClick(e) {
  if (e.target.classList.contains('watch-trailer-btn')) {
    e.preventDefault();
    const movieId = e.target.getAttribute('data-id');
    showTrailer(movieId);
  }
}

async function showTrailer(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    
    if (trailer) {
      window.open(`https://youtube.com/watch?v=${trailer.key}`, '_blank');
    } else {
      alert('No trailer available for this movie');
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    alert('Error loading trailer. Please try again later.');
  }
}


// In script.js - Add these new functions

// Load movies page content
function loadMoviesPage() {
  if (window.location.pathname.includes('movies.html')) {
    fetchNowShowingMovies();
    setupFilters();
  }
}

// Enhanced movie fetching for movies page
async function fetchNowPlayingMovies() {
  try {
    showLoadingSpinner();
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&region=US`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    allMovies = data.results || [];
    
    // Debugging - log all movies and their genres
    console.log('All Movies:', allMovies);
    allMovies.forEach(movie => {
      console.log(`${movie.title} - Genres:`, movie.genre_ids);
    });
    
    displayMoviesGrid(allMovies);
    setupFilters();
  } catch (error) {
    console.error("Error fetching movies:", error);
    showErrorMessage("Failed to load movies. Please try again.");
  }
}

function displayMoviesGrid(movies) {
  const container = document.getElementById('movies-container');
  
  if (!movies || movies.length === 0) {
    container.innerHTML = `
      <div class="no-movies">
        <i class="fas fa-film"></i>
        <p>No movies found matching your filters</p>
        <button class="reset-filters" onclick="resetFilters()">
          <i class="fas fa-sync-alt"></i> Reset Filters
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = movies.map(movie => {
    const releaseDate = new Date(movie.release_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return `
      <div class="movie-card-expanded" data-genres="${movie.genre_ids.join(', ')}">
        <!-- rest of your movie card HTML -->
      </div>
    `;
  }).join('');
  
  
  movies.forEach(movie => {
    const releaseDate = new Date(movie.release_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card-expanded';
    movieCard.innerHTML = `
      <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">
      <div class="movie-details">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span class="rating"><i class="fas fa-star"></i> ${movie.vote_average}/10</span>
          <span class="duration"><i class="fas fa-clock"></i> ${Math.floor(Math.random() * 60) + 90} min</span>
          <span class="date"><i class="far fa-calendar-alt"></i> ${releaseDate}</span>
        </div>
        <p class="movie-overview">${movie.overview.substring(0, 150)}...</p>
        <div class="movie-actions">
          <a href="#" class="watch-trailer-btn" data-id="${movie.id}">
            <i class="fas fa-play"></i> Trailer
          </a>
          <a href="booking.html?movie=${movie.id}" class="book-now-btn">
            <i class="fas fa-ticket-alt"></i> Book Now
          </a>
        </div>
      </div>
    `;
    
    container.appendChild(movieCard);
  });
}

function resetFilters() {
  document.getElementById('genre-filter').value = 'all';
  document.getElementById('date-filter').valueAsDate = new Date();
  document.getElementById('sort-filter').value = 'popular';
  applyFilters();
}

function setupFilters() {
  const genreFilter = document.getElementById('genre-filter');
  const dateFilter = document.getElementById('date-filter');
  const sortFilter = document.getElementById('sort-filter');
  
  // Set default date to today
  dateFilter.valueAsDate = new Date();
  
  // Add event listeners
  genreFilter.addEventListener('change', filterMovies);
  dateFilter.addEventListener('change', filterMovies);
  sortFilter.addEventListener('change', filterMovies);
}

function filterMovies() {
  console.log("Filters changed - implement filtering logic");
}

function showLoadingSpinner() {
  const container = document.getElementById('movies-container');
  container.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading movies...</p>
    </div>
  `;
}

function showErrorMessage(message) {
  const container = document.getElementById('movies-container');
  container.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${message}</p>
    </div>
  `;
}


document.addEventListener('DOMContentLoaded', () => {
 
  loadMoviesPage();
});


// Cinema locations data
const cinemaLocations = [
  {
    id: "malabe",
    name: "QuickFlicks Malabe",
    location: "Malabe, Sri Lanka",
    theaters: 3,
    features: [
      "IMAX experience for blockbuster movies",
      "3D and Dolby Atmos sound system",
      "Luxury recliner seating available in Theater 1",
      "Snack bar and VIP lounge"
    ],
    capacity: [
      { name: "Theater 1 (IMAX Experience)", seats: 250 },
      { name: "Theater 2 (3D Cinema)", seats: 200 },
      { name: "Theater 3 (Standard)", seats: 150 }
    ],
    movies: [
      {
        title: "Avatar: The Way of Water",
        theater: "Theater 1 (IMAX Experience)",
        times: ["10:00 AM", "2:30 PM", "7:00 PM"]
      },
      {
        title: "Avengers: Endgame",
        theater: "Theater 2 (3D Cinema)",
        times: ["11:00 AM", "3:30 PM", "8:00 PM"]
      },
      {
        title: "The Super Mario Bros Movie",
        theater: "Theater 3 (Standard)",
        times: ["9:30 AM", "1:00 PM", "5:30 PM"]
      }
    ]
  },
  {
    id: "bambalapitiya",
    name: "QuickFlicks Bambalapitiya",
    location: "Bambalapitiya, Sri Lanka",
    theaters: 4,
    features: [
      "Ultra HD 4K Dolby Vision",
      "VIP private screening room",
      "Exclusive food & beverage service",
      "Online ticket booking available"
    ],
    capacity: [
      { name: "Theater 1 (Premium 4K Dolby)", seats: 220 },
      { name: "Theater 2 (Standard 3D)", seats: 180 },
      { name: "Theater 3 (Family Friendly)", seats: 160 },
      { name: "Theater 4 (VIP Lounge)", seats: 100 }
    ],
    movies: [
      {
        title: "John Wick: Chapter 4",
        theater: "Theater 1 (Premium 4K Dolby)",
        times: ["10:30 AM", "3:00 PM", "7:30 PM"]
      },
      {
        title: "Spider-Man: Across the Spider-Verse",
        theater: "Theater 2 (Standard 3D)",
        times: ["11:30 AM", "4:00 PM", "8:30 PM"]
      },
      {
        title: "Elemental",
        theater: "Theater 3 (Family Friendly)",
        times: ["9:00 AM", "12:30 PM", "5:00 PM"]
      }
    ]
  },
  {
    id: "negombo",
    name: "QuickFlicks Negombo",
    location: "Negombo, Sri Lanka",
    theaters: 2,
    features: [
      "Ocean-view cinema experience",
      "3D and Dolby Digital sound system",
      "Budget-friendly ticket pricing",
      "Free parking available"
    ],
    capacity: [
      { name: "Theater 1 (Premium 3D)", seats: 200 },
      { name: "Theater 2 (Standard 2D)", seats: 150 }
    ],
    movies: [
      {
        title: "Fast X",
        theater: "Theater 1 (Premium 3D)",
        times: ["10:00 AM", "2:00 PM", "6:00 PM", "9:30 PM"]
      },
      {
        title: "The Little Mermaid",
        theater: "Theater 2 (Standard 2D)",
        times: ["11:00 AM", "3:00 PM", "7:00 PM"]
      }
    ]
  }
];

// Load locations when page loads
function loadLocationsPage() {
  if (window.location.pathname.includes('locations.html')) {
    renderLocationCards();
    setupLocationSelection();
  }
}

// Render location cards
function renderLocationCards() {
  const container = document.getElementById('location-container');
  container.innerHTML = '';
  
  cinemaLocations.forEach(location => {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.dataset.locationId = location.id;
    
    let capacityHTML = '';
    location.capacity.forEach(theater => {
      capacityHTML += `
        <div class="theater-item">
          <span>${theater.name}</span>
          <span>${theater.seats} seats</span>
        </div>
      `;
    });
    
    let featuresHTML = location.features.map(feature => 
      `<li><i class="fas fa-check-circle"></i> ${feature}</li>`
    ).join('');
    
    card.innerHTML = `
      <h2><i class="fas fa-map-marker-alt"></i> ${location.name}</h2>
      <div class="location-info">
        <div><i class="fas fa-location-dot"></i> ${location.location}</div>
        <div><i class="fas fa-film"></i> ${location.theaters} theaters</div>
      </div>
      <div class="theater-capacity">
        <h3><i class="fas fa-chair"></i> Seating Capacity</h3>
        ${capacityHTML}
      </div>
      <div class="location-features">
        <h3><i class="fas fa-star"></i> Features</h3>
        <ul>${featuresHTML}</ul>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Setup location selection
function setupLocationSelection() {
  const locationCards = document.querySelectorAll('.location-card');
  const detailsSection = document.getElementById('location-details');
  
  locationCards.forEach(card => {
    card.addEventListener('click', function() {
      // Remove active class from all cards
      locationCards.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked card
      this.classList.add('active');
      
      // Get location data
      const locationId = this.dataset.locationId;
      const location = cinemaLocations.find(loc => loc.id === locationId);
      
      // Render showtimes
      renderShowtimes(location);
    });
  });
}

// Render showtimes for selected location
function renderShowtimes(location) {
  const detailsSection = document.getElementById('location-details');
  
  let moviesHTML = '';
  location.movies.forEach(movie => {
    let timesHTML = movie.times.map(time => 
      `<span class="time-slot">${time}</span>`
    ).join('');
    
    moviesHTML += `
      <div class="movie-showtime">
        <h3>${movie.title}</h3>
        <div class="showtime-theater">
          <i class="fas fa-theater-masks"></i> ${movie.theater}
        </div>
        <div class="time-slots">${timesHTML}</div>
      </div>
    `;
  });
  
  detailsSection.innerHTML = `
    <div class="showtimes-header">
      <h2><i class="fas fa-calendar-days"></i> Showtimes at ${location.name}</h2>
      <div class="location-info">
        <span><i class="fas fa-location-dot"></i> ${location.location}</span>
      </div>
    </div>
    <div class="showtimes-grid">
      ${moviesHTML}
    </div>
  `;
  
  // Show the details section
  detailsSection.classList.add('active');
  
  // Add click handlers to time slots
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', function() {
      // Here you would typically redirect to booking page
      alert(`Booking ${this.textContent} showtime`);
    });
  });
}

// Initialize locations page
document.addEventListener('DOMContentLoaded', loadLocationsPage);

function displayMoviesGrid(movies) {
  const container = document.getElementById('movies-container');
  container.innerHTML = '';
  
  movies.forEach(movie => {
    const releaseDate = new Date(movie.release_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card-expanded';
    movieCard.innerHTML = `
      <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">
      <div class="movie-details">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span class="rating"><i class="fas fa-star"></i> ${movie.vote_average}/10</span>
          <span class="duration"><i class="fas fa-clock"></i> ${Math.floor(Math.random() * 60) + 90} min</span>
          <span class="date"><i class="far fa-calendar-alt"></i> ${releaseDate}</span>
        </div>
        <p class="movie-overview">${movie.overview.substring(0, 150)}...</p>
        <div class="movie-actions">
          <a href="#" class="watch-trailer-btn" data-id="${movie.id}">
            <i class="fas fa-play"></i> Trailer
          </a>
          <a href="select-cinema.html?movie=${encodeURIComponent(movie.title)}" class="book-now-btn">
            <i class="fas fa-ticket-alt"></i> Book Now
          </a>
        </div>
      </div>
    `;
    
    container.appendChild(movieCard);
  });
}

// Add this to your existing script.js or create a new navigation.js file
function setActiveNavLink() {
  // Get current page path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current page link
  const activeLink = document.querySelector(`.nav-link[href="${currentPath}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Special case for index.html (home)
  if (currentPath === '' || currentPath === 'index.html') {
    const homeLink = document.querySelector('.nav-link[href="index.html"]');
    if (homeLink) homeLink.classList.add('active');
  }
}

// Call this function when each page loads
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Movie Filtering Functionality
let allMovies = []; // Store all movies for filtering

async function fetchNowShowingMovies() {
  try {
    showLoadingSpinner();
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&region=US`);
    const data = await response.json();
    allMovies = data.results;
    displayMoviesGrid(allMovies);
    setupFilters();
  } catch (error) {
    console.error("Error fetching movies:", error);
    showErrorMessage("Failed to load movies. Please try again.");
  }
}

function setupFilters() {
  const genreFilter = document.getElementById('genre-filter');
  const dateFilter = document.getElementById('date-filter');
  const sortFilter = document.getElementById('sort-filter');
  
  // Set default date to today
  dateFilter.valueAsDate = new Date();
  
  // Add event listeners
  genreFilter.addEventListener('change', applyFilters);
  dateFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
  const genreFilter = document.getElementById('genre-filter').value;
  const dateFilter = document.getElementById('date-filter').value;
  const sortFilter = document.getElementById('sort-filter').value;
  
  let filteredMovies = [...allMovies];
  
  // Apply genre filter - fixed version
  if (genreFilter !== 'all') {
    const genreId = Number(genreFilter);
    filteredMovies = filteredMovies.filter(movie => {
      // Check if movie has genre_ids array and includes our genre
      return movie.genre_ids && movie.genre_ids.includes(genreId);
    });
  }
  
  // Apply date filter
  if (dateFilter) {
    const selectedDate = new Date(dateFilter);
    filteredMovies = filteredMovies.filter(movie => {
      if (!movie.release_date) return false;
      const releaseDate = new Date(movie.release_date);
      return releaseDate >= selectedDate;
    });
  }
  
  // Apply sorting
  switch(sortFilter) {
    case 'rating':
      filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
      break;
    case 'date':
      filteredMovies.sort((a, b) => {
        const dateA = new Date(a.release_date || 0);
        const dateB = new Date(b.release_date || 0);
        return dateB - dateA;
      });
      break;
    default: // popularity
      filteredMovies.sort((a, b) => b.popularity - a.popularity);
  }
  
  displayMoviesGrid(filteredMovies);
  
  // Debugging - log filtered results
  console.log('Filtered Movies:', filteredMovies);
}

function displayMoviesGrid(movies) {
  const container = document.getElementById('movies-container');
  
  if (!movies || movies.length === 0) {
    container.innerHTML = `
      <div class="no-movies">
        <i class="fas fa-film"></i>
        <p>No movies found matching your filters</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = movies.map(movie => {
    const releaseDate = new Date(movie.release_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return `
      <div class="movie-card-expanded">
        <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">
        <div class="movie-details">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-meta">
            <span class="rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}/10</span>
            <span class="date"><i class="far fa-calendar-alt"></i> ${releaseDate}</span>
          </div>
          <p class="movie-overview">${movie.overview.substring(0, 150)}...</p>
          <div class="movie-actions">
            <a href="#" class="watch-trailer-btn" data-id="${movie.id}">
              <i class="fas fa-play"></i> Trailer
            </a>
            <a href="select-cinema.html?movie=${encodeURIComponent(movie.title)}" class="book-now-btn">
              <i class="fas fa-ticket-alt"></i> Book Now
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Reattach trailer click handlers
  document.querySelectorAll('.watch-trailer-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const movieId = this.getAttribute('data-id');
      showTrailer(movieId);
    });
  });
}