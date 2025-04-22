import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

    // if (!prompt) {
    //   return Response.json({
    //     success: false,
    //     message: "Prompt is required",
    //   }, { status: 400 });
    // }

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return Response.json({
        success: false,
        message: data.error?.message || "Gemini API request failed",
      }, { status: response.status });
    }
    // console.log("data ",data.candidates[0].content.parts[0].text)
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    return Response.json({
      success: true,
      message: generatedText,
    }, { status: 200 });

  } catch (error) {
    console.error("Error generating message:", error);
    return Response.json({
      success: false,
      message: "Failed to generate message",
    }, { status: 500 });
  }
}
