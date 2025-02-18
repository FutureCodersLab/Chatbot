import { getMessageStructure, loadingStructure } from "./structures.js";
let isGeneratingResponse = false;

const form = document.querySelector("form");
const input = document.querySelector("input");
const header = document.querySelector("header");
const chatContainer = document.querySelector(".chat-container");

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (!message || isGeneratingResponse) return;

        sendMessage(message);
        setTimeout(respondLoadingMessage, 500);
    });
});

const sendMessage = (message) => {
    isGeneratingResponse = true;

    header.classList.add("hide");

    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = getMessageStructure(message, "./images/naruto.jpg");
    chatContainer.appendChild(div);

    input.value = "";
};

const respondLoadingMessage = () => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = loadingStructure;
    chatContainer.appendChild(div);
};
