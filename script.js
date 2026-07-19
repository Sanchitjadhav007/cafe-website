// 👉 Submit Review
function submitReview() {
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const rating = document.getElementById('rating').value;

    console.log("Submitting review:", { name, message, rating });

    fetch('/.netlify/functions/save-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, comment: message, rating })
    })
    .then(res => {
        console.log("Submit response status:", res.status);
        return res.json();
    })
    .then(data => {
        console.log("Submit response data:", data);
        alert("Review Added!");
        loadReviews();
    })
    .catch(err => {
        console.error("Error submitting review:", err);
    });
}

// 👉 Load Reviews
function loadReviews() {
    console.log("Loading reviews...");
    fetch('/.netlify/functions/save-review')
    .then(res => {
        console.log("Response status:", res.status);
        return res.json();
    })
    .then(data => {
        console.log("Reviews data:", data);
        const reviewsDiv = document.getElementById('reviews');
        if (!reviewsDiv) {
            console.error("Reviews div not found!");
            return;
        }
        reviewsDiv.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            reviewsDiv.innerHTML = "<p>No reviews yet.</p>";
            return;
        }

        data.forEach(review => {
            const stars = "⭐".repeat(review.rating);
            const firstLetter = (review.name || 'A').charAt(0).toUpperCase();

            reviewsDiv.innerHTML += `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">${firstLetter}</div>
                        <div class="review-info">
                            <div class="review-name">${review.name}</div>
                            <div class="review-rating">${stars}</div>
                        </div>
                    </div>
                    <div class="review-comment">${review.comment}</div>
                </div>
            `;
        });
    })
    .catch(err => {
        console.error("Error loading reviews:", err);
    });
}

// 👉 Load when page starts
window.addEventListener('load', function() {
    console.log("Page loaded, initializing reviews...");
    loadReviews();
});

// Add form submission event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, setting up form...");
    const form = document.getElementById('reviewForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview();
        });
        console.log("Form event listener attached");
    } else {
        console.log("Form not found on this page");
    }
});