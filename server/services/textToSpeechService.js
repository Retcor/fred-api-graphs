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

export const v1GetTextToSpeech = async (transcriptionId, triesLeft = 30) => {
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
        if (triesLeft < 0) {
            throw new Error('Timed out waiting to transcribe')
        }
        triesLeft--
        console.log(`Voice not yet transcriped for ${transcriptionId}, retrying...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return v1GetTextToSpeech(transcriptionId, triesLeft)
    }
    console.log(`Voice transcriped successfully for ${transcriptionId}`)
    return await response.data
}

export const v2GetStreamURL = async (text, voice = 'larry') => {
    const url = 'https://play.ht/api/v2/tts/stream';
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            AUTHORIZATION: `Bearer ${process.env.PLAY_HT_AUTH}`,
            'X-USER-ID': process.env.PLAY_HT_USER
        },
        data: {
            quality: 'draft',
            output_format: 'mp3',
            speed: 1,
            sample_rate: 24000,
            text,
            voice
        }
    }

    const response = await axios(url, options)
    return response.data
}

export const v2StreamFromURL = async (streamData) => {
    const options = {
        method: streamData.method,
        responseType: 'stream',
        headers: {
            AUTHORIZATION: `Bearer ${process.env.PLAY_HT_AUTH}`,
            'X-USER-ID': process.env.PLAY_HT_USER
        }
    }

    const response = await axios(streamData.href, options)
    return response.data
}