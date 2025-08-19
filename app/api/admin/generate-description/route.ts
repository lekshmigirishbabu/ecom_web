import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, category } = await request.json();
    
    // Check if product info is ambiguous
    const isAmbiguous = checkAmbiguity(title, category);
    
    if (!isAmbiguous) {
      return NextResponse.json({ 
        description: `High-quality ${title} in the ${category} category. Perfect for everyday use with excellent durability and performance.` 
      });
    }
    
    // For demo purposes, using a simple template
    // In production, you'd integrate with OpenAI, Claude, or another AI service
    const description = await generateAIDescription(title, category);
    
    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}

function checkAmbiguity(title: string, category: string): boolean {
  const ambiguousTerms = ['thing', 'item', 'product', 'stuff', 'device'];
  const lowercaseTitle = title.toLowerCase();
  
  return ambiguousTerms.some(term => lowercaseTitle.includes(term)) || 
         title.length < 3 || 
         !category;
}

async function generateAIDescription(title: string, category: string): Promise<string> {
  // This is a simplified version. In production, you'd call an actual AI API
  const templates = {
    electronics: `Experience cutting-edge technology with the ${title}. This premium ${category} device combines innovative features with reliable performance, making it perfect for both professional and personal use.`,
    clothing: `Discover style and comfort with the ${title}. This fashionable ${category} piece is crafted from high-quality materials and designed to complement your wardrobe with timeless elegance.`,
    books: `Immerse yourself in the world of ${title}. This captivating ${category} offers engaging content that will educate, entertain, and inspire readers of all backgrounds.`,
    home: `Transform your living space with the ${title}. This versatile ${category} item combines functionality with aesthetic appeal to enhance your home environment.`,
    sports: `Elevate your athletic performance with the ${title}. This professional-grade ${category} equipment is designed for durability and optimal performance in any sporting activity.`
  };
  
  return templates[category as keyof typeof templates] || 
         `Discover the exceptional quality of ${title}. This premium ${category} product is designed to meet your needs with outstanding performance and reliability.`;
}
