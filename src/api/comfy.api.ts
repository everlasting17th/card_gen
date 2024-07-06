export const prompt = async (comfyUrl: string, clientId: string, pipeline: string) => {
    return await fetch(`${comfyUrl}/prompt`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({ client_id: clientId, prompt: JSON.parse(pipeline) })
    });
}

export const getHistory = async (comfyUrl: string, promptId: string) => {
    return await fetch(`${comfyUrl}/history/${promptId}`)
}

export const downloadImage = async (comfyUrl: string, filename: string, subfolder: string, type: string) => {
    return await fetch(`${comfyUrl}/view?filename=${filename}&type=${type}`);
}