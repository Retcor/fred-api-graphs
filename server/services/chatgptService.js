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

export const image = async input => {
    console.log(`prompting for content ${input}`)
    const res = await openai.createImage({
        prompt: input,
        n: 1,
        size: "256x256",
        response_format: "b64_json"
    });
    if (res.status === 200) {
        return res?.data.data[0].b64_json || ''
    } else {
        return ''
    }
}