const PERIODS = [
    {
        id: "morning",
        startHour: 5,
        endHour: 11,
        greeting: "眠そうなママが『まだ開店してないのよ〜』と笑っているわ。",
        closing: "朝はゆっくり準備中。また夜に会いましょうね。",
        mamaName: "朝の美砂樹"
    },
    {
        id: "evening",
        startHour: 17,
        endHour: 22,
        greeting: "テンション高めのママが『待ってたわよ！』と迎えてくれるわ。",
        closing: "そろそろラストオーダー。夜はまだまだこれからよ。",
        mamaName: "夜の美砂樹"
    },
    {
        id: "late_night",
        startHour: 22,
        endHour: 28,
        greeting: "照明を落とした店内で『今日はゆっくりしていって』と囁くママ。",
        closing: "今日はもうおしまいよ。また明日も来てくれる？",
        mamaName: "深夜の美砂樹"
    }
] as const;

type Period = (typeof PERIODS)[number];

type Persona = {
    id: Period["id"] | "daytime";
    greeting: string;
    closing: string;
    mamaName: string;
};

const DEFAULT_PERSONA: Persona = {
    id: "daytime",
    greeting: "カウンターでママが『いらっしゃい、ゆっくりしていってね』と微笑んでいるわ。",
    closing: "またのお越しをお待ちしているわ。",
    mamaName: "美砂樹"
};

const to24Hour = (hour: number) => (hour >= 24 ? hour - 24 : hour);

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

    return {
        id: match.id,
        greeting: match.greeting,
        closing: match.closing,
        mamaName: match.mamaName
    };
};
