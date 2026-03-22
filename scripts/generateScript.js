#!/usr/bin/env node

/**
 * Quick Script Generator for Instagram Reels
 * Usage: node scripts/generateScript.js --topic "Time Management" --style "Problem-Solution"
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES = {
  'Problem-Solution': {
    hook: 'Most people [describe problem]. Here\'s how to fix it.',
    main: 'The solution is [method]. Step 1: [action], Step 2: [action], Step 3: [action].',
    cta: 'Try this for a week. Drop a comment if it worked for you!'
  },
  'Myth-Truth': {
    hook: 'You\'ve been lied to about [topic]. The truth is [fact].',
    main: 'Here\'s the evidence: [proof/research]. Scientists confirm this.',
    cta: 'Stop believing the lie. Share this with someone who needs to know.'
  },
  'Tutorial': {
    hook: 'Learn [skill] in [time period]. It\'s easier than you think.',
    main: 'Follow these [number] steps. Each takes under a minute.',
    cta: 'Master this skill today. Your future self will thank you.'
  },
  'Motivation': {
    hook: '[Inspiring statement about topic].',
    main: 'Here\'s what changed for me: [personal example/data].',
    cta: 'Your turn. Will you try this? Comment your goals below.'
  }
};

const VOICE_OPTIONS = {
  professional: 'af_nova',
  warm: 'af_sarah',
  authoritative: 'am_michael',
  friendly: 'af_heart',
  energetic: 'am_echo'
};

const MUSIC_OPTIONS = {
  learning: 'hopeful',
  casual: 'chill',
  serious: 'contemplative',
  energetic: 'excited'
};

function generateSearchTerms(topic, context) {
  const base = topic.toLowerCase().split(' ');
  const contextualTerms = {
    'time management': ['productivity', 'clock', 'scheduling', 'organization'],
    'learning': ['study', 'knowledge', 'brain', 'education', 'notes'],
    'habit': ['routine', 'motivation', 'habit formation', 'discipline'],
    'productivity': ['focus', 'productivity', 'efficient', 'workflow'],
    'success': ['achievement', 'goal', 'success', 'victory', 'winning']
  };
  
  let terms = [];
  for (const [key, values] of Object.entries(contextualTerms)) {
    if (topic.toLowerCase().includes(key)) {
      terms = values;
      break;
    }
  }
  
  if (terms.length === 0) {
    terms = [topic.toLowerCase(), context.toLowerCase(), 'learning'];
  }
  
  return terms.slice(0, 3);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    config[key] = value;
  }
  
  return config;
}

function generateScript(topic, style = 'Problem-Solution', personality = 'professional') {
  const template = TEMPLATES[style] || TEMPLATES['Problem-Solution'];
  const voice = VOICE_OPTIONS[personality] || VOICE_OPTIONS.professional;
  
  const scenes = [
    {
      text: template.hook,
      searchTerms: generateSearchTerms(topic, 'introduction')
    },
    {
      text: template.main,
      searchTerms: generateSearchTerms(topic, 'content')
    },
    {
      text: template.cta,
      searchTerms: generateSearchTerms(topic, 'action')
    }
  ];
  
  const config = {
    orientation: 'portrait',
    music: MUSIC_OPTIONS.learning,
    musicVolume: 'high',
    captionPosition: 'bottom',
    voice: voice,
    paddingBack: 2000
  };
  
  return { scenes, config };
}

function validateScript(script) {
  if (!script.scenes || script.scenes.length !== 3) {
    throw new Error('Script must have exactly 3 scenes');
  }
  
  for (const scene of script.scenes) {
    if (!scene.text || scene.text.length < 10) {
      throw new Error('Scene text must be at least 10 characters');
    }
    if (!Array.isArray(scene.searchTerms) || scene.searchTerms.length < 2) {
      throw new Error('Each scene must have at least 2 search terms');
    }
  }
  
  return true;
}

function main() {
  const config = parseArgs();
  
  if (!config.topic) {
    console.error('Usage: node generateScript.js --topic "Your Topic" --style "Problem-Solution" --personality "professional"');
    console.error('\nAvailable styles:', Object.keys(TEMPLATES).join(', '));
    console.error('Available personalities:', Object.keys(VOICE_OPTIONS).join(', '));
    process.exit(1);
  }
  
  const script = generateScript(
    config.topic,
    config.style || 'Problem-Solution',
    config.personality || 'professional'
  );
  
  try {
    validateScript(script);
    console.log(JSON.stringify(script, null, 2));
    
    if (config.output) {
      fs.writeFileSync(config.output, JSON.stringify(script, null, 2));
      console.error(`✅ Script saved to ${config.output}`);
    }
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    process.exit(1);
  }
}

main();
