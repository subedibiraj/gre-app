import { authenticateAndSecure } from './_middleware.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await authenticateAndSecure(req, res);
  if (!auth) return; // Middleware handled the response

  try {
    const { action, day, topicId } = req.body || {};

    if (action === 'index') {
      const [{ data: daysData }, { data: quantData }, { data: conceptData }, { data: awaData }] = await Promise.all([
        supabase.from('curriculum_verbal').select('day, theme, words').order('day'),
        supabase.from('curriculum_quant').select('id, label, icon, subtopics').order('id'),
        supabase.from('curriculum_quant_concepts').select('*'),
        supabase.from('curriculum_awa').select('prompts').eq('id', 1).single()
      ]);

      const indexDays = (daysData || []).map(d => ({
        day: d.day,
        theme: d.theme,
        wordCount: d.words ? d.words.length : 0,
        words: []
      }));

      const indexQuant = (quantData || []).map(t => ({
        id: t.id,
        label: t.label,
        icon: t.icon,
        subtopics: t.subtopics || [],
        questions: []
      }));

      const conceptsMap = {};
      (conceptData || []).forEach(row => {
        conceptsMap[row.id] = row.topics || [];
      });

      return res.status(200).json({
        DAYS: indexDays,
        QUANT_TOPICS: indexQuant,
        CONCEPTS: conceptsMap,
        AWA_PROMPTS: awaData?.prompts || [],
        plan: auth.plan
      });
    }

    if (action === 'day') {
      if (day === undefined) return res.status(400).json({ error: 'Missing day parameter' });
      const { data: dayData } = await supabase.from('curriculum_verbal').select('*').eq('day', parseInt(day, 10)).single();
      if (!dayData) return res.status(404).json({ error: 'Day not found' });
      
      // Remap from DB snake_case to frontend expected structure
      const mappedDay = {
        day: dayData.day,
        theme: dayData.theme,
        patterns: dayData.patterns || [],
        seStrategy: dayData.se_strategy || [],
        words: dayData.words || []
      };
      
      return res.status(200).json({ day: mappedDay });
    }

    if (action === 'quant') {
      if (!topicId) return res.status(400).json({ error: 'Missing topicId parameter' });
      const { data: topicData } = await supabase.from('curriculum_quant').select('*').eq('id', topicId).single();
      if (!topicData) return res.status(404).json({ error: 'Topic not found' });
      return res.status(200).json({ topic: topicData });
    }
    
    if (action === 'concepts') {
      const { data: conceptData } = await supabase.from('curriculum_quant_concepts').select('*');
      // Rebuild the object structure expected by the frontend
      const conceptsMap = {};
      (conceptData || []).forEach(row => {
        conceptsMap[row.id] = row.topics || [];
      });
      return res.status(200).json({ concepts: conceptsMap });
    }
    
    if (action === 'awa') {
      const { data: awaData } = await supabase.from('curriculum_awa').select('prompts').eq('id', 1).single();
      return res.status(200).json({ prompts: awaData?.prompts || [] });
    }

    return res.status(400).json({ error: 'Invalid action parameter' });

  } catch (err) {
    console.error('Curriculum API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
