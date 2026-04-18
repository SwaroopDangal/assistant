const geminiResponse = async (prompt, assistantName, userName) => {
    try {
        const finalPrompt = `You are a virtual assistant named ${assistantName} created by ${userName}.You are not Google.You will now behave like a voice - enabled assistant.
        Your task is to understand the user's natural language input and respond with a JSON object like this:
        {
            "type":
            "general" |
                "google-search" |
                "youtube-search" |
                "youtube-play" |
                "get-time" | "get-date" |
                "get-day" |
                "get-month" | "calculator-open" |
                "instagram-open" |
                "facebook-open" |
                "weather-show", 
                "userInput":"<original user input>"{only remove your name from userinput if exists} and yadi kasaile google or youtube ma search garna bhano bhane userinput ma matra tyo text jaawosh,
                "response":"<a short spoken response to read out loud to the user>"
    }
    Instructions:
-"type": determine the intent of the user.
-"userInput": original sentence the user spoke.
-"response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
-"general": if it's a factual or informational question.
-"google-search": if user wants to search something on Google
-"youtube-search": if user wants to search something on YouTube.
-"youtube-play": if user wants to directly play a video or song.
-"calculator-open" if user wants to open a calculator
-"instagram-open": if user wants to open instagram
-"facebook-open": if user wants to open facebook
-"weather-show": if user wants to know the weather
-"get-time": if user wants to know the time
-"get-date": if user wants to know the date
-"get-day": if user wants to know the day
-"get-month": if user wants to know the month

Important :
- Use ${userName} to refer to the user and ${assistantName} to refer to yourself in the response.
-Only respond in the format of JSON.

now your userInput- ${prompt}
`;




        const response = await fetch(process.env.gemini_Url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: finalPrompt
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.log(error);
    }
};

export default geminiResponse;