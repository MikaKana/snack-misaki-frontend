import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { matchStaticResponse } from "../src/constants/responses.ts";
import { getPersonaById, getTimePersona } from "../src/utils/timeGreetings.ts";

describe("matchStaticResponse", () => {
    const RealDate = Date;

    afterEach(() => {
        global.Date = RealDate;
    });

    it("returns a static response when the input matches a pattern", () => {
        const result = matchStaticResponse("おすすめのドリンクは？");

        assert.equal(
            result,
            "今日はフルーツたっぷりの美砂樹特製サングリアがおすすめよ。ゆっくり味わってね。"
        );
    });

    it("still matches when only a secondary pattern succeeds", () => {
        const result = matchStaticResponse("ドリンクだけください");

        assert.equal(
            result,
            "今日はフルーツたっぷりの美砂樹特製サングリアがおすすめよ。ゆっくり味わってね。"
        );
    });

    it("produces a time-aware greeting when keywords are detected", () => {
        class MockDate extends RealDate {
            constructor(...args: ConstructorParameters<typeof RealDate>) {
                if (args.length === 0) {
                    super("2024-01-01T18:00:00");
                } else {
                    super(...args);
                }
            }

            static override now() {
                return new RealDate("2024-01-01T18:00:00").getTime();
            }
        }

        global.Date = MockDate as unknown as DateConstructor;

        const expected = getTimePersona(new RealDate("2024-01-01T18:00:00")).greeting;
        const result = matchStaticResponse("こんばんは");

        assert.equal(result, expected);
    });

    it("prefers the greeting keyword over the current time when choosing a persona", () => {
        class MockDate extends RealDate {
            constructor(...args: ConstructorParameters<typeof RealDate>) {
                if (args.length === 0) {
                    super("2024-01-01T10:00:00");
                } else {
                    super(...args);
                }
            }

            static override now() {
                return new RealDate("2024-01-01T10:00:00").getTime();
            }
        }

        global.Date = MockDate as unknown as DateConstructor;

        const expected = getPersonaById("evening").greeting;
        const result = matchStaticResponse("こんばんは");

        assert.equal(result, expected);
    });


    it("returns null when there is no matching pattern", () => {
        const result = matchStaticResponse("これはテストメッセージです");

        assert.equal(result, null);
    });

    it("returns the first-time visitor response", () => {
        const result = matchStaticResponse("初めてお店に来ました");

        assert.equal(
            result,
            "まあまあ、初めてなの？緊張しなくて大丈夫。まずは好きなお酒を教えてちょうだい。"
        );
    });

    it("returns the regular customer response using the current persona", () => {
        const expected = `はいはい、${getTimePersona().mamaName}特製のいつものやつね。カウンターを温めておいたわよ。`;
        const result = matchStaticResponse("いつものお願い");

        assert.equal(result, expected);
    });

    it("uses the current persona closing message when closing time is mentioned", () => {
        const expected = getTimePersona().closing;
        const result = matchStaticResponse("もう閉店ですか？");

        assert.equal(result, expected);
    });

    it("returns a formatted time response when asked about the current time", () => {
        const result = matchStaticResponse("今何時ですか？");

        assert.match(result ?? "", /^ただいまの時刻は \d{2}:\d{2} よ。まだ時間はたっぷりあるわ。$/u);
    });

    it("responds politely to a thank-you message", () => {
        const result = matchStaticResponse("ありがとう！");

        assert.equal(result, "こちらこそ来てくれて嬉しいわ。またゆっくりしていってね。");
    });

    it("handles gratitude synonyms in the patterns", () => {
        const result = matchStaticResponse("感謝しています");

        assert.equal(result, "こちらこそ来てくれて嬉しいわ。またゆっくりしていってね。");
    });
});
