export enum Language {
    EN = 'EN',
    ZH = 'ZH'
}

export enum ThemeMode {
    LIGHT = 'light',
    DARK = 'dark'
}

export interface JournalEntry {
    id: string;
    date: string;
    timestamp: string;
    q1_ai_apps: string;
    q2_adventures: string;
    q3_habit: string;
    q4_simple_life: string;
    q5_delivery_120: string;
    q6_ahead_time: string;
    q7_good_will: string;
    q8_commitments: string;
    q9_achievement: string;
    magic_tags?: string[];
    mood_score?: number;
    mood_color?: string;
    mood_emoji?: string;
}

export interface ArtStyle {
    id: string;
    name: string;
    description: string;
    bgGradient: string; // Tailwind class
    cardBg: string; // Tailwind class
    fontFamily: string; // CSS font-family
    accentColor: string; // Hex for charts/highlights
    textColor: string;
    borderColor: string;
}

export interface AgentPersona {
    id: string;
    name: string;
    role: string;
    systemPrompt: string;
    model: string;
}

export type View = 'checkin' | 'dashboard' | 'chat' | 'notes' | 'magics' | 'history' | 'agents';