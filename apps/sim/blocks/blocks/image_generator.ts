import { ImageIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { DalleResponse } from '@/tools/openai/types'

export const ImageGeneratorBlock: BlockConfig<DalleResponse> = {
  type: 'image_generator',
  name: 'Image Generator',
  description: 'Generate images',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Image Generator into the workflow. Can generate images using DALL-E 3, GPT Image, Gemini 2.5 Flash, or Gemini 3 Pro.',
  docsLink: 'https://docs.sim.ai/tools/image_generator',
  category: 'tools',
  bgColor: '#4D5FFF',
  icon: ImageIcon,
  subBlocks: [
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      options: [
        { label: 'DALL-E 3', id: 'dall-e-3' },
        { label: 'GPT Image', id: 'gpt-image-1' },
        { label: 'Gemini 2.5 Flash', id: 'gemini-2.5-flash-image' },
        { label: 'Gemini 3 Pro', id: 'gemini-3-pro-image' },
      ],
      value: () => 'dall-e-3',
    },
    {
      id: 'prompt',
      title: 'Prompt',
      type: 'long-input',
      required: true,
      placeholder: 'Describe the image you want to generate...',
    },
    {
      id: 'size',
      title: 'Size',
      type: 'dropdown',
      options: [
        { label: '1024x1024', id: '1024x1024' },
        { label: '1024x1792', id: '1024x1792' },
        { label: '1792x1024', id: '1792x1024' },
      ],
      value: () => '1024x1024',
      condition: { field: 'model', value: 'dall-e-3' },
    },
    {
      id: 'size',
      title: 'Size',
      type: 'dropdown',
      options: [
        { label: 'Auto', id: 'auto' },
        { label: '1024x1024', id: '1024x1024' },
        { label: '1536x1024', id: '1536x1024' },
        { label: '1024x1536', id: '1024x1536' },
      ],
      value: () => 'auto',
      condition: { field: 'model', value: 'gpt-image-1' },
    },
    {
      id: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'dropdown',
      options: [
        { label: '1:1 (Square)', id: '1:1' },
        { label: '16:9 (Landscape)', id: '16:9' },
        { label: '9:16 (Portrait)', id: '9:16' },
        { label: '4:3 (Standard)', id: '4:3' },
        { label: '3:4 (Portrait)', id: '3:4' },
      ],
      value: () => '1:1',
      condition: {
        field: 'model',
        value: ['gemini-2.5-flash-image', 'gemini-3-pro-image'],
      },
    },
    {
      id: 'quality',
      title: 'Quality',
      type: 'dropdown',
      options: [
        { label: 'Standard', id: 'standard' },
        { label: 'HD', id: 'hd' },
      ],
      value: () => 'standard',
      condition: { field: 'model', value: 'dall-e-3' },
    },
    {
      id: 'style',
      title: 'Style',
      type: 'dropdown',
      options: [
        { label: 'Vivid', id: 'vivid' },
        { label: 'Natural', id: 'natural' },
      ],
      value: () => 'vivid',
      condition: { field: 'model', value: 'dall-e-3' },
    },
    {
      id: 'background',
      title: 'Background',
      type: 'dropdown',
      options: [
        { label: 'Auto', id: 'auto' },
        { label: 'Transparent', id: 'transparent' },
        { label: 'Opaque', id: 'opaque' },
      ],
      value: () => 'auto',
      condition: { field: 'model', value: 'gpt-image-1' },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      required: true,
      placeholder: 'Enter your OpenAI API key',
      password: true,
      connectionDroppable: false,
      condition: { field: 'model', value: ['dall-e-3', 'gpt-image-1'] },
    },
    {
      id: 'apiKey',
      title: 'Google API Key',
      type: 'short-input',
      required: true,
      placeholder: 'Enter your Google API key',
      password: true,
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: ['gemini-2.5-flash-image', 'gemini-3-pro-image'],
      },
    },
  ],
  tools: {
    access: ['openai_image', 'gemini_image'],
    config: {
      tool: (params) => {
        // Route to Gemini tool for Gemini models
        if (
          params.model === 'gemini-2.5-flash-image' ||
          params.model === 'gemini-3-pro-image'
        ) {
          return 'gemini_image'
        }
        // Default to OpenAI tool for DALL-E and GPT Image
        return 'openai_image'
      },
      params: (params) => {
        if (!params.apiKey) {
          throw new Error('API key is required')
        }
        if (!params.prompt) {
          throw new Error('Prompt is required')
        }

        const model = params.model || 'dall-e-3'

        // Gemini models
        if (model === 'gemini-2.5-flash-image' || model === 'gemini-3-pro-image') {
          return {
            prompt: params.prompt,
            model: model,
            aspectRatio: params.aspectRatio || '1:1',
            apiKey: params.apiKey,
          }
        }

        // OpenAI models (DALL-E 3 and GPT Image)
        const baseParams = {
          prompt: params.prompt,
          model: model,
          size: params.size || '1024x1024',
          apiKey: params.apiKey,
        }

        if (params.model === 'dall-e-3') {
          return {
            ...baseParams,
            quality: params.quality || 'standard',
            style: params.style || 'vivid',
          }
        }
        if (params.model === 'gpt-image-1') {
          return {
            ...baseParams,
            ...(params.background && { background: params.background }),
          }
        }

        return baseParams
      },
    },
  },
  inputs: {
    prompt: { type: 'string', description: 'Image description prompt' },
    model: { type: 'string', description: 'Image generation model' },
    size: { type: 'string', description: 'Image dimensions' },
    aspectRatio: { type: 'string', description: 'Image aspect ratio (Gemini models)' },
    quality: { type: 'string', description: 'Image quality level' },
    style: { type: 'string', description: 'Image style' },
    background: { type: 'string', description: 'Background type' },
    apiKey: { type: 'string', description: 'API key (OpenAI or Google)' },
  },
  outputs: {
    content: { type: 'string', description: 'Generation response' },
    image: { type: 'file', description: 'Generated image file (UserFile)' },
    metadata: { type: 'json', description: 'Generation metadata' },
    visualization: {
      type: 'image',
      url: 'image',
    },
  },
}
