import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const TS_EXTENSIONS = [".ts", ".tsx"];

export async function resolve(specifier, context, defaultResolve) {
    if (specifier.startsWith("node:") || specifier.startsWith("data:")) {
        return defaultResolve(specifier, context, defaultResolve);
    }

    const extension = path.extname(specifier);
    if (TS_EXTENSIONS.includes(extension)) {
        return defaultResolve(specifier, context, defaultResolve);
    }

    if (specifier.startsWith("./") || specifier.startsWith("../")) {
        for (const ext of TS_EXTENSIONS) {
            try {
                return await defaultResolve(specifier + ext, context, defaultResolve);
            } catch (error) {
                if (!error || error.code !== "ERR_MODULE_NOT_FOUND") {
                    throw error;
                }
            }
        }
    }

    return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
    if (TS_EXTENSIONS.some((ext) => url.endsWith(ext))) {
        const source = await readFile(fileURLToPath(url), "utf8");

        const { outputText } = ts.transpileModule(source, {
            fileName: fileURLToPath(url),
            compilerOptions: {
                module: ts.ModuleKind.ESNext,
                moduleResolution: ts.ModuleResolutionKind.Node10,
                target: ts.ScriptTarget.ES2020,
                jsx: ts.JsxEmit.ReactJSX,
                esModuleInterop: true,
                resolveJsonModule: true,
                inlineSourceMap: true,
                inlineSources: true
            }
        });

        return {
            format: "module",
            source: outputText,
            shortCircuit: true
        };
    }

    return defaultLoad(url, context, defaultLoad);
}
