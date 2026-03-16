const reviewForm = document.getElementById('reviewForm');

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    username: document.getElementById('nameInput').value,
    content: document.getElementById('reviewInput').value
  };

  const response = await fetch('/.netlify/functions/save-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  alert(result.message);
});