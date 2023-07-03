import axios from "axios";

export const v1ConvertTextToSpeech = async (input, voice = 'larry') => {
    const url = 'https://play.ht/api/v1/convert/';
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            AUTHORIZATION: `Bearer ${process.env.PLAY_HT_AUTH}`,
            'X-USER-ID': process.env.PLAY_HT_USER
        },
        data: {
            content: [input],
            voice,
            speed: 1,
            preset: 'balanced'
        }
    }

    const response = await axios(url, options)
    return response.data
}

export const v1GetTextToSpeech = async (transcriptionId) => {
    const url = `https://play.ht/api/v1/articleStatus/?transcriptionId=${transcriptionId}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            AUTHORIZATION: `Bearer ${process.env.PLAY_HT_AUTH}`,
            'X-USER-ID': process.env.PLAY_HT_USER
        }
    }

    const response = await axios(url, options)
    if (!response.data.transcriped) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return v1GetTextToSpeech(transcriptionId)
    }
    return await response.data
}