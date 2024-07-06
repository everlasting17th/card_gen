import { METHODS } from "http"

export const openAiCompletion = async (authorizationKey: string, content: string) => {
    const data = {
        model: 'gpt-4o',
        messages: [
            {
                role: "user",
                content: content
            }
        ]
    }

    const result = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${authorizationKey}`
        },
        body: JSON.stringify(data)
    })

    return result;
} 