const chatBox = document.getElementById("chatBox");

function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = type;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (type === "bot") speak(text);
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    setTimeout(() => {
        addMessage(getBotReply(text), "bot");
    }, 600);
}

/* -------- AI LOGIC (RULE-BASED) -------- */

function getBotReply(text) {
    text = text.toLowerCase();

    if (text.includes("distemper")) {
        return "Canine distemper is a contagious viral disease affecting dogs. Vaccination is the best prevention.";
    }

    if (text.includes("symptom")) {
        return "Common symptoms include fever, coughing, nasal discharge, vomiting, seizures, and twitching.";
    }

    if (text.includes("vaccine")) {
        return "Core vaccines like DHPP (9-in-1) help prevent canine distemper. Puppies require multiple doses.";
    }

    if (text.includes("treatment")) {
        return "There is no cure for distemper. Treatment focuses on supportive care under veterinary supervision.";
    }

    if (text.includes("emergency")) {
        return "Seizures, continuous vomiting, or sudden paralysis require immediate veterinary attention.";
    }

    return "I can help with symptoms, vaccination, prevention, or care. Please ask clearly.";
}

/* -------- VOICE INPUT -------- */

function startVoice() {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Voice recognition not supported.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        document.getElementById("userInput").value =
            event.results[0][0].transcript;
    };

    recognition.start();
}

/* -------- VOICE OUTPUT -------- */

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}
