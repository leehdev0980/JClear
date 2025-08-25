document.getElementById('analyse').addEventListener('click', () => {
    const result = document.getElementById('result');
    result.innerText = "Analysing...";

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.sendMessage(
            tab.id,
            { type: "getEmails" },
            ({ emailDetails }) => {
                result.textContent = text ? JSON.stringify(emailDetails) : '';
            }
        )
    })
});