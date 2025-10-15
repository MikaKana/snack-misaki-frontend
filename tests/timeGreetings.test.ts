import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPersonaById, getTimePersona, resolveGreetingPersona } from "../src/utils/timeGreetings.ts";

describe("getPersonaById", () => {
    it("returns the default persona when the id is unknown", () => {
        const persona = getPersonaById("unknown" as unknown as never);

        assert.equal(persona.id, "daytime");
        assert.equal(persona.mamaName, "美砂樹");
    });

    it("returns a known persona when the id exists", () => {
        const persona = getPersonaById("evening");

        assert.equal(persona.id, "evening");
        assert.match(persona.greeting, /待ってたわよ/u);
    });
});

describe("getTimePersona", () => {
    it("returns the morning persona during the morning period", () => {
        const persona = getTimePersona(new Date(2024, 0, 1, 6, 30));

        assert.equal(persona.id, "morning");
        assert.equal(persona.greeting, "まだ開店してないの。");
    });

    it("returns the late-night persona for hours past midnight", () => {
        const persona = getTimePersona(new Date(2024, 0, 1, 2, 0));

        assert.equal(persona.id, "late_night");
        assert.match(persona.systemPrompt, /照明を落とした店内/u);
    });

    it("falls back to the default persona during the daytime lull", () => {
        const persona = getTimePersona(new Date(2024, 0, 1, 13, 0));

        assert.equal(persona.id, "daytime");
        assert.equal(persona.mamaName, "美砂樹");
    });
});

describe("resolveGreetingPersona", () => {
    it("prefers the morning keyword even if the time is afternoon", () => {
        const afternoon = new Date(2024, 0, 1, 15, 0);
        const persona = resolveGreetingPersona("おはよう！", afternoon);

        assert.equal(persona.id, "morning");
    });

    it("detects a daytime greeting regardless of the provided time", () => {
        const morning = new Date(2024, 0, 1, 8, 0);
        const persona = resolveGreetingPersona("こんにちは", morning);

        assert.equal(persona.id, "daytime");
    });

    it("falls back to the current time persona when no keyword matches", () => {
        const evening = new Date(2024, 0, 1, 19, 0);
        const fallback = resolveGreetingPersona("今日のおすすめは？", evening);

        assert.equal(fallback.id, getTimePersona(evening).id);
    });
});
