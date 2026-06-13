import React, { useMemo } from 'react';
import C from '../theme';
import { getOverallStats, getScoreHistory } from '../engine/history';
import { getQuantWeakAreas } from '../engine/QuantErrorEngine';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function AnalyticsDashboard() {
  const stats = getOverallStats();
  const history = getScoreHistory();
  const weakAreas = getQuantWeakAreas();

  const topicData = useMemo(() => {
    if (!stats.topicAccuracy) return [
      { subject: 'Arithmetic', A: 0, fullMark: 100 },
      { subject: 'Algebra', A: 0, fullMark: 100 },
      { subject: 'Geometry', A: 0, fullMark: 100 },
      { subject: 'Data Analysis', A: 0, fullMark: 100 },
    ];
    return [
      { subject: 'Arithmetic', A: stats.topicAccuracy['arithmetic'] || 0, fullMark: 100 },
      { subject: 'Algebra', A: stats.topicAccuracy['algebra'] || 0, fullMark: 100 },
      { subject: 'Geometry', A: stats.topicAccuracy['geometry'] || 0, fullMark: 100 },
      { subject: 'Data Analysis', A: stats.topicAccuracy['data'] || 0, fullMark: 100 },
    ];
  }, [stats.topicAccuracy]);

  const hasData = history.length > 0;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 32 }}>🔬</span>
        <div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: C.gold, margin: 0 }}>Advanced Analytics</h2>
          <p style={{ color: C.textDim, fontSize: 13, margin: '4px 0 0' }}>Deep insight into your GRE preparation across all sections.</p>
        </div>
      </div>

      {!hasData ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
          <p style={{ fontSize: 48, margin: '0 0 12px' }}>📊</p>
          <h3 style={{ color: C.text, fontSize: 18, fontFamily: 'Georgia,serif', margin: '0 0 8px' }}>No Data Yet</h3>
          <p style={{ color: C.textMid, fontSize: 14, maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
            Complete mock exams and practice sessions to see your analytics here.
            Your topic proficiency, pacing, and weak areas will all appear automatically.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total Sessions', value: stats.totalSessions, icon: '📋', color: C.blue },
              { label: 'Questions Done', value: stats.totalQuestions || 0, icon: '✏️', color: C.gold },
              { label: 'Accuracy', value: stats.overallAccuracy != null ? `${stats.overallAccuracy}%` : '—', icon: '🎯', color: stats.overallAccuracy >= 70 ? C.greenBr : C.gold },
              { label: 'Verbal Best', value: stats.verbalMockBest || '—', icon: '📖', color: C.blue },
              { label: 'Quant Best', value: stats.quantMockBest || '—', icon: '📐', color: C.greenBr },
              { label: 'Today', value: stats.todaySessions, icon: '📅', color: C.gold },
            ].map(kpi => (
              <div key={kpi.label} style={{
                background: `linear-gradient(135deg, ${kpi.color}0C, ${C.card})`,
                border: `1px solid ${kpi.color}22`, borderRadius: 12, padding: '16px 14px', textAlign: 'center',
              }}>
                <p style={{ fontSize: 20, margin: '0 0 4px' }}>{kpi.icon}</p>
                <p style={{ fontFamily: 'Courier New,monospace', fontSize: 22, fontWeight: 700, color: kpi.color, margin: 0, lineHeight: 1 }}>
                  {kpi.value}
                </p>
                <p style={{ color: C.textDim, fontSize: 9, margin: '6px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kpi.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* Radar Chart */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px' }}>
              <h3 style={{ color: C.text, fontSize: 15, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.greenBr }}>⬡</span> Quant Topic Proficiency
              </h3>
              {topicData.some(d => d.A > 0) ? (
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={topicData}>
                      <defs>
                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.greenBr} stopOpacity={0.6}/>
                          <stop offset="95%" stopColor={C.greenBr} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke={C.border} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: C.textMid, fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Accuracy %" dataKey="A" stroke={C.greenBr} strokeWidth={2} fill="url(#colorAccuracy)" />
                      <RechartsTooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ color: C.textDim, fontSize: 13 }}>Complete quant practice sessions to see your topic radar.</p>
                </div>
              )}
            </div>

            {/* Pacing Stats */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px' }}>
              <h3 style={{ color: C.text, fontSize: 15, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.blue }}>⏱</span> Time Per Question (Mocks)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <PaceBar label="Quant Average" time={stats.avgQuantPace} target={105} color={C.greenBr} />
                <PaceBar label="Verbal Average" time={stats.avgVerbalPace} target={90} color={C.blue} />
              </div>
            </div>
          </div>

          {/* Score Trends */}
          {(stats.verbalTrend.length > 1 || stats.quantTrend.length > 1) && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px', marginBottom: 24 }}>
              <h3 style={{ color: C.text, fontSize: 15, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.gold }}>📈</span> Mock Score History
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {stats.verbalTrend.length > 0 && (
                  <div>
                    <p style={{ color: C.blue, fontSize: 11, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verbal Mocks</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                      {stats.verbalTrend.map((d, i) => {
                        const h = ((d.score - 130) / 40) * 100;
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontFamily: 'Courier New,monospace', fontSize: 10, color: C.blue, fontWeight: 700 }}>{d.score}</span>
                            <div style={{
                              width: '100%', maxWidth: 36, height: `${h}%`, minHeight: 4,
                              background: `linear-gradient(to top, ${C.blue}88, ${C.blue})`,
                              borderRadius: '4px 4px 0 0', transition: 'height 0.6s ease',
                            }} />
                            <span style={{ fontSize: 8, color: C.textDim }}>{d.date?.split('/').slice(0, 2).join('/')}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: C.textDim }}>Avg: {stats.verbalMockAvg}</span>
                      <span style={{ fontSize: 10, color: C.blue, fontWeight: 700 }}>Best: {stats.verbalMockBest}</span>
                    </div>
                  </div>
                )}
                {stats.quantTrend.length > 0 && (
                  <div>
                    <p style={{ color: C.greenBr, fontSize: 11, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quant Mocks</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                      {stats.quantTrend.map((d, i) => {
                        const h = ((d.score - 130) / 40) * 100;
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontFamily: 'Courier New,monospace', fontSize: 10, color: C.greenBr, fontWeight: 700 }}>{d.score}</span>
                            <div style={{
                              width: '100%', maxWidth: 36, height: `${h}%`, minHeight: 4,
                              background: `linear-gradient(to top, ${C.green}88, ${C.greenBr})`,
                              borderRadius: '4px 4px 0 0', transition: 'height 0.6s ease',
                            }} />
                            <span style={{ fontSize: 8, color: C.textDim }}>{d.date?.split('/').slice(0, 2).join('/')}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: C.textDim }}>Avg: {stats.quantMockAvg}</span>
                      <span style={{ fontSize: 10, color: C.greenBr, fontWeight: 700 }}>Best: {stats.quantMockBest}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section Accuracy Breakdown */}
          {stats.sectionAccuracy && Object.values(stats.sectionAccuracy).some(v => v !== null) && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px', marginBottom: 24 }}>
              <h3 style={{ color: C.text, fontSize: 15, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.gold }}>📊</span> Section Accuracy
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                {[
                  { key: 'vic', label: 'VIC', icon: '📝', color: C.blue },
                  { key: 'tc', label: 'TC', icon: '🔤', color: C.blue },
                  { key: 'se', label: 'SE', icon: '⚡', color: C.gold },
                  { key: 'rc', label: 'RC', icon: '📖', color: C.greenBr },
                  { key: 'qc', label: 'QC', icon: '⚖️', color: C.greenBr },
                  { key: 'mc', label: 'MC', icon: '🔢', color: C.gold },
                  { key: 'ne', label: 'NE', icon: '✏️', color: '#9B6BDB' },
                ].map(sec => {
                  const acc = stats.sectionAccuracy[sec.key];
                  const barColor = acc === null ? C.textDim : acc >= 80 ? C.greenBr : acc >= 60 ? C.gold : C.red;
                  return (
                    <div key={sec.key} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                        <span style={{ fontSize: 14 }}>{sec.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{sec.label}</span>
                      </div>
                      <p style={{ fontFamily: 'Courier New,monospace', fontSize: 20, fontWeight: 700, color: barColor, margin: '0 0 6px' }}>
                        {acc !== null ? `${acc}%` : '—'}
                      </p>
                      <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${acc || 0}%`, background: barColor, borderRadius: 2, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weakest Links Widget */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px', marginBottom: 24 }}>
            <h3 style={{ color: C.text, fontSize: 15, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: C.red }}>⚠️</span> Weakest Links — Prioritize These
            </h3>
            {weakAreas.length === 0 ? (
              <p style={{ color: C.textDim, fontSize: 13 }}>Not enough data yet. Complete more quant practice to identify your weak areas.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {weakAreas.slice(0, 6).map((w, idx) => {
                  const barColor = w.accuracy >= 70 ? C.gold : w.accuracy >= 40 ? '#E4A060' : C.red;
                  return (
                    <div key={idx} style={{
                      background: `linear-gradient(135deg, ${barColor}08, ${C.surface})`,
                      border: `1px solid ${barColor}33`, borderRadius: 10, padding: '14px 16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{w.subtopic}</span>
                        <span style={{ color: barColor, fontSize: 13, fontWeight: 700, fontFamily: 'Courier New,monospace' }}>{w.accuracy}%</span>
                      </div>
                      <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${w.accuracy}%`, background: barColor, borderRadius: 3, transition: 'width 0.6s ease' }} />
                      </div>
                      <p style={{ color: C.textDim, fontSize: 10, margin: '8px 0 0' }}>{w.attempts} attempts · {w.wrong} wrong</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Sessions */}
          {stats.recentSessions.length > 0 && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px' }}>
              <h3 style={{ color: C.text, fontSize: 15, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.textMid }}>🕐</span> Recent Sessions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {stats.recentSessions.slice().reverse().map((s, i) => {
                  const typeLabels = {
                    'verbal-mock': { label: 'Verbal Mock', color: C.blue, icon: '📖' },
                    'quant-mock': { label: 'Quant Mock', color: C.greenBr, icon: '📐' },
                    'verbal-practice': { label: 'Verbal Practice', color: C.blue, icon: '📝' },
                    'quant-practice': { label: 'Quant Practice', color: C.greenBr, icon: '🔢' },
                    'awa': { label: 'AWA Essay', color: C.gold, icon: '✍️' },
                  };
                  const t = typeLabels[s.type] || { label: s.type, color: C.textDim, icon: '📋' };
                  const scoreDisplay = s.scaledScore ? s.scaledScore : s.total ? `${s.correct}/${s.total}` : '—';

                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                      background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`,
                    }}>
                      <span style={{ fontSize: 16 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: C.text, fontSize: 13, margin: 0, fontWeight: 600 }}>{t.label}</p>
                        <p style={{ color: C.textDim, fontSize: 10, margin: '2px 0 0' }}>{s.date}</p>
                      </div>
                      <span style={{
                        fontFamily: 'Courier New,monospace', fontSize: 14, fontWeight: 700, color: t.color,
                        background: `${t.color}15`, padding: '4px 10px', borderRadius: 6,
                      }}>{scoreDisplay}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Pacing Bar Sub-component ─────────────────────────────────────────────────
function PaceBar({ label, time, target, color }) {
  const hasData = time !== null && time !== undefined;
  const isGood = hasData && time <= target;
  const barColor = !hasData ? C.textDim : isGood ? color : C.gold;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: C.textMid, fontSize: 13 }}>{label}</span>
        <span style={{ color: barColor, fontWeight: 700, fontFamily: 'Courier New,monospace' }}>
          {hasData ? `${time}s` : 'No data'}
        </span>
      </div>
      <div style={{ height: 6, background: C.surface, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${hasData ? Math.min(time / (target * 1.5) * 100, 100) : 0}%`,
          background: barColor, borderRadius: 3, transition: 'width 0.6s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ color: C.textDim, fontSize: 10 }}>Target: ~{target}s</span>
        {hasData && (
          <span style={{ color: isGood ? color : C.gold, fontSize: 10, fontWeight: 600 }}>
            {isGood ? '✓ On pace' : `${time - target}s over target`}
          </span>
        )}
      </div>
    </div>
  );
}
