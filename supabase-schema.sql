-- 1. Create Verbal Curriculum Table
CREATE TABLE IF NOT EXISTS curriculum_verbal (
    day INTEGER PRIMARY KEY,
    theme TEXT,
    patterns JSONB,
    se_strategy JSONB,
    words JSONB
);

-- 2. Create Quant Topics (Practice Generator) Table
CREATE TABLE IF NOT EXISTS curriculum_quant (
    id TEXT PRIMARY KEY,
    label TEXT,
    icon TEXT,
    subtopics JSONB,
    questions JSONB
);

-- 3. Create Quant Concepts (Lessons) Table
CREATE TABLE IF NOT EXISTS curriculum_quant_concepts (
    id TEXT PRIMARY KEY,
    topics JSONB
);

-- 4. Create AWA Prompts Table
CREATE TABLE IF NOT EXISTS curriculum_awa (
    id INTEGER PRIMARY KEY,
    prompts JSONB
);

-- 5. Disable Row Level Security (RLS) to allow our seed script and Admin UI to read/write using the Anon key
-- Note: In a true production environment, you would enable RLS and restrict access to admin users.
ALTER TABLE curriculum_verbal DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_quant DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_quant_concepts DISABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_awa DISABLE ROW LEVEL SECURITY;
