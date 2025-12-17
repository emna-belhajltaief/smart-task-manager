// import OpenAI from 'openai'

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// })

// export async function generateEmbedding(text: string): Promise<number[]> {
//   const response = await openai.embeddings.create({
//     model: 'text-embedding-3-small',
//     input: text.slice(0, 8000), // Limite de tokens
//   })
//   return response.data[0].embedding
// }
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
