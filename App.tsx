import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { 
  FaPalette, FaLanguage, FaMoon, FaSun, FaDice, 
  FaBook, FaChartPie, FaRobot, FaStickyNote, FaMagic, 
  FaDownload, FaUpload, FaHistory, FaUserCog, FaEdit, FaEye, FaSave, FaPlus, FaTrash, FaTimes, FaHighlighter
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import jsyaml from 'js-yaml';
import rehypeRaw from 'rehype-raw';

import { ART_STYLES, AGENTS, LABELS } from './constants';
import { Language, ThemeMode, ArtStyle, JournalEntry, View, AgentPersona } from './types';
import { chatWithAgent, runMagic, organizeNotes, isApiReady } from './services/geminiService';

// --- Utility Components ---

const Button: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}> = ({ onClick, children, className, style, disabled }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`px-4 py-2 rounded-lg transition-all duration-300 font-bold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    style={style}
  >
    {children}
  </button>
);

const Card: React.FC<{ children: React.ReactNode; artStyle: ArtStyle; className?: string }> = ({ children, artStyle, className = '' }) => (
  <div className={`p-6 rounded-2xl shadow-xl border ${artStyle.cardBg} ${artStyle.borderColor} ${artStyle.textColor} ${className} transition-all duration-500`}>
    {children}
  </div>
);

// --- Main App ---

export default function App() {
  // State
  const [lang, setLang] = useState<Language>(Language.EN);
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.DARK);
  const [currentStyle, setCurrentStyle] = useState<ArtStyle>(ART_STYLES[0]);
  const [view, setView] = useState<View>('checkin');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isJackpotSpinning, setIsJackpotSpinning] = useState(false);
  const [agents, setAgents] = useState<AgentPersona[]>(AGENTS);

  // Form State
  const [formData, setFormData] = useState<Partial<JournalEntry>>({});
  
  // Chat State
  const [activeAgentId, setActiveAgentId] = useState<string>(AGENTS[0].id);
  const [chatLog, setChatLog] = useState<{sender: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  // Notes State
  const [rawNotes, setRawNotes] = useState("");
  const [organizedNotes, setOrganizedNotes] = useState("");
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [isEditingOrganized, setIsEditingOrganized] = useState(false);
  const [noteKeywords, setNoteKeywords] = useState<{text: string, color: string}[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newKeywordColor, setNewKeywordColor] = useState("#fbbf24");

  // Magic State
  const [magicOutput, setMagicOutput] = useState("");
  const [isCasting, setIsCasting] = useState(false);
  
  // History State
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [historyEditData, setHistoryEditData] = useState<Partial<JournalEntry>>({});

  // Agent Studio State
  const [editingAgent, setEditingAgent] = useState<AgentPersona | null>(null);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('agentic-life-os-data');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
    const savedAgents = localStorage.getItem('agentic-life-os-agents');
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    }
  }, []);

  // Save Data helper
  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('agentic-life-os-data', JSON.stringify(newEntries));
  };
  
  const saveAgents = (newAgents: AgentPersona[]) => {
    setAgents(newAgents);
    localStorage.setItem('agentic-life-os-agents', JSON.stringify(newAgents));
  };

  // Jackpot Logic
  const handleJackpot = () => {
    setIsJackpotSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomStyle = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
      setCurrentStyle(randomStyle);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsJackpotSpinning(false);
      }
    }, 100);
  };

  // Handlers
  const handleFormChange = (key: keyof JournalEntry, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const submitForm = async () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      q1_ai_apps: formData.q1_ai_apps || '',
      q2_adventures: formData.q2_adventures || '',
      q3_habit: formData.q3_habit || '',
      q4_simple_life: formData.q4_simple_life || '',
      q5_delivery_120: formData.q5_delivery_120 || '',
      q6_ahead_time: formData.q6_ahead_time || '',
      q7_good_will: formData.q7_good_will || '',
      q8_commitments: formData.q8_commitments || '',
      q9_achievement: formData.q9_achievement || '',
    };

    // Auto-Magic: Get Mood
    if (isApiReady()) {
      try {
        const moodJson = await runMagic('mood', newEntry);
        const moodData = JSON.parse(moodJson);
        newEntry.mood_score = moodData.score;
        newEntry.mood_color = moodData.color;
        newEntry.mood_emoji = moodData.emoji;
      } catch (e) { console.error(e); }
    }

    const updated = [...entries, newEntry];
    saveEntries(updated);
    alert("Entry Saved!");
    setFormData({});
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        if (event.target?.result) {
          try {
            const parsed = JSON.parse(event.target.result as string);
            saveEntries(parsed);
            alert("Import Successful!");
          } catch(e) {
            alert("Invalid JSON file");
          }
        }
      };
    }
  };
  
  // Agent Handlers
  const handleImportAgents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        if (event.target?.result) {
           try {
             const loaded = jsyaml.load(event.target.result as string) as AgentPersona[];
             if(Array.isArray(loaded) && loaded[0].id) {
               saveAgents(loaded);
               alert("Agents Imported Successfully!");
             } else {
               alert("Invalid Agent Format");
             }
           } catch(e) {
             alert("Error parsing YAML/JSON");
           }
        }
      };
    }
  };

  const handleExportAgents = () => {
    const yamlStr = jsyaml.dump(agents);
    const dataStr = "data:text/yaml;charset=utf-8," + encodeURIComponent(yamlStr);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "agents.yaml");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleUpdateAgent = () => {
    if (editingAgent) {
      const updatedAgents = agents.map(a => a.id === editingAgent.id ? editingAgent : a);
      if (!agents.find(a => a.id === editingAgent.id)) {
        updatedAgents.push(editingAgent);
      }
      saveAgents(updatedAgents);
      setEditingAgent(null);
    }
  };

  const handleDeleteAgent = (id: string) => {
    if (window.confirm("Are you sure?")) {
      saveAgents(agents.filter(a => a.id !== id));
      if (editingAgent?.id === id) setEditingAgent(null);
    }
  };

  // History Handlers
  const handleDownloadEntry = (entry: JournalEntry) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entry, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `entry-${entry.date}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDeleteEntry = (id: string) => {
    if(window.confirm("Are you sure you want to delete this entry?")) {
      const updated = entries.filter(e => e.id !== id);
      saveEntries(updated);
      setSelectedHistoryId(null);
      setIsEditingHistory(false);
    }
  };

  const startEditHistory = (entry: JournalEntry) => {
    setHistoryEditData(entry);
    setIsEditingHistory(true);
  };

  const saveHistoryEdit = () => {
    if(!selectedHistoryId) return;
    const updated = entries.map(e => e.id === selectedHistoryId ? { ...e, ...historyEditData } as JournalEntry : e);
    saveEntries(updated);
    setIsEditingHistory(false);
  };

  // Chat
  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatLog(prev => [...prev, { sender: 'User', text: userMsg }]);
    setChatInput("");
    setIsChatting(true);

    const response = await chatWithAgent(activeAgent.model, activeAgent.systemPrompt, userMsg, entries);
    
    setChatLog(prev => [...prev, { sender: activeAgent.name, text: response }]);
    setIsChatting(false);
  };

  // Notes
  const handleOrganizeNotes = async () => {
    setIsOrganizing(true);
    const result = await organizeNotes(rawNotes);
    setOrganizedNotes(result);
    setIsOrganizing(false);
  };

  const handleDownloadNotes = () => {
    const element = document.createElement("a");
    const file = new Blob([organizedNotes], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `notes-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
  };

  const addNoteKeyword = () => {
    if (newKeyword && !noteKeywords.find(k => k.text === newKeyword)) {
      setNoteKeywords([...noteKeywords, { text: newKeyword, color: newKeywordColor }]);
      setNewKeyword("");
    }
  };

  const getHighlightedNotes = () => {
    let text = organizedNotes;
    // Simple naive replacement for demonstration. 
    // In production, careful parsing to avoid replacing inside existing HTML tags is needed.
    // For markdown, replacing raw text is usually okay if keywords are unique.
    noteKeywords.forEach(kw => {
       const regex = new RegExp(`(${kw.text})`, 'gi');
       text = text.replace(regex, `<span style="color: ${kw.color}; font-weight: bold;">$1</span>`);
    });
    return text;
  };

  const handleMagic = async (type: 'narrative' | 'pattern' | 'socratic') => {
    setIsCasting(true);
    let dataPayload = type === 'pattern' ? entries.slice(-30) : entries[entries.length - 1]; // Pattern uses history, others use latest
    
    if (!dataPayload) {
      setMagicOutput("No data available.");
      setIsCasting(false);
      return;
    }

    const result = await runMagic(type, dataPayload);
    setMagicOutput(result);
    setIsCasting(false);
  };

  // Styles wrapper
  const appStyle = {
    fontFamily: currentStyle.fontFamily,
  };

  const navBtnClass = `flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-white/10 rounded-lg transition-colors ${currentStyle.textColor}`;

  return (
    <div 
      className={`min-h-screen w-full transition-colors duration-700 ${currentStyle.bgGradient} ${theme === ThemeMode.DARK ? 'dark' : ''}`}
      style={appStyle}
    >
      <div className="flex h-screen overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className={`w-64 flex-shrink-0 flex flex-col p-4 backdrop-blur-md border-r ${currentStyle.borderColor} bg-black/20 z-20`}>
          <div className="mb-8">
            <h1 className={`text-2xl font-bold ${currentStyle.textColor}`}>{LABELS[lang].title}</h1>
            <p className={`text-xs opacity-70 ${currentStyle.textColor}`}>{currentStyle.name}</p>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto">
            <button onClick={() => setView('checkin')} className={`${navBtnClass} ${view === 'checkin' ? 'bg-white/20' : ''}`}>
              <FaBook /> {LABELS[lang].checkin}
            </button>
            <button onClick={() => setView('dashboard')} className={`${navBtnClass} ${view === 'dashboard' ? 'bg-white/20' : ''}`}>
              <FaChartPie /> {LABELS[lang].dashboard}
            </button>
             <button onClick={() => setView('history')} className={`${navBtnClass} ${view === 'history' ? 'bg-white/20' : ''}`}>
              <FaHistory /> {LABELS[lang].history}
            </button>
            <button onClick={() => setView('chat')} className={`${navBtnClass} ${view === 'chat' ? 'bg-white/20' : ''}`}>
              <FaRobot /> {LABELS[lang].chat}
            </button>
            <button onClick={() => setView('agents')} className={`${navBtnClass} ${view === 'agents' ? 'bg-white/20' : ''}`}>
              <FaUserCog /> {LABELS[lang].agents}
            </button>
            <button onClick={() => setView('notes')} className={`${navBtnClass} ${view === 'notes' ? 'bg-white/20' : ''}`}>
              <FaStickyNote /> {LABELS[lang].notes}
            </button>
            <button onClick={() => setView('magics')} className={`${navBtnClass} ${view === 'magics' ? 'bg-white/20' : ''}`}>
              <FaMagic /> {LABELS[lang].magics}
            </button>
          </nav>

          <div className="pt-4 border-t border-white/20 space-y-4 flex-shrink-0">
            <div className="flex justify-between">
               <button onClick={handleJackpot} className={`p-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-white shadow-lg transform transition hover:scale-110 ${isJackpotSpinning ? 'animate-spin' : ''}`} title="Style Jackpot">
                 <FaDice />
               </button>
               <button onClick={() => setTheme(theme === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK)} className={`p-2 rounded-full bg-white/10 ${currentStyle.textColor}`}>
                 {theme === ThemeMode.DARK ? <FaSun /> : <FaMoon />}
               </button>
               <button onClick={() => setLang(lang === Language.EN ? Language.ZH : Language.EN)} className={`p-2 rounded-full bg-white/10 ${currentStyle.textColor}`}>
                 <FaLanguage />
               </button>
            </div>
            <div className="flex gap-2">
              <label className={`flex-1 p-2 rounded cursor-pointer bg-white/10 text-center text-xs ${currentStyle.textColor}`}>
                <FaUpload className="inline mr-1"/> Import
                <input type="file" className="hidden" onChange={handleImport} accept=".json" />
              </label>
              <button onClick={handleExport} className={`flex-1 p-2 rounded bg-white/10 text-xs ${currentStyle.textColor}`}>
                <FaDownload className="inline mr-1"/> Export
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          
          {/* Header Bar */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className={`text-3xl font-bold ${currentStyle.textColor} drop-shadow-md`}>
              {LABELS[lang][view]}
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-mono bg-black/30 ${currentStyle.textColor}`}>
               {entries.length} Entries Recorded
            </div>
          </div>

          {/* CHECK-IN VIEW */}
          {view === 'checkin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pb-20">
              {LABELS[lang].questions.map((q, idx) => (
                <Card key={idx} artStyle={currentStyle} className={idx === 8 ? 'md:col-span-2' : ''}>
                  <label className={`block mb-2 font-bold opacity-90`}>{q}</label>
                  <textarea 
                    className={`w-full p-3 rounded bg-black/10 border-0 focus:ring-2 ring-[${currentStyle.accentColor}] min-h-[80px] text-lg outline-none`}
                    onChange={(e) => handleFormChange(`q${idx + 1}_${Object.keys(formData).length}` as any, e.target.value)}
                    placeholder="..."
                  />
                </Card>
              ))}
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={submitForm} className={`text-xl py-4 px-8 text-white shadow-lg`} style={{backgroundColor: currentStyle.accentColor}}>
                  {LABELS[lang].save}
                </Button>
              </div>
            </div>
          )}

          {/* HISTORY VIEW */}
          {view === 'history' && (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
               {/* List */}
               <Card artStyle={currentStyle} className="w-full lg:w-1/4 overflow-y-auto flex flex-col gap-2">
                 <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10 py-2">
                    <h3 className="font-bold opacity-70">Entries</h3>
                    <button onClick={() => {setSelectedHistoryId(null); setIsEditingHistory(false)}} className="text-xs opacity-50 hover:opacity-100">Clear</button>
                 </div>
                 {[...entries].reverse().map(e => (
                   <button 
                     key={e.id}
                     onClick={() => { setSelectedHistoryId(e.id); setIsEditingHistory(false); }}
                     className={`p-3 rounded text-left transition hover:bg-white/10 ${selectedHistoryId === e.id ? 'bg-white/20 border-l-4' : ''}`}
                     style={{borderColor: currentStyle.accentColor}}
                   >
                     <div className="font-bold">{e.date}</div>
                     <div className="text-xs opacity-60 truncate">{e.q9_achievement}</div>
                     {e.mood_emoji && <div className="absolute top-2 right-2">{e.mood_emoji}</div>}
                   </button>
                 ))}
                 {entries.length === 0 && <div className="opacity-50 italic text-center">No entries yet.</div>}
               </Card>
               
               {/* Details */}
               <Card artStyle={currentStyle} className="flex-1 overflow-y-auto">
                 {selectedHistoryId ? (
                   (() => {
                     const e = entries.find(x => x.id === selectedHistoryId);
                     if(!e) return null;
                     
                     if (isEditingHistory) {
                       return (
                         <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/20 pb-4">
                                <h2 className="text-2xl font-bold">Editing: {e.date}</h2>
                                <div className="flex gap-2">
                                  <Button onClick={() => setIsEditingHistory(false)} className="bg-white/10 text-sm">Cancel</Button>
                                  <Button onClick={saveHistoryEdit} style={{backgroundColor: currentStyle.accentColor}} className="text-white text-sm">Save Changes</Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                               {LABELS[lang].questions.map((q, i) => {
                                 const key = `q${i+1}_${Object.keys(historyEditData).filter(k=>k.startsWith(`q${i+1}`))[0]?.split('_').slice(1).join('_') || Object.keys(historyEditData)[i+3]}` as keyof JournalEntry;
                                 // Simple logic to find the key for editing since interface keys are a bit loose with the index in this demo structure
                                 // We rely on the fact that keys are stable.
                                 const val = (historyEditData as any)[Object.keys(historyEditData).find(k => k.startsWith(`q${i+1}`)) || ''];
                                 return (
                                   <div key={i}>
                                      <label className="text-xs opacity-70 block mb-1">{q}</label>
                                      <textarea 
                                        className="w-full bg-black/20 rounded p-2 outline-none border border-transparent focus:border-white/30"
                                        value={val || ''}
                                        onChange={(ev) => {
                                            const actualKey = Object.keys(historyEditData).find(k => k.startsWith(`q${i+1}`)) || key;
                                            setHistoryEditData(prev => ({...prev, [actualKey]: ev.target.value}));
                                        }}
                                      />
                                   </div>
                                 )
                               })}
                            </div>
                         </div>
                       )
                     }

                     return (
                       <div className="space-y-6">
                         <div className="border-b border-white/20 pb-4 flex justify-between items-start">
                            <div>
                              <h2 className="text-3xl font-bold">{e.date}</h2>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 rounded bg-black/20 text-xs">Mood: {e.mood_score} {e.mood_emoji}</span>
                                {e.magic_tags?.map(t => <span key={t} className="px-2 py-1 rounded bg-white/10 text-xs">#{t}</span>)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full mr-4" style={{backgroundColor: e.mood_color}}></div>
                                <button onClick={() => handleDownloadEntry(e)} className="p-2 bg-white/10 rounded hover:bg-white/20" title="Download Entry"><FaDownload/></button>
                                <button onClick={() => startEditHistory(e)} className="p-2 bg-white/10 rounded hover:bg-white/20" title="Edit Entry"><FaEdit/></button>
                                <button onClick={() => handleDeleteEntry(e.id)} className="p-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/40" title="Delete Entry"><FaTrash/></button>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {LABELS[lang].questions.map((q, i) => (
                             <div key={i} className={i === 8 ? 'md:col-span-2' : ''}>
                               <h4 className="opacity-60 text-xs uppercase font-bold mb-1">{q}</h4>
                               <p className="text-lg whitespace-pre-wrap bg-black/5 p-2 rounded">{(e as any)[Object.keys(e).find(k => k.startsWith(`q${i+1}`)) || '']}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                     )
                   })()
                 ) : (
                   <div className="h-full flex items-center justify-center opacity-40">Select an entry to view details</div>
                 )}
               </Card>
            </div>
          )}

          {/* AGENT STUDIO VIEW */}
          {view === 'agents' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
               <div className="flex flex-col gap-4 overflow-y-auto">
                 <div className="flex gap-2">
                   <label className="flex-1 cursor-pointer bg-white/10 p-2 rounded text-center hover:bg-white/20 transition">
                     <FaUpload className="inline mr-2" /> Upload YAML
                     <input type="file" className="hidden" accept=".yaml,.yml,.json" onChange={handleImportAgents} />
                   </label>
                   <Button onClick={handleExportAgents} className="flex-1 bg-white/10 hover:bg-white/20">
                     <FaDownload className="inline mr-2" /> Download YAML
                   </Button>
                   <Button onClick={() => setEditingAgent({id: Date.now().toString(), name: 'New Agent', role: 'Helper', model: 'gemini-2.5-flash', systemPrompt: ''})} style={{backgroundColor: currentStyle.accentColor}} className="flex-1 text-white">
                     <FaPlus className="inline mr-2" /> Create
                   </Button>
                 </div>
                 
                 {agents.map(agent => (
                   <Card key={agent.id} artStyle={currentStyle} className="group relative">
                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                       <button onClick={() => setEditingAgent(agent)} className="p-2 bg-white/20 rounded hover:bg-white/40"><FaEdit/></button>
                       {agents.length > 1 && <button onClick={() => handleDeleteAgent(agent.id)} className="p-2 bg-red-500/20 rounded hover:bg-red-500/40 text-red-300"><FaTrash/></button>}
                     </div>
                     <h3 className="font-bold text-lg">{agent.name} <span className="opacity-50 text-sm font-normal">({agent.role})</span></h3>
                     <div className="text-xs opacity-60 font-mono mt-1 mb-2">{agent.model}</div>
                     <p className="text-sm line-clamp-2 opacity-80">{agent.systemPrompt}</p>
                   </Card>
                 ))}
               </div>

               <Card artStyle={currentStyle} className="flex flex-col h-full">
                 {editingAgent ? (
                   <div className="flex flex-col gap-4 h-full">
                     <h3 className="text-xl font-bold border-b border-white/20 pb-2">Edit Agent</h3>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="text-xs opacity-70 block mb-1">Name</label>
                         <input 
                            className="w-full bg-black/20 rounded p-2 outline-none border border-transparent focus:border-white/30"
                            value={editingAgent.name}
                            onChange={(e) => setEditingAgent({...editingAgent, name: e.target.value})}
                         />
                       </div>
                       <div>
                         <label className="text-xs opacity-70 block mb-1">Role</label>
                         <input 
                            className="w-full bg-black/20 rounded p-2 outline-none border border-transparent focus:border-white/30"
                            value={editingAgent.role}
                            onChange={(e) => setEditingAgent({...editingAgent, role: e.target.value})}
                         />
                       </div>
                     </div>
                     <div>
                       <label className="text-xs opacity-70 block mb-1">Model</label>
                       <select 
                          className="w-full bg-black/20 rounded p-2 outline-none border border-transparent focus:border-white/30"
                          value={editingAgent.model}
                          onChange={(e) => setEditingAgent({...editingAgent, model: e.target.value})}
                       >
                         <option value="gemini-2.5-flash">gemini-2.5-flash (Fast)</option>
                         <option value="gemini-3-flash-preview">gemini-3-flash-preview (Creative)</option>
                         <option value="gemini-3-pro-preview">gemini-3-pro-preview (Smart)</option>
                       </select>
                     </div>
                     <div className="flex-1 flex flex-col">
                       <label className="text-xs opacity-70 block mb-1">System Prompt</label>
                       <textarea 
                          className="flex-1 w-full bg-black/20 rounded p-2 outline-none border border-transparent focus:border-white/30 resize-none font-mono text-sm"
                          value={editingAgent.systemPrompt}
                          onChange={(e) => setEditingAgent({...editingAgent, systemPrompt: e.target.value})}
                       />
                     </div>
                     <div className="flex justify-end gap-2">
                       <Button onClick={() => setEditingAgent(null)} className="bg-white/10">Cancel</Button>
                       <Button onClick={handleUpdateAgent} style={{backgroundColor: currentStyle.accentColor}} className="text-white">Save Agent</Button>
                     </div>
                   </div>
                 ) : (
                   <div className="flex items-center justify-center h-full opacity-40">Select an agent to edit</div>
                 )}
               </Card>
             </div>
          )}

          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card artStyle={currentStyle} className="h-96">
                 <h3 className="mb-4 text-xl font-bold opacity-80">Check-in Frequency</h3>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={entries.slice(-7)}>
                       <XAxis dataKey="date" stroke={theme === 'dark' ? '#fff' : '#000'} />
                       <YAxis stroke={theme === 'dark' ? '#fff' : '#000'} />
                       <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '8px'}} />
                       <Bar dataKey="mood_score" fill={currentStyle.accentColor} name="Mood Score" />
                    </BarChart>
                 </ResponsiveContainer>
               </Card>

               <Card artStyle={currentStyle} className="h-96">
                 <h3 className="mb-4 text-xl font-bold opacity-80">Simplicity vs Habits</h3>
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={entries.slice(-14)}>
                       <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                       <XAxis dataKey="date" hide />
                       <YAxis />
                       <Tooltip />
                       <Legend />
                       <Line type="monotone" dataKey="q4_simple_life.length" stroke="#8884d8" name="Simplicity Items" strokeWidth={3} />
                       <Line type="monotone" dataKey="q3_habit.length" stroke={currentStyle.accentColor} name="Habit Strength" strokeWidth={3} />
                    </LineChart>
                 </ResponsiveContainer>
               </Card>

               {/* Recent Entries Mood Grid */}
               <Card artStyle={currentStyle} className="lg:col-span-2">
                  <h3 className="mb-4 text-xl font-bold opacity-80">Mood Scape (Last 30 Days)</h3>
                  <div className="flex flex-wrap gap-2">
                    {entries.slice(-30).map((e, i) => (
                      <div 
                        key={i} 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border border-white/20 transition hover:scale-125 cursor-help"
                        style={{ backgroundColor: e.mood_color || '#333' }}
                        title={`${e.date}: ${e.mood_score}`}
                      >
                        {e.mood_emoji || '•'}
                      </div>
                    ))}
                  </div>
               </Card>
            </div>
          )}

          {/* CHAT VIEW */}
          {view === 'chat' && (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
              <div className="w-full lg:w-1/3 space-y-4">
                <Card artStyle={currentStyle}>
                  <h3 className="font-bold mb-2">Select Agent</h3>
                  <select 
                    className="w-full p-2 rounded bg-black/20"
                    value={activeAgentId}
                    onChange={(e) => setActiveAgentId(e.target.value)}
                  >
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
                  </select>
                  <p className="mt-2 text-sm opacity-70 italic">{activeAgent?.systemPrompt}</p>
                </Card>
                <div className="hidden lg:block">
                  <h4 className={`text-sm font-bold uppercase mb-2 ${currentStyle.textColor}`}>Data Context Preview</h4>
                  <pre className="text-xs p-2 bg-black/30 rounded overflow-auto h-64 font-mono">
                    {JSON.stringify(entries.slice(-3), null, 2)}
                  </pre>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <Card artStyle={currentStyle} className="flex-1 flex flex-col overflow-hidden !p-0">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatLog.map((msg, i) => (
                       <div key={i} className={`flex flex-col ${msg.sender === 'User' ? 'items-end' : 'items-start'}`}>
                          <span className="text-xs opacity-50 mb-1">{msg.sender}</span>
                          <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'User' ? 'bg-white/20 rounded-tr-none' : 'bg-black/40 rounded-tl-none'}`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                       </div>
                    ))}
                    {isChatting && <div className="text-center opacity-50 animate-pulse">Agent is thinking...</div>}
                  </div>
                  <div className="p-4 bg-black/10 border-t border-white/10 flex gap-2">
                    <input 
                      className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 outline-none focus:border-white"
                      placeholder="Ask your records..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                    />
                    <Button onClick={handleChat} style={{backgroundColor: currentStyle.accentColor}} className="text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <FaRobot />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* NOTES VIEW */}
          {view === 'notes' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
               <div className="flex flex-col gap-4">
                 <Card artStyle={currentStyle} className="flex-1 flex flex-col">
                   <h3 className="font-bold mb-2">Brain Dump (Messy)</h3>
                   <textarea 
                     className="flex-1 w-full bg-transparent resize-none outline-none font-mono text-sm"
                     placeholder="Type your messy thoughts here..."
                     value={rawNotes}
                     onChange={(e) => setRawNotes(e.target.value)}
                   />
                 </Card>
                 <Button onClick={handleOrganizeNotes} style={{backgroundColor: currentStyle.accentColor}} className="text-white w-full">
                   {isOrganizing ? 'Organizing...' : 'Organize with AI'}
                 </Button>
               </div>
               <Card artStyle={currentStyle} className="flex flex-col overflow-hidden">
                 <div className="flex flex-col gap-2 mb-4 border-b border-white/10 pb-2">
                   <div className="flex justify-between items-center">
                       <h3 className="font-bold">Structured Output</h3>
                       <div className="flex gap-2">
                          <button onClick={() => setIsEditingOrganized(!isEditingOrganized)} className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20">
                            {isEditingOrganized ? <><FaEye className="inline"/> Preview</> : <><FaEdit className="inline"/> Edit</>}
                          </button>
                          <button onClick={handleDownloadNotes} className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20">
                            <FaDownload className="inline"/> MD
                          </button>
                       </div>
                   </div>
                   {/* Keyword Highlighter Controls */}
                   {!isEditingOrganized && (
                       <div className="flex items-center gap-2 text-sm bg-white/5 p-2 rounded">
                           <FaHighlighter className="opacity-70" />
                           <input 
                              className="bg-black/20 rounded px-2 py-1 w-24 outline-none border border-transparent focus:border-white/30"
                              placeholder="Keyword"
                              value={newKeyword}
                              onChange={(e) => setNewKeyword(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addNoteKeyword()}
                           />
                           <input 
                              type="color"
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                              value={newKeywordColor}
                              onChange={(e) => setNewKeywordColor(e.target.value)}
                           />
                           <button onClick={addNoteKeyword} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20"><FaPlus size={10}/></button>
                           <div className="flex flex-wrap gap-1 ml-2">
                               {noteKeywords.map((k, i) => (
                                   <span key={i} className="px-2 py-0.5 rounded text-xs flex items-center gap-1 text-black font-bold" style={{backgroundColor: k.color}}>
                                       {k.text}
                                       <button onClick={() => setNoteKeywords(noteKeywords.filter((_, idx) => idx !== i))} className="hover:opacity-50"><FaTimes size={10}/></button>
                                   </span>
                               ))}
                           </div>
                       </div>
                   )}
                 </div>
                 <div className="flex-1 overflow-y-auto">
                    {isEditingOrganized ? (
                      <textarea 
                        className="w-full h-full bg-black/20 p-2 rounded outline-none font-mono text-sm"
                        value={organizedNotes}
                        onChange={(e) => setOrganizedNotes(e.target.value)}
                      />
                    ) : (
                      <div className="prose prose-invert prose-sm">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{getHighlightedNotes()}</ReactMarkdown>
                      </div>
                    )}
                 </div>
               </Card>
             </div>
          )}

          {/* MAGIC VIEW */}
          {view === 'magics' && (
            <div className="max-w-4xl mx-auto space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button onClick={() => handleMagic('narrative')} className="group p-6 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 transition-all text-left">
                    <h3 className="text-xl font-bold text-purple-200 mb-2">Narrative Weaver</h3>
                    <p className="text-sm opacity-70">Turn your last entry into a beautiful first-person story.</p>
                 </button>
                 <button onClick={() => handleMagic('pattern')} className="group p-6 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 transition-all text-left">
                    <h3 className="text-xl font-bold text-blue-200 mb-2">Pattern Spotter</h3>
                    <p className="text-sm opacity-70">Find hidden correlations in your last 30 days.</p>
                 </button>
                 <button onClick={() => handleMagic('socratic')} className="group p-6 rounded-xl bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 transition-all text-left">
                    <h3 className="text-xl font-bold text-red-200 mb-2">Socratic Mirror</h3>
                    <p className="text-sm opacity-70">Challenge your commitments and find weak spots.</p>
                 </button>
               </div>

               <Card artStyle={currentStyle} className="min-h-[300px]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaMagic /> Magic Output
                  </h3>
                  {isCasting ? (
                    <div className="w-full h-40 flex items-center justify-center animate-pulse">
                      Summoning digital spirits...
                    </div>
                  ) : (
                    <div className="prose prose-xl prose-invert leading-relaxed">
                       <ReactMarkdown>{magicOutput}</ReactMarkdown>
                       {!magicOutput && <span className="opacity-30 italic">Select a magic spell above...</span>}
                    </div>
                  )}
               </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}