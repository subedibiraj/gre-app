import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the data
import { DAYS } from '../api/_days.js';
import { QUANT_TOPICS } from '../api/_quant-topics.js';
import { CONCEPTS } from '../src/data/quant-concepts.js';
import { AWA_PROMPTS } from '../src/data/awa-prompts.js';

// Load env vars manually for this Node script
const envLocal = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
const supabaseUrl = envLocal.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = envLocal.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Verbal Days...');
  for (const day of DAYS) {
    const { error } = await supabase.from('curriculum_verbal').upsert({
      day: day.day,
      theme: day.theme,
      patterns: day.patterns || [],
      se_strategy: day.seStrategy || [],
      words: day.words || []
    });
    if (error) console.error(`Error on Day ${day.day}:`, error);
  }
  console.log('✅ Verbal Days Seeded');

  console.log('Seeding Quant Practice Generator Topics...');
  for (const topic of QUANT_TOPICS) {
    const { error } = await supabase.from('curriculum_quant').upsert({
      id: topic.id,
      label: topic.label,
      icon: topic.icon,
      subtopics: topic.subtopics || [],
      questions: topic.questions || []
    });
    if (error) console.error(`Error on Quant Topic ${topic.id}:`, error);
  }
  console.log('✅ Quant Practice Generator Topics Seeded');

  console.log('Seeding Quant Concepts Lessons...');
  for (const [id, topics] of Object.entries(CONCEPTS)) {
    const { error } = await supabase.from('curriculum_quant_concepts').upsert({
      id,
      topics
    });
    if (error) console.error(`Error on Concept ${id}:`, error);
  }
  console.log('✅ Quant Concepts Lessons Seeded');

  console.log('Seeding AWA Prompts...');
  const { error } = await supabase.from('curriculum_awa').upsert({
    id: 1,
    prompts: AWA_PROMPTS
  });
  if (error) console.error('Error on AWA:', error);
  else console.log('✅ AWA Prompts Seeded');

  console.log('All seeding completed successfully!');
}

seed();
