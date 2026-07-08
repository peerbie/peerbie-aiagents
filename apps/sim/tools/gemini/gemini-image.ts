import { createLogger } from '@sim/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GeminiImageTool')

export const geminiImageTool: ToolConfig = {
    id: 'gemini_image',
    name: 'Gemini Image Generator',
    description: "Generate images using Google's Gemini Image models",
    version: '1.0.0',

    params: {
        model: {
            type: 'string',
            required: true,
            visibility: 'user-only',
            description: 'The model to use (gemini-2.5-flash-image or gemini-3-pro-image)',
        },
        prompt: {
            type: 'string',
            required: true,
            visibility: 'user-or-llm',
            description: 'A text description of the desired image',
        },
        aspectRatio: {
            type: 'string',
            required: false,
            visibility: 'user-or-llm',
            description: 'Aspect ratio of the image (1:1, 16:9, 9:16, 4:3, 3:4)',
        },
        numberOfImages: {
            type: 'number',
            required: false,
            visibility: 'user-or-llm',
            description: 'Number of images to generate (1-4)',
        },
        apiKey: {
            type: 'string',
            required: true,
            visibility: 'user-only',
            description: 'Your Google API key',
        },
    },

    request: {
        url: (params) => {
            const model = params.model || 'gemini-2.5-flash-image'
            return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${params.apiKey}`
        },
        method: 'POST',
        headers: () => ({
            'Content-Type': 'application/json',
        }),
        body: (params) => {
            // Gemini API expects a specific structure
            return {
                contents: [
                    {
                        parts: [
                            {
                                text: params.prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    responseModalities: ['image'],
                    ...(params.numberOfImages && { candidate_count: Number(params.numberOfImages) }),
                    ...(params.aspectRatio && {
                        image_config: {
                            aspect_ratio: params.aspectRatio,
                        },
                    }),
                },
            }
        },
    },

    transformResponse: async (response, params) => {
        try {
            const data = await response.json()

            if (!response.ok || data.error) {
                logger.error('Gemini API error:', data.error || data)
                throw new Error(data.error?.message || 'Image generation failed')
            }

            const modelName = params?.model || 'gemini-2.5-flash-image'
            let base64Image = null

            // Extract image from Gemini response
            if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
                base64Image = data.candidates[0].content.parts[0].inlineData.data
                logger.info('Found base64 encoded image in Gemini response', `length: ${base64Image.length}`)
            } else {
                logger.error('No image data found in Gemini API response:', data)
                throw new Error('No image data found in response')
            }

            return {
                success: true,
                output: {
                    content: 'gemini-generated-image',
                    image: base64Image || '',
                    metadata: {
                        model: modelName,
                    },
                },
            }
        } catch (error) {
            logger.error('Error in Gemini image generation response handling:', error)
            throw error
        }
    },

    outputs: {
        success: { type: 'boolean', description: 'Operation success status' },
        output: {
            type: 'object',
            description: 'Generated image data',
            properties: {
                content: { type: 'string', description: 'Image identifier' },
                image: { type: 'string', description: 'Base64 encoded image data' },
                metadata: {
                    type: 'object',
                    description: 'Image generation metadata',
                    properties: {
                        model: { type: 'string', description: 'Model used for image generation' },
                    },
                },
            },
        },
    },
}
