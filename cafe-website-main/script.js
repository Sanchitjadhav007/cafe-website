function renderReviews(reviews) {
    const reviewsDiv = document.getElementById('reviews');
    if (!reviewsDiv) {
        return;
    }

    reviewsDiv.innerHTML = '';

    if (!reviews.length) {
        reviewsDiv.innerHTML = '<p>No reviews yet.</p>';
        return;
    }

    reviews.forEach((review) => {
        const name = review.name || review.username || 'Anonymous';
        const comment = review.comment || review.content || '';
        const rating = Math.min(Math.max(Number(review.rating || 0), 0), 5);
        const stars = '\u2605'.repeat(rating);
        const firstLetter = String(name).trim().charAt(0).toUpperCase() || 'A';

        const card = document.createElement('div');
        card.className = 'review-card';

        const header = document.createElement('div');
        header.className = 'review-header';

        const avatar = document.createElement('div');
        avatar.className = 'review-avatar';
        avatar.textContent = firstLetter;

        const info = document.createElement('div');
        info.className = 'review-info';

        const reviewName = document.createElement('div');
        reviewName.className = 'review-name';
        reviewName.textContent = name;

        const reviewRating = document.createElement('div');
        reviewRating.className = 'review-rating';
        reviewRating.textContent = stars;

        const reviewComment = document.createElement('div');
        reviewComment.className = 'review-comment';
        reviewComment.textContent = comment;

        info.append(reviewName, reviewRating);
        header.append(avatar, info);
        card.append(header, reviewComment);
        reviewsDiv.appendChild(card);
    });
}

function setSubmitState(isSubmitting) {
    const submitButton = document.querySelector('#reviewForm button[type="submit"]');
    if (!submitButton) {
        return;
    }

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? 'Submitting...' : 'Submit Review';
}

async function submitReview() {
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    const rating = document.getElementById('rating').value;

    if (!name || !message || !rating) {
        alert('Please complete your name, rating, and message.');
        return;
    }

    const reviewPayload = {
        name,
        comment: message,
        rating: Number(rating)
    };

    try {
        setSubmitState(true);
        const res = await fetch('/.netlify/functions/save-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewPayload)
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.error || data.message || 'Unable to save review.');
        }

        const form = document.getElementById('reviewForm');
        if (form) {
            form.reset();
        }

        alert('Review Added!');
        await loadReviews();
    } catch (err) {
        console.error('Review save error:', err);
        alert('Review could not be saved. Please try again.');
    } finally {
        setSubmitState(false);
    }
}

async function loadReviews() {
    const reviewsDiv = document.getElementById('reviews');
    if (!reviewsDiv) {
        return;
    }

    reviewsDiv.innerHTML = '<p>Loading reviews...</p>';

    try {
        const res = await fetch('/.netlify/functions/save-review', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Unable to load reviews from server.');
        }

        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) {
            renderReviews(data);
        }
    } catch (error) {
        console.error('Review load error:', error);
        reviewsDiv.innerHTML = '<p>Unable to load reviews right now.</p>';
    }
}

window.addEventListener('load', function() {
    loadReviews();
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reviewForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview();
        });
    }
});
