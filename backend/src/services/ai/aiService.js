const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

const AI_MOCK = process.env.AI_MOCK === 'true';
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

let openai, anthropic;

if (!AI_MOCK) {
  if (AI_PROVIDER === 'openai') {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } else if (AI_PROVIDER === 'anthropic') {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
}

async function callAI(prompt) {
  if (AI_MOCK) {
    return mockAIResponse(prompt);
  }

  try {
    if (AI_PROVIDER === 'openai') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      });
      return response.choices[0].message.content;
    } else if (AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      });
      return response.content[0].text;
    }
  } catch (error) {
    console.error('AI API error:', error);
    return mockAIResponse(prompt);
  }
}

function mockAIResponse(prompt) {
  console.log('Mock AI called with prompt containing:', prompt.substring(0, 100));
  
  if (prompt.includes('Parse this RFP')) {
    const result = {
      title: 'Website Development Project',
      description: 'Build a modern responsive website',
      requirements: ['Responsive design', 'SEO optimization', 'CMS integration'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      budget: 50000,
      contactEmail: 'project@company.com'
    };
    console.log('Returning mock RFP:', result);
    return JSON.stringify(result);
  } 
  
  if (prompt.includes('parse this vendor proposal')) {
    const result = {
      proposedCost: 45000,
      timeline: '12 weeks',
      keyFeatures: ['Custom CMS', 'Mobile-first design', 'Advanced SEO'],
      experience: '10+ years in web development',
      teamSize: 5
    };
    console.log('Returning mock proposal:', result);
    return JSON.stringify(result);
  } 
  
  if (prompt.includes('Compare these proposals')) {
    const result = {
      comparison: [
        {
          vendorName: 'Tech Solutions Inc',
          score: 85,
          strengths: ['Competitive pricing', 'Fast timeline'],
          weaknesses: ['Limited experience in industry']
        }
      ],
      recommendation: 'Tech Solutions Inc offers the best value with competitive pricing and reasonable timeline.'
    };
    console.log('Returning mock comparison:', result);
    return JSON.stringify(result);
  }
  
  console.log('No matching prompt pattern found');
  return '{}';
}

exports.parseRFP = async (naturalLanguageText) => {
  console.log('parseRFP called with:', naturalLanguageText);
  
  const prompt = `Parse this RFP description into structured JSON format with fields: title, description, requirements (array), deadline (ISO date), budget (number), contactEmail.

RFP Text:
${naturalLanguageText}

Return only valid JSON.`;

  console.log('Calling AI with prompt');
  const response = await callAI(prompt);
  console.log('AI Response:', response);
  
  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log('Cleaned response:', cleaned);
    const parsed = JSON.parse(cleaned);
    console.log('Parsed:', parsed);
    return parsed;
  } catch (e) {
    console.error('Parse error:', e);
    return {
      title: 'Parsed RFP',
      description: naturalLanguageText,
      requirements: ['Requirement 1', 'Requirement 2'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      budget: 50000,
      contactEmail: 'contact@example.com'
    };
  }
};
exports.parseProposal = async (emailBody) => {
  const prompt = `Parse this vendor proposal email into structured JSON with fields: proposedCost (number), timeline (string), keyFeatures (array), experience (string), teamSize (number).

Email:
${emailBody}

Return only valid JSON.`;

  const response = await callAI(prompt);
  try {
    return JSON.parse(response);
  } catch (e) {
    return {
      proposedCost: 0,
      timeline: 'Not specified',
      keyFeatures: [],
      experience: 'Not specified',
      teamSize: 0
    };
  }
};

exports.compareProposals = async (proposals) => {
  const proposalSummaries = proposals.map(p => ({
    vendorName: p.vendorId.name,
    cost: p.parsedData.proposedCost,
    timeline: p.parsedData.timeline,
    features: p.parsedData.keyFeatures,
    experience: p.parsedData.experience
  }));

  const prompt = `Compare these vendor proposals and provide a recommendation. Return JSON with: comparison (array of objects with vendorName, score 0-100, strengths array, weaknesses array), recommendation (string).

Proposals:
${JSON.stringify(proposalSummaries, null, 2)}

Return only valid JSON.`;

  const response = await callAI(prompt);
  try {
    return JSON.parse(response);
  } catch (e) {
    return {
      comparison: proposals.map(p => ({
        vendorName: p.vendorId.name,
        score: 70,
        strengths: ['Responsive'],
        weaknesses: ['Unknown']
      })),
      recommendation: 'All proposals are viable options. Consider budget and timeline priorities.'
    };
  }
};