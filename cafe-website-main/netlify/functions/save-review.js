import { neon } from '@netlify/neon';

export const handler = async (event) => {
  // Use the env variable for the database connection
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  // 1. Safety check: Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." }) 
    };
  }

  try {
    // 2. Parse the incoming data
    const { username, rating, content } = JSON.parse(event.body);

    // 3. Validation: Make sure the required fields aren't empty
    if (!username || !rating || !content) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "All fields (name, rating, comment) are required." }),
      };
    }

    // 4. Run the SQL query
    // This matches the table you just created successfully
    await sql`
      INSERT INTO reviews (username, rating, content) 
      VALUES (${username}, ${Number(rating)}, ${content})
    `;

    // 5. Return success
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Allows testing from different local ports
      },
      body: JSON.stringify({ status: "success", message: "Review saved to Chat Station!" }),
    };

  } catch (error) {
    console.error("Database Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "error", error: error.message }),
    };
  }
};