import { codeToHtml } from "https://esm.sh/shiki@4";


const THEME = "github-dark";


async function highlightCodeBlocks() {

    const codeBlocks = document.querySelectorAll(
        'code[class*="language-"]'
    );

    for (const codeElement of codeBlocks) {

        const languageClass = Array.from(
            codeElement.classList
        ).find(className =>
            className.startsWith("language-")
        );

        if (!languageClass) {
            continue;
        }


        const language = languageClass.substring(
            "language-".length
        );


        const sourceCode = codeElement.textContent;


        try {

            const highlightedHTML = await codeToHtml(
                sourceCode,
                {
                    lang: language,
                    theme: THEME
                }
            );


            const temporaryContainer =
                document.createElement("div");

            temporaryContainer.innerHTML =
                highlightedHTML;


            const highlightedPre =
                temporaryContainer.firstElementChild;


            if (!highlightedPre) {
                continue;
            }


            const highlightedCode =
                highlightedPre.querySelector("code");


            if (!highlightedCode) {
                continue;
            }


            /*
             * Preserve your existing code element.
             */
            codeElement.replaceWith(highlightedCode);

        } catch (error) {

            console.error(
                `Shiki failed to highlight ${language}:`,
                error
            );

        }
    }
}


highlightCodeBlocks();