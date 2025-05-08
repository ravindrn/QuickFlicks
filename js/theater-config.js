// /js/theater-config.js
const theaterConfig = {
  // Malabe Theaters
  'malabe-imax': {
    rows: 8,
    seatsPerRow: 12,
    premiumRows: [0, 1], // First two rows
    price: { standard: 1500, premium: 2000 },
    bookedSeats: ['A5', 'B3', 'C7', 'D4'] // Sample data
  },
  'malabe-3d': {
    rows: 10,
    seatsPerRow: 15,
    premiumRows: [0, 1, 2],
    price: { standard: 1200, premium: 1600 },
    bookedSeats: ['A7', 'B2', 'C5', 'D9', 'E3']
  },
  'malabe-standard': {
    rows: 12,
    seatsPerRow: 18,
    premiumRows: [],
    price: { standard: 800 },
    bookedSeats: ['C4', 'D7', 'E2', 'F9']
  },

  // Bambalapitiya Theaters
  'bambalapitiya-4k': {
    rows: 7,
    seatsPerRow: 14,
    premiumRows: [0, 1],
    price: { standard: 1800, premium: 2200 },
    bookedSeats: ['A3', 'B6', 'C8', 'D2']
  },
  'bambalapitiya-3d': {
    rows: 9,
    seatsPerRow: 16,
    premiumRows: [0, 1],
    price: { standard: 1300, premium: 1700 },
    bookedSeats: ['A4', 'B7', 'C3', 'D6', 'E2']
  },
  'bambalapitiya-family': {
    rows: 8,
    seatsPerRow: 12,
    premiumRows: [],
    price: { standard: 1000, child: 700 },
    bookedSeats: ['B4', 'C6', 'D3', 'E7']
  },
  'bambalapitiya-vip': {
    rows: 5,
    seatsPerRow: 10,
    premiumRows: [0, 1, 2, 3, 4], // All seats are premium in VIP
    price: { standard: 2500 },
    bookedSeats: ['A2', 'B5', 'C3', 'D7']
  },

  // Negombo Theaters
  'negombo-3d': {
    rows: 8,
    seatsPerRow: 14,
    premiumRows: [0, 1],
    price: { standard: 1100, premium: 1500 },
    bookedSeats: ['A4', 'B6', 'C3', 'D8']
  },
  'negombo-2d': {
    rows: 10,
    seatsPerRow: 16,
    premiumRows: [],
    price: { standard: 800 },
    bookedSeats: ['C5', 'D7', 'E3', 'F9', 'G2']
  }
};

// Function to get config for a theater
function getTheaterConfig(theaterId) {
  return theaterConfig[theaterId] || {
    rows: 8,
    seatsPerRow: 12,
    premiumRows: [],
    price: { standard: 1000 },
    bookedSeats: []
  };
}