const PERIODS = [
    {
        id: "morning",
        startHour: 5,
        endHour: 11,
        greeting: "まだ開店してないの。",
        closing: "朝はゆっくり準備中。また夜に会いましょうね。",
        mamaName: "朝の美砂樹",
        systemPrompt: "ママはまだ眠そうみたい。温かいご注文や世間話でそっと起こしてあげてね。"
    },
    {
        id: "evening",
        startHour: 17,
        endHour: 22,
        greeting: "待ってたわよ、今日はゆっくりしていってね。",
        closing: "夜はまだまだこれからよ。",
        mamaName: "夜の美砂樹",
        systemPrompt: "ママはご機嫌よ。ご注文や世間話を気軽に話しかけて盛り上がってね。"
    },
    {
        id: "late_night",
        startHour: 22,
        endHour: 28,
        greeting: "ゆっくりしていって",
        closing: "また明日も来てくれる？",
        mamaName: "深夜の美砂樹",
        systemPrompt: "照明を落とした店内はしっとりした雰囲気。静かにご注文や世間話を楽しんでみてね。"
    }
] as const;

type Period = (typeof PERIODS)[number];

export type Persona = {
    id: Period["id"] | "daytime";
    greeting: string;
    closing: string;
    mamaName: string;
    systemPrompt: string;
};

const DEFAULT_PERSONA: Persona = {
    id: "daytime",
    greeting: "いらっしゃい、ゆっくりしていってね",
    closing: "またのお越しをお待ちしているわ。",
    mamaName: "美砂樹",
    systemPrompt: "ご注文や世間話など、好きなことを気軽に入力してくださいね。"
};

const PERSONA_BY_ID: Record<Persona["id"], Persona> = {
    daytime: DEFAULT_PERSONA,
    morning: {
        id: "morning",
        greeting: PERIODS[0].greeting,
        closing: PERIODS[0].closing,
        mamaName: PERIODS[0].mamaName,
        systemPrompt: PERIODS[0].systemPrompt
    },
    evening: {
        id: "evening",
        greeting: PERIODS[1].greeting,
        closing: PERIODS[1].closing,
        mamaName: PERIODS[1].mamaName,
        systemPrompt: PERIODS[1].systemPrompt
    },
    late_night: {
        id: "late_night",
        greeting: PERIODS[2].greeting,
        closing: PERIODS[2].closing,
        mamaName: PERIODS[2].mamaName,
        systemPrompt: PERIODS[2].systemPrompt
    }
};

const to24Hour = (hour: number) => (hour >= 24 ? hour - 24 : hour);

export const getPersonaById = (id: Persona["id"]): Persona =>
    PERSONA_BY_ID[id] ?? DEFAULT_PERSONA;

export const getTimePersona = (date = new Date()): Persona => {
    const currentHour = date.getHours();

    const match = PERIODS.find((period) => {
        const start = period.startHour;
        const end = period.endHour;
        if (end >= 24) {
            return currentHour >= start || currentHour < to24Hour(end);
        }
        return currentHour >= start && currentHour < end;
    });

    if (!match) {
        return DEFAULT_PERSONA;
    }

    return PERSONA_BY_ID[match.id];
};

const GREETING_KEYWORDS: Array<{ pattern: RegExp; personaId: Persona["id"] }> = [
    { pattern: /おはよう/u, personaId: "morning" },
    { pattern: /こんばんは/u, personaId: "evening" },
    { pattern: /こんにち[はわ]/u, personaId: "daytime" }
];

export const resolveGreetingPersona = (input: string, date = new Date()): Persona => {
    for (const { pattern, personaId } of GREETING_KEYWORDS) {
        if (pattern.test(input)) {
            return getPersonaById(personaId);
        }
    }

    return getTimePersona(date);
};
