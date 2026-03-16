import { neon } from '@netlify/neon';

export const handler = async (event) => {
  // 1. Initialize the connection
  // It automatically looks for NETLIFY_DATABASE_URL
  const sql = neon(); 

  try {
    // 2. Get the data sent from your website form
    const { username, content } = JSON.parse(event.body);

    // 3. Run the SQL command to save it
    await sql`
      INSERT INTO reviews (username, content) 
      VALUES (${username}, ${content})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success! Review saved to Neon." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to save review" }),
    };
  }
};