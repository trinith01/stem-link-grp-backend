import fetch from "node-fetch";

export const extractReceiptData = async (imageBuffer) => {
  // Convert image to base64 for API payload
  const base64Image = imageBuffer.toString("base64");

  // Prompt instructs Gemini to return strict JSON with transaction fields
  const prompt = `
    You are a receipt parser.
    Respond ONLY with valid, minified JSON:
    {
      "type":"income|expense",
      "amount":number,
      "note":string,
      "date":ISO8601,
      "source":string,
      "categoryId":null
    }
    - 'type' is "income" if amount is positive, "expense" if purchase.
    - 'categoryId' is just a placeholder now, to be replaced client-side.
    - 'note' should not be longer than 6 words.
    - If a field is not found, set it to null.
    - No markdown, no extra text, no code fences, no comments.
  `;

  // Send image & prompt to Gemini OCR endpoint
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt }, // Instruction block
          { inline_data: { mime_type: "image/jpeg", data: base64Image } }, // Image payload
        ],
      }],
    }),
  });

  // Parse response body as JSON
  const data = await response.json();

  // Handle non-200 responses from Gemini API
  if (!response.ok) {
    const { code, message, status } = data.error || {};
    throw new Error(`Gemini API Error [${status} - ${code}]: ${message}`);
  }

  // Return parsed JSON content from Gemini’s response
  return JSON.parse(data.candidates[0].content.parts[0].text);
};
