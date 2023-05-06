import { config } from 'dotenv'
config();

console.log('setting up chatgpt service')
import { Configuration, OpenAIApi } from 'openai'

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.API_KEY,
    })
)

export const prompt = async input => {
    console.log(`prompting for content ${input}`)
    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: input}],
    });
    const reply = res.data.choices[0].message.content
    console.log(reply)
    return reply
}