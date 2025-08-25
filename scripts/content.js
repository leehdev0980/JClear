function getEmailDetails() {
    //Select all email rows
    const emails = [];
    const emailRows = document.querySelectorAll('.zA');

    emailRows.forEach(row => {
        const subject = row.querySelector('.bog')?.innerText || '';
        const sender = row.querySelector('.yX.xY .yW span')?.getAttribute('email') ||
                       row.querySelector('.yX.xY .yW span')?.innerText || '';
        emails.push({ subject, sender });
    });

    // Group by sender, then by subject
    const grouped = {};
    emails.forEach(email => {
        if (!grouped[email.sender]) {
            grouped[email.sender] = {};
        }
        if (!grouped[email.sender][email.subject]) {
            grouped[email.sender][email.subject] = 0;
        }
        grouped[email.sender][email.subject]++;
    });

    // Prepare result
    const result = [];
    for (const sender in grouped) {
        let subjects = [];
        for (const subject in grouped[sender]) {
            subjects.push({ subject, count: grouped[sender][subject] });
        }
        result.push({ sender, subjects });
    }

    return {
        groupedBySender: result,
        totalEmails: emails.length,
    };
}

chrome.runtime.onMessage.addListener((req, _sender,sendResponse) => {
    if ((req.type = "getEmails")) {
        const emailDetails = getEmailDetails();
        sendResponse({ emailDetails });
    }
})