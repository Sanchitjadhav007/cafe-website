// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');

    // Safety Check: Only run the code if the form is actually on the page
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Gather data (using optional chaining for safety)
        const nameInput = document.getElementById('name');
        const ratingInput = document.getElementById('rating');
        const commentInput = document.getElementById('comment');

        const data = {
            username: nameInput?.value || "Anonymous",
            rating: ratingInput?.value || "0",
            content: commentInput?.value || ""
        };

        try {
            // 2. Fixed Path: Added the '.' before /netlify/
            const response = await fetch('/.netlify/functions/save-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // 3. Get response text
            const text = await response.text(); 
            
            try {
                const result = JSON.parse(text); 

                if (response.ok) {
                    alert("Success! Your review for Chat Station has been saved.");
                    reviewForm.reset();
                } else {
                    alert("Error: " + (result.error || "Something went wrong"));
                }
            } catch (jsonError) {
                console.error("Server sent non-JSON response:", text);
                alert("Server error. Check the console.");
            }

        } catch (err) {
            console.error("Connection failed:", err);
            alert("Could not connect. Is 'netlify dev' running?");
        }
    });
});