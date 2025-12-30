/* CHIP TOGGLE */
document.querySelectorAll(".chip").forEach(chip => {
    chip.onclick = () => chip.classList.toggle("active");
});

/* IMAGE UPLOAD */
const uploadBox = document.getElementById("uploadBox");
const imageInput = document.getElementById("imageInput");
const previewGrid = document.getElementById("previewGrid");

uploadBox.onclick = () => imageInput.click();
imageInput.onchange = () => {
    previewGrid.innerHTML = "";
    [...imageInput.files].slice(0,4).forEach(file => {
        const r = new FileReader();
        r.onload = e => {
            const img = document.createElement("img");
            img.src = e.target.result;
            previewGrid.appendChild(img);
        };
        r.readAsDataURL(file);
    });
};

/* ENERGY STATE */
function energyState(v){
    if(v >= 70) return "active";
    if(v >= 40) return "moderate";
    return "lethargic";
}



/* =========================
   ANALYZE FUNCTION (AI LOGIC)
========================= */
function analyze() {
    const selected = [...document.querySelectorAll(".chip.active")]
        .map(c => c.dataset.symptom);

    if (!selected.length) {
        document.getElementById("warning").classList.remove("hidden");
        return;
    }

    document.getElementById("warning").classList.add("hidden");
    document.getElementById("aiBox").classList.remove("hidden");
    document.getElementById("actionButtons").classList.remove("hidden");

    const energyVal = +document.getElementById("energy").value;
    const energy =
        energyVal >= 70 ? "active" :
        energyVal >= 40 ? "moderate" :
        "lethargic";

    const diseaseList = document.getElementById("diseaseList");
    const aiPoints = document.getElementById("aiPoints");
    const riskLabel = document.getElementById("riskLabel");

    diseaseList.innerHTML = "";
    aiPoints.innerHTML = "";

    let risk = "low";
    let stage = "Early";
    let systems = new Set();
    let rabiesFlag = false;

    const has = s => selected.includes(s);

    /* 🫁 RESPIRATORY */
    if (has("coughing") || has("sneezing") || has("nasal")) {
        diseaseList.innerHTML += `
            <li>🤧 Upper respiratory infection</li>
            <li>🐕 Kennel cough</li>`;
        systems.add("Respiratory system");
        risk = energy === "lethargic" ? "moderate" : "low";
    }

    /* 🌡️ FEVER */
    if (has("fever")) {
        diseaseList.innerHTML += `
            <li>🌡️ Systemic infection or inflammation</li>`;
        systems.add("Immune system");
        if (energy !== "active") risk = "moderate";
    }

    /* 🍽️ GASTRO */
    if (has("vomiting") || has("diarrhea")) {
        diseaseList.innerHTML += `
            <li>🤢 Gastrointestinal infection</li>
            <li>🦠 Parvovirus (especially in puppies)</li>`;
        systems.add("Digestive system");
        risk = energy === "lethargic" ? "high" : "moderate";
    }

    /* ⚡ TWITCHING */
    if (has("twitching")) {
        diseaseList.innerHTML += `
            <li>⚡ Muscle spasm or mild neurological irritation</li>
            <li>🧪 Electrolyte imbalance</li>`;
        systems.add("Nervous system");
        if (energy === "lethargic") risk = "moderate";
    }

    /* 🔄 CIRCLING */
    if (has("circling")) {
        diseaseList.innerHTML += `
            <li>🧠 Vestibular disease</li>
            <li>👂 Inner ear infection</li>
            <li>🧠 Brain inflammation (rare)</li>`;
        systems.add("Nervous system");
        risk = energy === "active" ? "moderate" : "high";
    }

    /* 🚨 SEIZURES */
    if (has("seizures")) {
        diseaseList.innerHTML += `
            <li>🦠 Canine distemper (neurological stage)</li>
            <li>⚡ Epilepsy (idiopathic or genetic)</li>
            <li>☠️ Toxin or poison exposure</li>
            <li>🧪 Metabolic imbalance (glucose, calcium, liver)</li>`;
        systems.add("Nervous system");
        risk = "high";
        stage = "Progressive";
    }

    /* 🐾 HARD PAD */
    if (has("footpads")) {
        diseaseList.innerHTML += `
            <li>🐾 Hard pad disease (associated with distemper)</li>`;
        systems.add("Skin and paws");
        risk = "high";
        stage = "Advanced";
    }

    /* ☣️ RABIES (RARE, CONDITIONAL) */
    if (
        has("seizures") &&
        (has("circling") || has("fever")) &&
        energy === "lethargic"
    ) {
        diseaseList.innerHTML += `
            <li>☣️ Rabies (cannot be ruled out – rare but serious)</li>`;
        rabiesFlag = true;
        risk = "critical";
        stage = "Severe neurological";
    }

    /* 🏷️ RISK LABEL */
    riskLabel.className = "risk " + risk;
    riskLabel.textContent =
        risk === "critical" ? "🚨 Emergency – Immediate Veterinary Attention Required" :
        risk === "high" ? "⚠️ High Risk – Consult Vet Urgently" :
        risk === "moderate" ? "🟡 Moderate Risk – Vet Advice Recommended" :
        "🟢 Low Risk – Routine Monitoring";

    /* 🧠 AI GUIDANCE */
    aiPoints.innerHTML = `
        <li>📌 Predicted stage: ${stage}</li>
        <li>🧬 Body systems involved: ${[...systems].join(", ")}</li>
        <li>🧪 Diagnostic tests recommended for confirmation</li>
        ${
            rabiesFlag
                ? "<li>☣️ Avoid contact and consult a veterinarian immediately</li>"
                : "<li>ℹ️ Rabies is unlikely based on current symptoms</li>"
        }
    `;

    document.getElementById("aiBox").scrollIntoView({ behavior: "smooth" });
}

/* =========================
   PDF REPORT (NO EMOJIS)
========================= */
function stripEmojis(text) {
    return text.replace(/[\u{1F300}-\u{1FAFF}]/gu, "");
}

function generateReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // Font & layout
    doc.setFont("Times", "Normal");

    const left = 20;
    let y = 25;
    const line = 8;

    // Helper to clean text
    const clean = txt =>
        txt
            .replace(/[\u{1F300}-\u{1FAFF}]/gu, "") // emojis
            .replace(/[^\x00-\x7F]/g, "")         // bad unicode
            .trim();

    /* ======================
       TITLE
    ====================== */
    doc.setFontSize(16);
    doc.text("Canine Health Symptom Report", left, y);
    y += line * 2;

    /* ======================
       BASIC INFO
    ====================== */
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleString()}`, left, y);
    y += line;

    doc.text(
        `Energy Level: ${document.getElementById("energy").value} / 100`,
        left,
        y
    );
    y += line;

    doc.text(
        `Risk Assessment: ${clean(document.getElementById("riskLabel").innerText)}`,
        left,
        y
    );
    y += line * 2;

    /* ======================
       SYMPTOMS
    ====================== */
    doc.setFontSize(12);
    doc.text("Reported Symptoms:", left, y);
    y += line;

    doc.setFontSize(11);
    const symptoms = clean(
        [...document.querySelectorAll(".chip.active")]
            .map(c => c.innerText)
            .join(", ")
    );

    doc.text(symptoms || "None reported", left + 4, y, {
        maxWidth: 170
    });
    y += line * 2;

    /* ======================
       CONDITIONS
    ====================== */
    doc.setFontSize(12);
    doc.text("Possible Conditions:", left, y);
    y += line;

    doc.setFontSize(11);
    const conditions = clean(
        [...document.querySelectorAll("#diseaseList li")]
            .map(li => "- " + li.innerText)
            .join("\n")
    );

    doc.text(conditions, left + 4, y, {
        maxWidth: 170
    });
    y += line * (conditions.split("\n").length + 1);

    /* ======================
       AI GUIDANCE
    ====================== */
    doc.setFontSize(12);
    doc.text("AI Guidance:", left, y);
    y += line;

    doc.setFontSize(11);
    const guidance = clean(
        [...document.querySelectorAll("#aiPoints li")]
            .map(li => "- " + li.innerText)
            .join("\n")
    );

    doc.text(guidance, left + 4, y, {
        maxWidth: 170
    });
    y += line * (guidance.split("\n").length + 2);

    /* ======================
       DISCLAIMER
    ====================== */
    doc.setFontSize(10);
    doc.text(
        "Disclaimer: This report is for educational purposes only and does not replace professional veterinary diagnosis.",
        left,
        y,
        { maxWidth: 170 }
    );

    doc.save("Pet_Health_Report.pdf");
}
