const reviewForm = document.getElementById('reviewForm');

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Gather data from the form IDs in your review.html
    const data = {
        username: document.getElementById('name').value,
        rating: document.getElementById('rating').value,
        content: document.getElementById('comment').value
    };

    try {
        // 2. Call the Netlify Function (Note the exact path: /.netlify/functions/...)
        const response = await fetch('/netlify/functions/save-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // 3. Get the raw text first to prevent JSON parse crashes
        const text = await response.text(); 
        
        try {
            const result = JSON.parse(text); 

            if (response.ok) {
                alert("Success! Your review for Chat Station has been saved.");
                reviewForm.reset();
            } else {
                alert("Error from server: " + (result.error || "Unknown error"));
            }
        } catch (jsonError) {
            // This catches cases where the server sends a 404/500 plain text error
            console.error("The server sent text instead of JSON:", text);
            alert("Server Error: Check the console for details.");
        }

    } catch (err) {
        console.error("Connection failed:", err);
        alert("Could not connect to the server. Is 'netlify dev' running?");
    }
});