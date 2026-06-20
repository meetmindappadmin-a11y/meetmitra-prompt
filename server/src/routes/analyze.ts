import { Router } from 'express';
import type { AnalysisResult } from '@shared/types';
import { analyzeSchema } from '../lib/validate.js';
import { analyzeWithClaude, isLive } from '../ai/claude.js';
import { mockAnalyze } from '../ai/mockAnalyzer.js';
import { keywordRisk, maxRisk } from '../lib/crisis.js';

export const analyzeRouter = Router();

// POST /api/analyze — turns a journal entry + mood into a structured AnalysisResult.
analyzeRouter.post('/', async (req, res) => {
  const parsed = analyzeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }
  const { text, mood, exam } = parsed.data;

  let analysis: AnalysisResult;
  let source: 'claude' | 'mock' = 'mock';

  if (isLive()) {
    try {
      analysis = await analyzeWithClaude(text, mood, exam);
      source = 'claude';
    } catch (err) {
      console.error('[analyze] Claude failed, using mock fallback:', err);
      analysis = mockAnalyze(text, mood);
    }
  } else {
    analysis = mockAnalyze(text, mood);
  }

  // Safety net: never report a lower risk than the keyword scan detects.
  analysis.riskLevel = maxRisk(analysis.riskLevel, keywordRisk(text));

  res.json({ analysis, source });
});
