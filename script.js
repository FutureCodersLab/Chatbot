import { CONFIG } from "./config.js";
import { getMessageStructure, loadingStructure } from "./structures.js";

const API_KEY = CONFIG.API_KEY.join("");
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

let isGeneratingResponse = false;

const form = document.querySelector("form");
const input = document.querySelector("input");
const header = document.querySelector("header");
const chatContainer = document.querySelector(".chat-container");
const scrollTarget = document.querySelector("#scroll-target");
const modeButton = document.querySelector("#mode");
const container = document.querySelector("#container");
const deleteButton = document.querySelector("#delete");

document.addEventListener("DOMContentLoaded", () => {
    loadDataFromLocalStorage();
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = input.value.trim();

        if (!message || isGeneratingResponse) return;

        sendMessage(message);
        setTimeout(respondLoadingMessage, 500);
        const chatbotResponse = await generateResponse(message);
        typeChatbotResponse(chatbotResponse);
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

    autoScroll();
};

const respondLoadingMessage = () => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = loadingStructure;

    chatContainer.appendChild(div);

    autoScroll();
};

const generateResponse = async (message) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: message }],
                    },
                ],
            }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        return data?.candidates[0].content.parts[0].text.replace(
            /\*\*(.*?)\*\*/g,
            "$1"
        );
    } catch (error) {
        alert(error.message);
    } finally {
        isGeneratingResponse = false;
        chatContainer.removeChild(chatContainer.lastChild);
    }
};

const typeChatbotResponse = (chatbotResponse) => {
    const words = chatbotResponse.split(" ");

    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = getMessageStructure("", "./images/gemini.svg");
    chatContainer.appendChild(div);

    const messageActions = div.querySelector(".message-actions");

    const copyButton = div.querySelector(".copy");
    copyButton.addEventListener("click", (e) =>
        copyMessage(chatbotResponse, e.target)
    );

    const speakerButton = div.querySelector(".volume-up");
    speakerButton.addEventListener("click", (e) =>
        readMessage(chatbotResponse, e.target)
    );

    const textElement = div.querySelector("span");

    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        if (currentWordIndex === 0) {
            textElement.innerText += words[currentWordIndex];
        } else {
            textElement.innerText += " " + words[currentWordIndex];
        }
        currentWordIndex++;
        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isGeneratingResponse = false;
            messageActions.classList.remove("hide");
            localStorage.setItem("chat-history", chatContainer.innerHTML);
        }
        autoScroll();
    }, 75);
};

modeButton.addEventListener("click", () => {
    const isLightMode = container.classList.toggle("light-mode");

    container.classList.toggle("dark-mode", !isLightMode);
    mode.innerText = isLightMode ? "dark_mode" : "light_mode";

    localStorage.setItem("mode", isLightMode ? "light-mode" : "dark-mode");
});

deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all your chats?")) {
        localStorage.removeItem("chat-history");
        loadDataFromLocalStorage();
    }
});

const loadDataFromLocalStorage = () => {
    const savedChatHistory = localStorage.getItem("chat-history");
    const savedMode = localStorage.getItem("mode") || "light-mode";

    container.className = "";
    container.classList.add(savedMode);
    mode.innerText = savedMode === "light-mode" ? "dark_mode" : "light_mode";

    chatContainer.innerHTML = savedChatHistory || "";
    header.classList.toggle("hide", savedChatHistory);

    autoScroll();
};

const copyMessage = (message, target) => {
    navigator.clipboard.writeText(message);
    target.innerText = "done";
    setTimeout(() => (target.innerText = "content_copy"), 1500);
};

const readMessage = (message, target) => {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        target.innerText = "volume_up";
    } else {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.onend = () => (target.innerText = "volume_up");
        window.speechSynthesis.speak(utterance);
        target.innerText = "volume_off";
    }
};

const autoScroll = () => scrollTarget.scrollIntoView({ behavior: "smooth" });
