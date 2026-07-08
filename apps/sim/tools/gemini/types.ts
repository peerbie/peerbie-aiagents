export interface GeminiImageRequestBody {
    model: string
    prompt: string
    aspectRatio?: string
    numberOfImages?: number
}

export interface GeminiImageResponse {
    predictions: Array<{
        bytesBase64Encoded: string
        mimeType: string
    }>
}

export interface GeminiImageOutput {
    content: string
    image: string
    metadata: {
        model: string
    }
}
