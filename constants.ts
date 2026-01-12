import { ArtStyle, AgentPersona, Language } from './types';

export const ART_STYLES: ArtStyle[] = [
    {
        id: 'vangogh',
        name: 'Starry Night (Van Gogh)',
        description: 'Expressive swirls of blue and yellow.',
        bgGradient: 'bg-gradient-to-br from-blue-900 via-blue-700 to-yellow-600',
        cardBg: 'bg-blue-900/40 backdrop-blur-xl',
        fontFamily: '"Playfair Display", serif',
        accentColor: '#fbbf24',
        textColor: 'text-yellow-50',
        borderColor: 'border-yellow-400/30'
    },
    {
        id: 'monet',
        name: 'Water Lilies (Monet)',
        description: 'Soft, impressionist greens and purples.',
        bgGradient: 'bg-gradient-to-br from-teal-700 via-green-600 to-purple-400',
        cardBg: 'bg-white/20 backdrop-blur-md',
        fontFamily: '"Cinzel", serif',
        accentColor: '#d8b4fe',
        textColor: 'text-white',
        borderColor: 'border-white/30'
    },
    {
        id: 'dali',
        name: 'Persistence (Dalí)',
        description: 'Surreal melting landscapes.',
        bgGradient: 'bg-gradient-to-tr from-orange-900 via-amber-700 to-blue-300',
        cardBg: 'bg-amber-950/40 backdrop-blur-lg',
        fontFamily: '"Space Mono", monospace',
        accentColor: '#93c5fd',
        textColor: 'text-amber-50',
        borderColor: 'border-blue-400/40'
    },
    {
        id: 'mondrian',
        name: 'Composition (Mondrian)',
        description: 'Strict grid with primary colors.',
        bgGradient: 'bg-white',
        cardBg: 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        fontFamily: '"Inter", sans-serif',
        accentColor: '#ef4444',
        textColor: 'text-black',
        borderColor: 'border-black'
    },
    {
        id: 'hokusai',
        name: 'Great Wave (Hokusai)',
        description: 'Deep prussian blue and white foam.',
        bgGradient: 'bg-gradient-to-b from-blue-900 via-indigo-800 to-slate-200',
        cardBg: 'bg-slate-100/90 backdrop-blur-sm',
        fontFamily: '"Cinzel", serif',
        accentColor: '#1e3a8a',
        textColor: 'text-slate-900',
        borderColor: 'border-blue-900/50'
    },
    {
        id: 'warhol',
        name: 'Pop Art (Warhol)',
        description: 'Vibrant, contrasting neon colors.',
        bgGradient: 'bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500',
        cardBg: 'bg-black/80 backdrop-blur-none',
        fontFamily: '"Inter", sans-serif',
        accentColor: '#f0f',
        textColor: 'text-white',
        borderColor: 'border-white'
    },
    {
        id: 'da_vinci',
        name: 'Codex (Da Vinci)',
        description: 'Sepia tones, sketch-like quality.',
        bgGradient: 'bg-[#e3dcd2]', // Parchment color
        cardBg: 'bg-[#d4c5b0]/60 backdrop-blur-sm shadow-inner',
        fontFamily: '"Playfair Display", serif',
        accentColor: '#78350f',
        textColor: 'text-amber-950',
        borderColor: 'border-amber-900/40'
    },
    {
        id: 'picasso',
        name: 'Cubism (Picasso)',
        description: 'Fragmented shapes and earth tones.',
        bgGradient: 'bg-gradient-to-br from-orange-200 via-stone-400 to-slate-600',
        cardBg: 'bg-stone-100/80 backdrop-blur-md clip-path-polygon',
        fontFamily: '"Space Mono", monospace',
        accentColor: '#ea580c',
        textColor: 'text-slate-900',
        borderColor: 'border-stone-600'
    },
    {
        id: 'kandinsky',
        name: 'Composition VIII (Kandinsky)',
        description: 'Geometric abstraction.',
        bgGradient: 'bg-gradient-to-bl from-rose-300 via-violet-300 to-sky-300',
        cardBg: 'bg-white/40 backdrop-blur-xl',
        fontFamily: '"Inter", sans-serif',
        accentColor: '#be185d',
        textColor: 'text-slate-900',
        borderColor: 'border-rose-500/50'
    },
    {
        id: 'rembrandt',
        name: 'Night Watch (Rembrandt)',
        description: 'Chiaroscuro, deep shadows and light.',
        bgGradient: 'bg-gradient-to-r from-black via-stone-900 to-amber-900',
        cardBg: 'bg-black/60 backdrop-blur-sm border border-amber-500/20',
        fontFamily: '"Playfair Display", serif',
        accentColor: '#f59e0b',
        textColor: 'text-amber-50',
        borderColor: 'border-amber-600/30'
    },
    {
        id: 'okeeffe',
        name: 'Flowers (O\'Keeffe)',
        description: 'Flowing lines, magnified nature.',
        bgGradient: 'bg-gradient-to-t from-pink-200 via-red-200 to-orange-100',
        cardBg: 'bg-white/60 backdrop-blur-md rounded-3xl',
        fontFamily: '"Cinzel", serif',
        accentColor: '#db2777',
        textColor: 'text-rose-950',
        borderColor: 'border-pink-300'
    },
    {
        id: 'basquiat',
        name: 'Neo-Expressionism (Basquiat)',
        description: 'Raw, graffiti-like, chaotic.',
        bgGradient: 'bg-slate-900',
        cardBg: 'bg-slate-800 border-2 border-dashed border-yellow-400',
        fontFamily: '"Space Mono", monospace',
        accentColor: '#facc15',
        textColor: 'text-white',
        borderColor: 'border-yellow-400'
    },
    {
        id: 'magritte',
        name: 'Surrealism (Magritte)',
        description: 'Blue skies, clouds, bowler hats.',
        bgGradient: 'bg-gradient-to-b from-sky-400 via-sky-300 to-green-800',
        cardBg: 'bg-white/80 backdrop-blur-lg shadow-2xl',
        fontFamily: '"Inter", sans-serif',
        accentColor: '#166534',
        textColor: 'text-slate-800',
        borderColor: 'border-sky-500'
    },
    {
        id: 'klimt',
        name: 'The Kiss (Klimt)',
        description: 'Gold leaf patterns and romance.',
        bgGradient: 'bg-gradient-to-br from-yellow-700 via-amber-500 to-yellow-200',
        cardBg: 'bg-black/80 border border-yellow-400',
        fontFamily: '"Cinzel", serif',
        accentColor: '#fde047',
        textColor: 'text-yellow-100',
        borderColor: 'border-yellow-500'
    },
    {
        id: 'hopper',
        name: 'Nighthawks (Hopper)',
        description: 'Urban solitude, artificial light.',
        bgGradient: 'bg-gradient-to-r from-emerald-900 to-yellow-900',
        cardBg: 'bg-emerald-950/80 backdrop-blur-md',
        fontFamily: '"Inter", sans-serif',
        accentColor: '#10b981',
        textColor: 'text-emerald-50',
        borderColor: 'border-emerald-700'
    },
    {
        id: 'matisse',
        name: 'The Dance (Matisse)',
        description: 'Fauvism, bold flat colors.',
        bgGradient: 'bg-blue-600',
        cardBg: 'bg-orange-500/90 text-white',
        fontFamily: '"Playfair Display", serif',
        accentColor: '#1e3a8a',
        textColor: 'text-white',
        borderColor: 'border-white'
    },
    {
        id: 'kahlo',
        name: 'Self Portrait (Kahlo)',
        description: 'Verdant foliage and symbolism.',
        bgGradient: 'bg-gradient-to-br from-green-800 via-emerald-600 to-rose-700',
        cardBg: 'bg-stone-900/60 backdrop-blur-xl',
        fontFamily: '"Cinzel", serif',
        accentColor: '#fb7185',
        textColor: 'text-stone-100',
        borderColor: 'border-green-500'
    },
    {
        id: 'pollock',
        name: 'Drip (Pollock)',
        description: 'Action painting, chaotic splatters.',
        bgGradient: 'bg-stone-200',
        cardBg: 'bg-white/90 shadow-xl border border-stone-400',
        fontFamily: '"Space Mono", monospace',
        accentColor: '#1c1917',
        textColor: 'text-black',
        borderColor: 'border-stone-800'
    },
    {
        id: 'munch',
        name: 'The Scream (Munch)',
        description: 'Expressionist anxiety, orange sky.',
        bgGradient: 'bg-gradient-to-b from-orange-600 via-red-700 to-blue-900',
        cardBg: 'bg-black/50 backdrop-blur-lg',
        fontFamily: '"Inter", sans-serif',
        accentColor: '#fdba74',
        textColor: 'text-orange-50',
        borderColor: 'border-orange-500/40'
    },
    {
        id: 'renoir',
        name: 'Luncheon (Renoir)',
        description: 'Dappled light and social joy.',
        bgGradient: 'bg-gradient-to-tr from-green-300 via-yellow-100 to-pink-200',
        cardBg: 'bg-white/50 backdrop-blur-xl',
        fontFamily: '"Playfair Display", serif',
        accentColor: '#15803d',
        textColor: 'text-slate-800',
        borderColor: 'border-white'
    }
];

export const AGENTS: AgentPersona[] = [
    {
        id: 'analyst',
        name: 'Metric Master',
        role: 'Data Analyst',
        model: 'gemini-2.5-flash',
        systemPrompt: "You are a strict data analyst. Analyze the user's daily inputs. Focus on frequency, completion rates, and categorical grouping. Do not offer emotional support; offer raw statistics."
    },
    {
        id: 'coach',
        name: 'Growth Partner',
        role: 'Life Coach',
        model: 'gemini-3-flash-preview',
        systemPrompt: "You are an empathetic life coach. Look at the user's 'Good Will' and 'Habits'. Encourage them based on their 'Achievements'. If they miss 'Commitments', ask gentle probing questions why."
    },
    {
        id: 'strategist',
        name: 'The Architect',
        role: 'Strategist',
        model: 'gemini-3-pro-preview',
        systemPrompt: "You are a strategic planner. Correlate 'AI Applications' explored with '120% Delivery'. Suggest how the user can leverage their new tech knowledge to improve efficiency."
    }
];

export const LABELS = {
    [Language.EN]: {
        title: "Agentic Life-OS",
        checkin: "Daily Check-in",
        dashboard: "Dashboard",
        history: "Journal History",
        chat: "Agent Chat",
        agents: "Agent Studio",
        notes: "Note Keeper",
        magics: "AI Magics",
        save: "Save Entry",
        export: "Export Data",
        import: "Import Data",
        jackpot: "Style Jackpot!",
        questions: [
            "1. AI Applications Used/Explored (List 3)",
            "2. New Adventures (List 2)",
            "3. New Habit Formed",
            "4. Simple Life Practices (List 3)",
            "5. 120% Delivery Tasks (List 2)",
            "6. Ahead of Time Tasks",
            "7. Good Will / Kindness Events (List 3)",
            "8. New Commitments",
            "9. Significant Achievement"
        ]
    },
    [Language.ZH]: {
        title: "代理人生系统",
        checkin: "每日签到",
        dashboard: "仪表盘",
        history: "日记历史",
        chat: "代理对话",
        agents: "代理工坊",
        notes: "笔记助手",
        magics: "AI 魔法",
        save: "保存记录",
        export: "导出数据",
        import: "导入数据",
        jackpot: "风格抽奖!",
        questions: [
            "1. 使用/探索的 AI 应用 (列出 3 个)",
            "2. 新的冒险/体验 (列出 2 个)",
            "3. 正在养成的新习惯",
            "4. 极简生活实践 (列出 3 个)",
            "5. 120% 交付的任务 (列出 2 个)",
            "6. 提前完成的任务",
            "7. 善意/助人事件 (列出 3 个)",
            "8. 新的承诺",
            "9. 今日重大成就"
        ]
    }
};