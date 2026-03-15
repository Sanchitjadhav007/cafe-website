// review.js
document.getElementById("reviewForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const review = {
    name: document.getElementById("name").value,
    rating: document.getElementById("rating").value,
    comment: document.getElementById("comment").value
  };

  try {
    await fetch("cafe-website-lzg1tytda-sanchitjadhav007s-projects.vercel.app/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review)
    });

    alert("Review Submitted!");
    document.getElementById("reviewForm").reset();
    loadReviews(); // reload reviews after submission
  } catch (err) {
    alert("Error submitting review");
    console.error(err);
  }
});

// Function to load all reviews
async function loadReviews() {
  try {
    const response = await fetch("cafe-website-lzg1tytda-sanchitjadhav007s-projects.vercel.app/api/review", {
      mode: 'cors' // Added mode: 'cors' here
    });
    const reviews = await response.json();

    const container = document.getElementById("reviews-container");
    container.innerHTML = "";

    reviews.forEach(r => {
      const card = document.createElement("div");
      card.className = "review-card";
      card.innerHTML = `
        <h4>${r.name}</h4>
        <div class="stars">${"⭐".repeat(r.rating)}</div>
        <p>${r.comment}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load reviews", err);
  }
}

// Load reviews when page loads
window.addEventListener("DOMContentLoaded", loadReviews);