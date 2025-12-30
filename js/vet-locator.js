/* =====================================
   GOOGLE MAPS – SAFE VET LOCATOR
===================================== */

function openNearbyVets(type) {

    // Disable all buttons to prevent spam clicks
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(btn => btn.disabled = true);

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        buttons.forEach(btn => btn.disabled = false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;

            const query =
                type === "emergency"
                    ? "emergency veterinary hospital open now"
                    : "veterinary clinic open now";

            const mapURL =
                `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${latitude},${longitude},14z`;

            window.open(mapURL, "_blank");

            // Re-enable buttons
            buttons.forEach(btn => btn.disabled = false);
        },
        () => {
            alert("Please allow location access to find nearby vets.");
            buttons.forEach(btn => btn.disabled = false);
        },
        {
            enableHighAccuracy: true,
            timeout: 7000,
            maximumAge: 0
        }
    );
}


/* ==========================================================
   SECTION 1
   BREED → DISEASE + VACCINE LOGIC
   ----------------------------------------------------------
   - USED DIRECTLY BY UI
   - EACH BREED IS EXPLICIT
========================================================== */

const breedData = {

    /* ===== CORE BREEDS ===== */

    labrador: {
        risk: "Medium",
        diseases: [
            "Obesity",
            "Hip Dysplasia",
            "Ear Infections",
            "Diabetes (older age)"
        ],
        vaccines: [
            "Rabies",
            "DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)",
            "Leptospirosis"
        ],
        exercise: "60–90 minutes daily",
        emergency: "Sudden collapse, severe limping, or seizures require immediate vet care."
    },

    german: {
        risk: "High",
        diseases: [
            "Hip Dysplasia",
            "Degenerative Myelopathy",
            "Arthritis",
            "Digestive Disorders"
        ],
        vaccines: [
            "Rabies",
            "DHPP",
            "Leptospirosis"
        ],
        exercise: "90+ minutes daily",
        emergency: "Weakness or paralysis of hind legs is an emergency."
    },

    pug: {
        risk: "High",
        diseases: [
            "Breathing Disorders (BOAS)",
            "Heat Stroke",
            "Eye Ulcers",
            "Skin Fold Infections"
        ],
        vaccines: [
            "Rabies",
            "DHPP",
            "Kennel Cough"
        ],
        exercise: "Light walks only",
        emergency: "Breathing difficulty or overheating is life-threatening."
    },

    golden: {
        risk: "Medium–High",
        diseases: [
            "Cancer",
            "Heart Disease",
            "Skin Allergies",
            "Hip Dysplasia"
        ],
        vaccines: [
            "Rabies",
            "DHPP",
            "Leptospirosis"
        ],
        exercise: "60–90 minutes daily",
        emergency: "Persistent cough, collapse, or extreme fatigue needs vet check."
    },

    indie: {
        risk: "Low",
        diseases: [
            "Tick-borne Diseases",
            "Skin Infections",
            "Worm Infestation"
        ],
        vaccines: [
            "Rabies",
            "DHPP",
            "Leptospirosis"
        ],
        exercise: "Moderate daily activity",
        emergency: "High fever, deep wounds, or snake bite require urgent care."
    },

    /* ===== ADDITIONAL BREEDS ===== */

    beagle: {
        risk: "Medium",
        diseases: [
            "Epilepsy",
            "Obesity",
            "Ear Infections",
            "Hypothyroidism"
        ],
        vaccines: ["Rabies", "DHPP", "Leptospirosis"],
        exercise: "60 minutes daily",
        emergency: "Seizures or sudden confusion require immediate vet care."
    },

    rottweiler: {
        risk: "High",
        diseases: [
            "Hip & Elbow Dysplasia",
            "Heart Disease",
            "Osteosarcoma (Bone Cancer)"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "90 minutes daily",
        emergency: "Sudden collapse or breathing difficulty is critical."
    },

    doberman: {
        risk: "High",
        diseases: [
            "Dilated Cardiomyopathy",
            "Cervical Vertebral Instability",
            "Hypothyroidism"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "90 minutes daily",
        emergency: "Weakness or fainting indicates heart emergency."
    },

    boxer: {
        risk: "High",
        diseases: [
            "Cardiac Arrhythmia",
            "Cancer",
            "Hip Dysplasia"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "60–90 minutes daily",
        emergency: "Fainting or breathing difficulty needs urgent care."
    },

    husky: {
        risk: "Medium",
        diseases: [
            "Heat Stroke",
            "Hip Dysplasia",
            "Eye Disorders"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "High activity (cool climate)",
        emergency: "Collapse or heavy panting in heat is life-threatening."
    },

    pomeranian: {
        risk: "Medium",
        diseases: [
            "Tracheal Collapse",
            "Dental Disease",
            "Patellar Luxation"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "Light daily walks",
        emergency: "Choking sounds or breathing difficulty need urgent care."
    },

    shihtzu: {
        risk: "Medium",
        diseases: [
            "Eye Infections",
            "Dental Disease",
            "Breathing Issues"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "Light activity",
        emergency: "Eye injury or breathing distress needs vet attention."
    },

    dachshund: {
        risk: "High",
        diseases: [
            "Intervertebral Disc Disease (IVDD)",
            "Obesity"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "Controlled short walks",
        emergency: "Sudden paralysis is an emergency."
    },

    greatdane: {
        risk: "High",
        diseases: [
            "Bloat (GDV)",
            "Heart Disease",
            "Joint Disorders"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "Low-impact daily activity",
        emergency: "Abdominal swelling or collapse is life-threatening."
    },

    dalmatian: {
        risk: "Medium",
        diseases: [
            "Urinary Stones",
            "Deafness",
            "Skin Allergies"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "High daily activity",
        emergency: "Difficulty urinating requires immediate vet care."
    },

    chihuahua: {
        risk: "Medium",
        diseases: [
            "Dental Disease",
            "Hypoglycemia",
            "Heart Disease"
        ],
        vaccines: ["Rabies", "DHPP"],
        exercise: "Very light activity",
        emergency: "Sudden weakness or collapse is critical."
    },

    frenchbulldog: {
        risk: "High",
        diseases: [
            "Breathing Disorders (BOAS)",
            "Spinal Disorders",
            "Skin Allergies"
        ],
        vaccines: ["Rabies", "DHPP", "Kennel Cough"],
        exercise: "Short walks only",
        emergency: "Breathing distress or paralysis is an emergency."
    },

    englishbulldog: {
        risk: "High",
        diseases: [
            "Breathing Disorders (BOAS)",
            "Skin Fold Infections",
            "Joint Problems"
        ],
        vaccines: ["Rabies", "DHPP", "Kennel Cough"],
        exercise: "Very light activity",
        emergency: "Overheating or breathing difficulty is life-threatening."
    }
};


/* ==========================================================
   SECTION 2
   VET-GRADE MEDICAL PROFILES (REFERENCE ONLY)
   ----------------------------------------------------------
   - NOT USED BY UI
   - FOR FUTURE CLINICAL / AI LOGIC
========================================================== */

const vetGradeMedicalProfiles = {

    orthopedic: {
        description: "Bone and joint related veterinary disorders.",
        examples: ["Hip Dysplasia", "Arthritis", "IVDD"]
    },

    cardiac: {
        description: "Heart and circulatory system disorders.",
        examples: ["Dilated Cardiomyopathy", "Arrhythmia"]
    },

    respiratory: {
        description: "Breathing and airway related disorders.",
        examples: ["BOAS", "Heat Stroke"]
    },

    dermatology: {
        description: "Skin and allergy related conditions.",
        examples: ["Atopic Dermatitis", "Skin Fold Infection"]
    },

    neurologic: {
        description: "Brain and nerve related disorders.",
        examples: ["Epilepsy", "IVDD"]
    },

    parasitic: {
        description: "Tick, worm and parasite-borne diseases.",
        examples: ["Tick Fever", "Worm Infestation"]
    }
};


document.addEventListener("DOMContentLoaded", () => {

    const breedSelect = document.getElementById("breedSelect");
    const breedTip = document.getElementById("breedTip");

    if (!breedSelect || !breedTip) {
        console.error("Breed select or breedTip not found in DOM");
        return;
    }

    breedSelect.addEventListener("change", () => {

        const breed = breedSelect.value;

        if (!breed || !breedData[breed]) {
            breedTip.innerHTML = "";
            return;
        }

        const b = breedData[breed];

        const riskClass =
            b.risk.includes("High") ? "risk-high" :
            b.risk.includes("Medium") ? "risk-medium" :
            "risk-low";

        breedTip.innerHTML = `
            <p>
                <strong>Risk Level:</strong>
                <span class="risk-badge ${riskClass}">
                    ${b.risk}
                </span>
            </p>

            <p><strong>Prone Diseases:</strong></p>
            <ul>
                ${b.diseases.map(d => `<li>${d}</li>`).join("")}
            </ul>

            <p><strong>Daily Exercise:</strong> ${b.exercise}</p>

            <p><strong>Essential Vaccines:</strong></p>
            <ul class="vaccine-list">
                ${b.vaccines.map(v => `<li>${v}</li>`).join("")}
            </ul>

            <div class="emergency-box">
                🚨 <strong>Emergency Warning</strong><br>
                ${b.emergency}
            </div>
        `;
    });
});
