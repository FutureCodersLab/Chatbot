import { copyIcon, volumeUpIcon } from "./icons.js";

export const getMessageStructure = (message, src, withActions) => {
    return `
        <div class="message-content">
            <img src="${src}" />
            <span>${message}</span>
        </div>
        ${
            withActions
                ? `
                <div class="message-actions hide">
                    ${copyIcon}
                    ${volumeUpIcon}
                </div>
            `
                : ""
        }
    `;
};

export const loadingStructure = `
    <div class="message-content">
        <img
            class="avatar"
            src="./images/gemini.svg"
        />
        <div class="loading-indicator">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
        </div>
    </div>
`;
