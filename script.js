import { getLoadingStructure, getMessageStructure } from "./structures.js";

const form = document.querySelector("form");
const input = document.querySelector("input");
const header = document.querySelector("header");
const chatContainer = document.querySelector(".chat-container");

let isGeneratingResponse = false;

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", submitForm);
});

const submitForm = (e) => {
    e.preventDefault();

    const message = input.value.trim();
    form.reset();

    if (!message || isGeneratingResponse) return;

    sendMessage(message);
    respondLoadingMessage();
};

const sendMessage = (message) => {
    isGeneratingResponse = true;
    header.classList.add("hidden");

    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = getMessageStructure(message, "./images/naruto.jpg", true);
    chatContainer.appendChild(div);
};

const respondLoadingMessage = () => {
    const div = document.createElement("div");
    div.className = "message";

    div.innerHTML = getLoadingStructure();
    chatContainer.appendChild(div);
};
