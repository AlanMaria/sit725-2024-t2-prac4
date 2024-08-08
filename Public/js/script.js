document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();  // Initialize Materialize CSS components

    // Fetch dog parks data
    document.getElementById('fetch-data-btn').addEventListener('click', function() {
        const randomNumber = Math.floor(Math.random() * 20) + 1;
        alert('The number of Dog parks near you is: ' + randomNumber);
    });

    // Handle adopt a dog form submission
    document.getElementById('submit-adopt-btn').addEventListener('click', function(event) {
        event.preventDefault();  // Prevent the default form submission

        const name = document.getElementById('name-input').value;
        const address = document.getElementById('address-input').value;
        const breed = document.getElementById('breed-input').value;
        const email = document.getElementById('email-input').value;

        if (name && address && breed && email) {
            $.ajax({
                url: "http://localhost:3000/adopt",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    name: name,
                    address: address,
                    breed: breed,
                    email: email
                }),
                success: function(response) {
                    window.location.href = '/success.html';  // Redirect to success page
                },
                error: function(error) {
                    console.error('Error submitting adoption request:', error);
                    alert('There was an error submitting your request. Please try again.');
                }
            });
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Handle review form submission
    document.getElementById('review-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const reviewName = document.getElementById('review-name').value;
        const reviewText = document.getElementById('review-text').value;
        const reviewRating = document.getElementById('review-rating').value;

        if (reviewName && reviewText && reviewRating) {
            $.ajax({
                url: "http://localhost:3000/add-review",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    name: reviewName,
                    review: reviewText,
                    rating: parseInt(reviewRating)
                }),
                success: function(response) {
                    // Refresh reviews after submitting a new review
                    loadReviews();
                    document.getElementById('review-form').reset();  // Reset form
                },
                error: function(error) {
                    console.error('Error submitting review:', error);
                    alert('There was an error submitting your review. Please try again.');
                }
            });
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Function to generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="material-icons star-icon filled" style="color: gold;">star</i>';
            } else {
                stars += '<i class="material-icons star-icon empty" style="color: gray;">star_border</i>';
            }
        }
        return stars;
    }

    // Function to load reviews from the server and display them
    function loadReviews() {
        $.ajax({
            url: "http://localhost:3000/get-reviews",
            type: "GET",
            success: function(reviews) {
                const reviewsList = document.getElementById('reviews-list');
                reviewsList.innerHTML = '';  // Clear the list before adding new reviews

                reviews.forEach(review => {
                    const reviewCard = document.createElement('div');
                    reviewCard.classList.add('review-card');
                    reviewCard.innerHTML = `
                        <div class="review-name">${review.name}</div>
                        <div class="review-rating">${generateStars(review.rating)}</div>
                        <div class="review-text">${review.review}</div>
                    `;
                    reviewsList.appendChild(reviewCard);
                });
            },
            error: function(error) {
                console.error('Error fetching reviews:', error);
                alert('There was an error fetching reviews. Please try again later.');
            }
        });
    }

    // Load reviews when the page is ready
    loadReviews();
});
