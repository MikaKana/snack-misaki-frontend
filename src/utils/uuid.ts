const BYTE_TO_HEX = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));

const generateFromRandomValues = (randomValues: ArrayLike<number>) => {
    let index = 0;
    return (
        `${BYTE_TO_HEX[randomValues[index++]]}${BYTE_TO_HEX[randomValues[index++]]}` +
        `${BYTE_TO_HEX[randomValues[index++]]}${BYTE_TO_HEX[randomValues[index++]]}-` +
        `${BYTE_TO_HEX[randomValues[index++]]}${BYTE_TO_HEX[randomValues[index++]]}-` +
        `${BYTE_TO_HEX[randomValues[index++]]}${BYTE_TO_HEX[randomValues[index++]]}-` +
        `${BYTE_TO_HEX[randomValues[index++]]}${BYTE_TO_HEX[randomValues[index++]]}-` +
        `${BYTE_TO_HEX[randomValues[index++]]}${BYTE_TO_HEX[randomValues[index++]]}` +
        `${BYTE_TO_HEX[randomValues[index++]]}${BYTE_TO_HEX[randomValues[index++]]}` +
        `${BYTE_TO_HEX[randomValues[index++]]}${BYTE_TO_HEX[randomValues[index++]]}`
    );
};

export const generateUUID = (): string => {
    const cryptoObj = globalThis.crypto;

    if (cryptoObj?.randomUUID) {
        return cryptoObj.randomUUID();
    }

    const randomValues = cryptoObj?.getRandomValues
        ? cryptoObj.getRandomValues(new Uint8Array(16))
        : Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));

    randomValues[6] = (randomValues[6] & 0x0f) | 0x40; // Version 4
    randomValues[8] = (randomValues[8] & 0x3f) | 0x80; // Variant 10xxxxxx

    return generateFromRandomValues(randomValues);
};
