import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { matchStaticResponse } from "../src/constants/responses.ts";
import { getTimePersona } from "../src/utils/timeGreetings.ts";

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

    it("returns null when there is no matching pattern", () => {
        const result = matchStaticResponse("これはテストメッセージです");

        assert.equal(result, null);
    });
});
