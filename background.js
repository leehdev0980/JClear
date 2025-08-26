chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["geminiApiKey"], (result) => {
        if (!result.geminiApiKey) {
            chrome.tabs.create({ url: "options/options.html" });
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getEmails') {
        try {
            const emailDetails = getEmailDetails();
            console.log('Scanned emails:', emailDetails); // Debug log
            sendResponse({ emailDetails });
        } catch (error) {
            console.error('Scan failed:', error);
            sendResponse({ error: error.message });
        }
        return true; // Keep connection alive for async response
    }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getEmails" }, (response) => {
            if (response && response.emailDetails) {
                console.log("Scan Results:", response.emailDetails);
                // You can process or store the results here
            } else {
                console.log("No email details received.");
            }
        });
    }
});
