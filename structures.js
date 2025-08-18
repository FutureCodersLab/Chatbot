export const getMessageStructure = (message, src, hideActions) => {
    return `
        <div class="message-content">
            <img src="${src}" />
            <span>${message}</span>
        </div>
        <div class="message-actions ${hideActions ? "hidden" : ""}">
            <span class="material-symbols-rounded copy">
                content_copy
            </span>
            <span class="material-symbols-rounded volume-up">
                volume_up
            </span>
        </div>
    `;
};

export const getLoadingStructure = () => {
    return `
        <div class="message-content">
            <img src="./images/gemini.svg" />
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        </div>
    `;
};
