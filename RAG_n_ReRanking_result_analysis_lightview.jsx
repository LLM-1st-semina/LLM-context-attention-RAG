import React, { useState } from 'react';
import { 
  Search, Filter, CheckCircle, Brain, Zap, Info, 
  MessageSquare, LayoutGrid, Layers, Activity, 
  Cpu, Database, ArrowRight, ShieldCheck, Target, AlertTriangle
} from 'lucide-react';

const COLORS = {
  q1: '#4f46e5', // Indigo-600 (라이트모드에 맞춰 채도 조절)
  q2: '#059669', // Emerald-600
  q3: '#e11d48', // Rose-600
  q4: '#d97706', // Amber-600
  q5: '#0284c7', // Sky-600
};

const App = () => {
  const [activeAnalysis, setActiveAnalysis] = useState('q1');
  const [hoveredDocId, setHoveredDocId] = useState(null);

  const analysisData = {
    q1: {
      id: "TEST-001",
      intent: "Definition",
      query: "RAG는 왜 필요한가요?",
      retrieval: [
        { id: "DOC-A1", text: "RAG는 외부 지식을 가져와 LLM의 할루시네이션을 방지하는 기술입니다.", score: "High", type: "Target" },
        { id: "DOC-A2", text: "비트코인은 블록체인 기술을 기반으로 한 탈중앙화 디지털 자산입니다.", score: "Medium", type: "Noise" },
        { id: "DOC-A3", text: "트랜스포머 모델은 어텐션 메커니즘을 기반으로 작동합니다.", score: "Medium", type: "Related" }
      ],
      reranking: [
        { id: "DOC-A1", text: "RAG는 외부 지식을 가져와...", score: 8.75, gap: "+0.46" },
        { id: "DOC-A3", text: "트랜스포머 모델은...", score: 8.57, gap: "+0.28" },
        { id: "DOC-A2", text: "비트코인은 블록체인...", score: 8.29, gap: "Baseline" }
      ],
      insight: "기술적 정의를 묻는 질문에 리랭커가 '방지하는 기술', '작동합니다', '기반으로 한' 등 설명형 문체에 모두 높은 점수를 부여했습니다. 다행히 RAG 정의가 미세한 차이로 1위를 지켰습니다."
    },
    q2: {
      id: "TEST-002",
      intent: "Mechanism",
      query: "리랭커는 무엇을 개선하나요?",
      retrieval: [
        { id: "DOC-B1", text: "리랭커는 검색된 문서들 중 가장 적절한 답변을 상단으로 재정렬합니다.", score: "High", type: "Target" },
        { id: "DOC-B2", text: "트랜스포머 모델은 어텐션 메커니즘을 기반으로 작동합니다.", score: "High", type: "Relevant" },
        { id: "DOC-B3", text: "RAG는 외부 지식을 가져와...", score: "Medium", type: "Related" }
      ],
      reranking: [
        { id: "DOC-B2", text: "트랜스포머 모델은...", score: 8.15, gap: "+0.28" },
        { id: "DOC-B1", text: "리랭커는 검색된 문서들...", score: 8.13, gap: "+0.26" },
        { id: "DOC-B3", text: "RAG는 외부 지식을...", score: 7.87, gap: "Baseline" }
      ],
      insight: "흥미로운 '역전 현상'이 발생했습니다. 질문의 '개선' 키워드가 트랜스포머의 '어텐션 메커니즘 기반 작동' 설명과 강력하게 결합되어, 정답 후보보다 더 높은 점수를 받았습니다."
    },
    q3: {
      id: "TEST-003",
      intent: "Algorithm",
      query: "BPE 토크나이저는 어떻게 동작하나요?",
      retrieval: [
        { id: "DOC-C1", text: "BPE 토크나이저는 빈도 기반으로 단어를 조각내어 사전을 만듭니다.", score: "High", type: "Relevant" },
        { id: "DOC-C2", text: "GPU는 병렬 연산에 특화된 하드웨어입니다.", score: "Medium", type: "Noise" },
        { id: "DOC-C3", text: "vLLM은 PagedAttention을 통해 GPU 메모리 효율을 극대화합니다.", score: "Medium", type: "Noise" }
      ],
      reranking: [
        { id: "DOC-C1", text: "BPE 토크나이저는...", score: 8.14, gap: "+4.76" },
        { id: "DOC-C3", text: "vLLM은 PagedAttention...", score: 5.91, gap: "+2.53" },
        { id: "DOC-C2", text: "GPU는 병렬 연산...", score: 3.38, gap: "Baseline" }
      ],
      insight: "도메인 구분이 가장 확실한 케이스입니다. 소프트웨어(BPE) 질문에 하드웨어(GPU) 답변의 점수를 3점대로 폭락시키며, 리랭커가 개념 간의 거리를 명확히 인지하고 있음을 보여줍니다."
    },
    q4: {
      id: "TEST-004",
      intent: "Optimization",
      query: "vLLM의 메모리 최적화 방식은?",
      retrieval: [
        { id: "DOC-D1", text: "vLLM은 PagedAttention을 통해 GPU 메모리 효율을 극대화합니다.", score: "High", type: "Target" },
        { id: "DOC-D2", text: "GPU는 병렬 연산에 특화된 하드웨어입니다.", score: "Medium", type: "Related" },
        { id: "DOC-D3", text: "트랜스포머 모델은 어텐션 메커니즘을 기반으로 작동합니다.", score: "Medium", type: "Broad" }
      ],
      reranking: [
        { id: "DOC-D1", text: "vLLM은 PagedAttention...", score: 8.12, gap: "+2.58" },
        { id: "DOC-D3", text: "트랜스포머 모델은...", score: 7.62, gap: "+2.08" },
        { id: "DOC-D2", text: "GPU는 병렬 연산...", score: 5.54, gap: "Baseline" }
      ],
      insight: "단순히 'GPU' 단어가 포함된 문서보다, 질문의 '최적화 방식'과 논리적으로 연결되는 'PagedAttention을 통해 효율 극대화' 문장에 압도적인 점수를 부여했습니다."
    },
    q5: {
      id: "TEST-005",
      intent: "Architecture",
      query: "트랜스포머 모델의 핵심 메커니즘은?",
      retrieval: [
        { id: "DOC-E1", text: "트랜스포머 모델은 어텐션 메커니즘을 기반으로 작동합니다.", score: "High", type: "Target" },
        { id: "DOC-E2", text: "언어 모델은 다음 단어를 예측하는 방식으로 학습됩니다.", score: "Medium", type: "Relevant" },
        { id: "DOC-E3", text: "vLLM은 PagedAttention을 통해...", score: "Medium", type: "Noise" }
      ],
      reranking: [
        { id: "DOC-E1", text: "트랜스포머 모델은...", score: 7.82, gap: "+1.32" },
        { id: "DOC-E3", text: "vLLM은 PagedAttention...", score: 6.88, gap: "+0.38" },
        { id: "DOC-E2", text: "언어 모델은...", score: 6.50, gap: "Baseline" }
      ],
      insight: "질문의 '핵심 메커니즘'이 문서의 '어텐션 메커니즘'과 키워드 및 의미상 완벽히 일치하여 안정적인 1위를 기록했습니다."
    }
  };

  const current = analysisData[activeAnalysis];
  const activeColor = COLORS[activeAnalysis];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 text-slate-800 font-sans p-6 overflow-hidden box-border">
      
      {/* --- Header --- */}
      <header className="flex-none mb-4 grid grid-cols-12 gap-4 h-24">
        {/* Left: Active Test Case Info */}
        <div className="col-span-12 md:col-span-8 bg-white shadow-sm border border-slate-200 rounded-2xl p-4 flex items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full shadow-[0_0_10px_rgba(currentColor,0.2)] transition-colors duration-500" style={{ backgroundColor: activeColor, color: activeColor }}></div>
          
          <div className="flex gap-6 w-full items-center animate-in fade-in slide-in-from-left-4">
            <div className="flex-none w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-md overflow-hidden relative" style={{ backgroundColor: activeColor }}>
              <Brain className="w-8 h-8 opacity-20 absolute" />
              <span className="relative z-10 text-lg font-black">{current.id.split('-')[1]}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{current.id}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-widest font-semibold">{current.intent}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold" style={{ backgroundColor: `${activeColor}15`, color: activeColor, borderColor: `${activeColor}30` }}>
                  CROSS-ENCODER ACTIVE
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-1">
                <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" style={{ color: activeColor }} />
                <p className="text-sm font-semibold truncate">"{current.query}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: System Metrics Overview */}
        <div className="hidden md:flex col-span-4 bg-white shadow-sm border border-slate-200 rounded-2xl p-4 flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-[0.03]">
            <Cpu className="w-32 h-32 text-slate-900" />
          </div>
          <div className="flex justify-between items-center z-10">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 text-emerald-500" /> System Value Metrics
             </div>
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
          </div>
          
          <div className="flex gap-2 z-10 mt-2">
            <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-2 flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
                <Target className="w-4 h-4 text-cyan-600 mb-1" />
                <span className="text-[9px] text-slate-600 uppercase font-bold text-center">Intent<br/>Resolution</span>
            </div>
            <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-2 flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
                <ShieldCheck className="w-4 h-4 text-violet-600 mb-1" />
                <span className="text-[9px] text-slate-600 uppercase font-bold text-center">Noise<br/>Filtering</span>
            </div>
            <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-2 flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
                <Layers className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-[9px] text-slate-600 uppercase font-bold text-center">Hallucination<br/>Defense</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content Split --- */}
      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Sidebar: Test Cases & Logs */}
        <aside className="w-72 flex flex-col gap-4 flex-none">
          {/* Test Queue List */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Test Query Queue</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {Object.entries(analysisData).map(([key, data]) => {
                const isActive = activeAnalysis === key;
                const itemColor = COLORS[key];
                
                return (
                  <div 
                    key={key}
                    onClick={() => setActiveAnalysis(key)}
                    className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden
                      ${isActive 
                        ? 'bg-slate-50 shadow-sm border-slate-300' 
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'}`}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 transition-all" style={{ backgroundColor: itemColor, opacity: isActive ? 1 : 0.3 }}></div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{data.id}</span>
                      <span className="text-[9px] font-semibold text-slate-500 uppercase">{data.intent}</span>
                    </div>
                    <p className={`text-[11px] truncate ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>{data.query}</p>
                    {isActive && (
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset opacity-10" style={{ ringColor: itemColor }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expert Insight Log */}
          <div className="h-40 bg-slate-50 border border-slate-200 shadow-inner rounded-2xl p-4 font-mono text-[10px] overflow-hidden flex flex-col relative">
            <div className="absolute top-0 right-0 p-2 opacity-[0.04]">
                <Zap className="w-16 h-16" style={{ color: activeColor }} />
            </div>
            <div className="text-slate-500 mb-2 flex items-center gap-1 border-b border-slate-200 pb-2 font-bold">
              <Info className="w-3.5 h-3.5"/> EXPERT_ANALYSIS_LOG
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar text-slate-700 leading-relaxed pt-1 relative z-10">
               <span className="text-emerald-600 font-bold">[{new Date().toLocaleTimeString()}]</span> <br/>
               {current.insight}
            </div>
          </div>
        </aside>

        {/* --- Main Visualizer Area --- */}
        <main className="flex-1 flex flex-col gap-4 min-w-0">
          
          {/* Stage 1: Retrieval */}
          <div className="flex-1 bg-white shadow-sm border border-slate-200 rounded-2xl p-4 flex flex-col relative overflow-hidden min-h-0">
             <div className="flex justify-between items-center mb-4 flex-none">
                 <h2 className="text-xs font-bold flex items-center gap-2 tracking-tight text-slate-800 uppercase">
                   <Search className="w-4 h-4 text-cyan-600" />
                   Stage 1: Hybrid Retrieval (BM25 + MiniLM)
                 </h2>
                 <span className="text-[9px] bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600 font-mono font-semibold">Similarity Cluster</span>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {current.retrieval.map((item, i) => (
                    <div 
                        key={i} 
                        onMouseEnter={() => setHoveredDocId(item.id)}
                        onMouseLeave={() => setHoveredDocId(null)}
                        className={`group p-4 bg-white rounded-xl border transition-all duration-200 flex items-center justify-between
                          ${hoveredDocId === item.id ? 'border-slate-400 bg-slate-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}
                        `}
                    >
                        <div className="flex items-center gap-4 w-3/4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                <Database className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] text-slate-500 font-mono mb-0.5 font-semibold">{item.id}</span>
                                <span className="text-sm text-slate-800 truncate">{item.text}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 gap-1">
                            <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-widest border
                                ${item.type === 'Noise' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                  item.type === 'Target' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                  'bg-cyan-50 text-cyan-700 border-cyan-200'}
                            `}>
                                {item.type}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono font-medium">Score: {item.score}</span>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Stage 2: Reranking */}
          <div className="flex-1 bg-white shadow-sm border border-slate-200 rounded-2xl p-4 flex flex-col relative overflow-hidden min-h-0">
             <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                 <Filter className="w-40 h-40 text-slate-900" />
             </div>
             <div className="flex justify-between items-center mb-4 flex-none relative z-10">
                 <h2 className="text-xs font-bold flex items-center gap-2 tracking-tight text-slate-800 uppercase">
                   <Filter className="w-4 h-4 text-violet-600" />
                   Stage 2: Cross-Encoder Reranking (DeBERTa)
                 </h2>
                 <span className="text-[9px] bg-violet-50 px-2 py-1 rounded border border-violet-200 text-violet-700 font-mono font-semibold">Contextual Alignment</span>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 relative z-10">
                {current.reranking.map((item, i) => (
                    <div 
                        key={i} 
                        onMouseEnter={() => setHoveredDocId(item.id)}
                        onMouseLeave={() => setHoveredDocId(null)}
                        className={`relative p-4 rounded-xl border transition-all duration-300 flex justify-between items-center overflow-hidden
                            ${i === 0 
                                ? 'bg-indigo-50/50 border-indigo-300 shadow-sm' 
                                : 'bg-white border-slate-200'
                            }
                            ${hoveredDocId === item.id && i !== 0 ? 'border-slate-400 bg-slate-50' : ''}
                        `}
                    >
                        {i === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                        
                        <div className="flex items-center gap-4 w-2/3 pl-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm
                                ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-300'}
                            `}>
                                {i + 1}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className={`text-sm truncate font-semibold ${i === 0 ? 'text-indigo-950' : 'text-slate-800'}`}>
                                    {item.text}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono mt-0.5 font-medium">Ref: {item.id}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                            <div className="text-right">
                                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-0.5 font-semibold">Score</p>
                                <p className={`font-mono font-bold text-lg leading-none ${i === 0 ? 'text-indigo-600' : 'text-slate-700'}`}>
                                    {item.score.toFixed(4)}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <div className="text-center min-w-[50px]">
                                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-0.5 font-semibold">Gap</p>
                                <span className={`text-[10px] font-black font-mono
                                    ${item.gap.startsWith('+') ? 'text-emerald-600' : 'text-slate-400'}
                                `}>
                                    {item.gap}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>

        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
