const Anthropic = require('@anthropic-ai/sdk');

const TOPICS = [
  { day: 1,  pillar: 'explain',  topic: 'What is the Harada Method? The Japanese system Shohei Ohtani used at age 15' },
  { day: 2,  pillar: 'news',     topic: 'The OW64 Chart — tool spotlight: one goal, 64 daily tasks' },
  { day: 3,  pillar: 'ai',       topic: 'How to build a Harada daily diary using Claude AI in 20 minutes' },
  { day: 4,  pillar: 'feedback', topic: 'Motivation vs self-reliance — which one actually works long-term?' },
  { day: 5,  pillar: 'explain',  topic: 'Self-reliance: why Harada says discipline beats motivation every time' },
  { day: 6,  pillar: 'news',     topic: 'How Shohei Ohtani used Harada to become the greatest player alive' },
  { day: 7,  pillar: 'ai',       topic: 'Use AI to track your OW64 chart progress automatically every week' },
  { day: 8,  pillar: 'feedback', topic: 'What is your biggest goal right now? Tell us below' },
  { day: 9,  pillar: 'explain',  topic: 'The long-term goal form: how to write a goal the Harada way' },
  { day: 10, pillar: 'news',     topic: 'Harada Method vs SMART goals: which system actually gets results?' },
  { day: 11, pillar: 'ai',       topic: 'How to use AI to build your OW64 chart from scratch — free' },
  { day: 12, pillar: 'feedback', topic: 'Do you write your goals down daily? Poll for the community' },
  { day: 13, pillar: 'explain',  topic: 'The daily diary: how 5 minutes every evening builds elite discipline' },
  { day: 14, pillar: 'news',     topic: 'Week 2 wrap: best Harada insights from our community' },
  { day: 15, pillar: 'ai',       topic: 'Build a weekly Harada review system with AI — free Notion template' },
  { day: 16, pillar: 'feedback', topic: 'Which part of the Harada Method do you struggle with most?' },
  { day: 17, pillar: 'explain',  topic: 'The 4 aspects of Harada: spirit, skill, physical condition, daily life' },
  { day: 18, pillar: 'news',     topic: 'Harada Method in business: how 280 companies use it for teams' },
  { day: 19, pillar: 'ai',       topic: 'Automate your Harada routine check sheet with AI and Notion' },
  { day: 20, pillar: 'feedback', topic: 'Rate your self-reliance score honestly — out of 10' },
  { day: 21, pillar: 'explain',  topic: 'Why Harada says coaching is essential: you cannot see your own blind spots' },
  { day: 22, pillar: 'news',     topic: 'The science behind Harada: why writing goals by hand changes your brain' },
  { day: 23, pillar: 'ai',       topic: 'Use AI as your Harada coach: exact prompts for weekly accountability' },
  { day: 24, pillar: 'feedback', topic: 'What has the Harada Method changed for you? Share your story' },
  { day: 25, pillar: 'explain',  topic: 'Harada and Ikigai: how Japan combines purpose with daily discipline' },
  { day: 26, pillar: 'news',     topic: 'Month 1 spotlight: biggest Harada lessons from the community' },
  { day: 27, pillar: 'ai',       topic: 'Build your AI-powered Harada dashboard in Notion — full guide' },
  { day: 28, pillar: 'feedback', topic: 'Has your goal changed since starting Harada? Tell us' },
  { day: 29, pillar: 'explain',  topic: 'Harada for students: applying it to exams and career goals' },
  { day: 30, pillar: 'feedback', topic: 'Month 1 complete — what did you achieve? Community share' },
];

const PILLAR_PROMPTS = {
  explain:  'Write an educational X (Twitter) thread (6-8 tweets) explaining this concept clearly. Start with a scroll-stopping hook tweet. Break it down simply. End with CTA to follow @CrownAgency. Include hashtags on last tweet. Format: each tweet on a new line, separated by --- ',
  news:     'Write an informative X post (1-3 tweets) delivering this news or spotlight. Lead with the key fact. Be specific. End with CTA and hashtags. Format: each tweet on a new line, separated by ---',
  ai:       'Write an X thread (5-7 tweets) showing exactly how to use AI for this. Include actual prompts someone can copy today. Be specific and practical. End with CTA to follow @CrownAgency and hashtags. Format: each tweet separated by ---',
  feedback: 'Write an X poll post. Line 1-2: engaging setup. Then write POLL OPTIONS: (4 options). Then PINNED REPLY: (reply to post after). End with hashtags.',
};

function getTodayTopic() {
  const start = new Date('2026-03-26');
  const today = new Date();
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const index = ((diffDays % TOPICS.length) + TOPICS.length) % TOPICS.length;
  return TOPICS[index];
}

async function generatePost(topic) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    system: 'You are the content voice for Crown Agency — a brand teaching the Harada Method, Japan\'s most powerful goal-achievement system used by Shohei Ohtani. Your tone is knowledgeable, direct, and inspiring. Always sound human and authentic.',
    messages: [{
      role: 'user',
      content: `${PILLAR_PROMPTS[topic.pillar]}\n\nTopic: ${topic.topic}\n\nWrite only the post content. No explanations.`
    }]
  });
  return message.content[0].text;
}

async function postToBuffer(content) {
  // Takes first tweet only (up to 280 chars) for basic Buffer free posting
  const firstTweet = content.split('---')[0].trim().substring(0, 280);
  
  const response = await fetch('https://api.bufferapp.com/1/updates/create.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      text: firstTweet,
      'profile_ids[]': process.env.BUFFER_PROFILE_ID,
      access_token: process.env.BUFFER_ACCESS_TOKEN,
      now: 'true',
    }),
  });

  const data = await response.json();
  if (!data.success) throw new Error('Buffer failed: ' + JSON.stringify(data));
  console.log('Posted to X! Buffer ID:', data.updates[0].id);
  return data;
}

async function main() {
  console.log('=== Crown Agency X Auto-Poster ===');
  const topic = getTodayTopic();
  console.log('Pillar:', topic.pillar);
  console.log('Topic:', topic.topic);

  try {
    console.log('\nGenerating post with Claude...');
    const content = await generatePost(topic);
    console.log('\nGenerated:\n', content.substring(0, 200), '...\n');

    console.log('Sending to Buffer → X...');
    await postToBuffer(content);
    console.log('\nDONE. Check your X profile!');
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

main();
