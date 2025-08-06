'use server';

/**
 * @fileOverview Product recommendation AI agent.
 *
 * - getProductRecommendations - A function that provides product recommendations based on cart items.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  cartItems: z.array(
    z.object({
      productId: z.string().describe('The unique identifier of the product.'),
      productName: z.string().describe('The name of the product.'),
      productDescription: z.string().describe('The description of the product.'),
      productCategory: z.string().describe('The category of the product.'),
    })
  ).describe('The list of items currently in the user\'s shopping cart.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      productId: z.string().describe('The unique identifier of the recommended product.'),
      productName: z.string().describe('The name of the recommended product.'),
      productDescription: z.string().describe('A short description of why this product is recommended.'),
    })
  ).describe('A list of product recommendations based on the items in the cart.'),
  reasoning: z.string().describe('The reasoning behind the product recommendations.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an AI shopping assistant that recommends related products based on the items in the user\'s cart.

  Here are the items in the user\'s cart:
  {{#each cartItems}}
  - Product ID: {{productId}}, Name: {{productName}}, Category: {{productCategory}}, Description: {{productDescription}}
  {{/each}}

  Recommend related products that the user might be interested in, providing a product ID, a name, and a short description of why each product is recommended based on what is already in the cart.
  Also, provide a summary of your reasoning for the recommendations.
  Output the recommendations in JSON format.  The productDescription field should contain the reasoning for each product recommendation.
  `,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
