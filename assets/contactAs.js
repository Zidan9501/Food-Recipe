let sendBtn = document.getElementById("send");
let resetBtn = document.getElementById("reset");
let form = document.getElementById("form");
let confirmation = document.getElementById("confirmation");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Hämta värdena från formulärfälten
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let message = document.getElementById("message");

    if (name.value && email.value && message.value) {
        // Spara formulärvärdena i webbläsarens lokal lagring
        localStorage.setItem("name", name.value);
        localStorage.setItem("email", email.value);
        localStorage.setItem("message", message.value);

        // Visa ett tackmeddelande efter att formuläret har skickats in
        confirmation.textContent = "TACK. Vi har fått ditt meddelande.";
        sendBtn.disabled = true; // Disable submit button after submission
    } else {
        confirmation.textContent = "Vänligen fyll i alla obligatoriska fält.";
    }
});

// Event för att rensa formulärfälten
resetBtn.addEventListener("click", () => {
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let message = document.getElementById("message");
    name.value = "";
    email.value = "";
    message.value = "";
    confirmation.textContent = "";
    sendBtn.disabled = false;
});
