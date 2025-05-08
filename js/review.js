// review.js
document.addEventListener('DOMContentLoaded', function() {
  let selectedRating = 0;
  const stars = document.querySelectorAll('.rating i');
  
  // Star rating interaction
  stars.forEach(star => {
      star.addEventListener('click', function() {
          const rating = parseInt(this.getAttribute('data-rating'));
          selectedRating = rating;
          
          // Update star display
          stars.forEach((s, index) => {
              if (index < rating) {
                  s.classList.remove('far');
                  s.classList.add('fas');
              } else {
                  s.classList.remove('fas');
                  s.classList.add('far');
              }
          });
      });
      
      // Hover effects
      star.addEventListener('mouseover', function() {
          const rating = parseInt(this.getAttribute('data-rating'));
          stars.forEach((s, index) => {
              if (index < rating) {
                  s.classList.add('hover');
              } else {
                  s.classList.remove('hover');
              }
          });
      });
      
      star.addEventListener('mouseout', function() {
          stars.forEach(s => s.classList.remove('hover'));
      });
  });
  
  // Submit review
  document.getElementById('submit-review').addEventListener('click', function() {
      if (selectedRating === 0) {
          alert('Please select a rating before submitting.');
          return;
      }
      
      const reviewText = document.getElementById('review-text').value;
      const confirmationDetails = JSON.parse(sessionStorage.getItem('confirmationDetails'));
      
      // In a real app, you would send this data to your server
      const reviewData = {
          referenceNumber: confirmationDetails.referenceNumber,
          rating: selectedRating,
          review: reviewText,
          movie: confirmationDetails.movieTitle,
          date: new Date().toISOString()
      };
      
      // Store review locally (in a real app, send to server)
      let reviews = JSON.parse(localStorage.getItem('quickflicksReviews') || '[]');
      reviews.push(reviewData);
      localStorage.setItem('quickflicksReviews', JSON.stringify(reviews));
      
      // Redirect to home page
      window.location.href = 'index.html';
  });
});