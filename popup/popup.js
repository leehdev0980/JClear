function displayEmailDetails(data) {
    const container = document.getElementById('email-container');
    const stats = document.getElementById('stats');
    container.innerHTML = ''; // Clear previous results
    
    // Display total emails
    stats.innerHTML = `<p>Total Emails: ${data.totalEmails}</p>`;
    
    // Display each sender's group
    data.groupedBySender.forEach(group => {
        // Log to console for debugging
        console.log(`Sender: ${group.sender}`);
        console.log('Subjects:', group.subjects);
        
        // Create group container
        const groupDiv = document.createElement('div');
        groupDiv.className = 'email-group';
        
        // Add sender header
        const senderHeader = document.createElement('div');
        senderHeader.className = 'sender';
        senderHeader.textContent = group.sender;
        groupDiv.appendChild(senderHeader);
        
        // Add subjects list
        const subjectList = document.createElement('ul');
        subjectList.className = 'subject-list';
        
        group.subjects.forEach(subjectData => {
            const li = document.createElement('li');
            li.textContent = `${subjectData.subject} `;
            
            const countSpan = document.createElement('span');
            countSpan.className = 'count';
            countSpan.textContent = `(${subjectData.count})`;
            
            li.appendChild(countSpan);
            subjectList.appendChild(li);
        });
        
        groupDiv.appendChild(subjectList);
        container.appendChild(groupDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scan-btn');
    
    scanButton.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('mail.google.com')) {
                document.getElementById('email-container').innerHTML = 
                    '<p>Please open Gmail to scan emails</p>';
                return;
            }

            const response = await chrome.tabs.sendMessage(tab.id, { 
                type: 'getEmails',
                category: document.getElementById('email-type').value
            });
            
            if (response && response.emailDetails) {
                console.log('Raw scan results:', response.emailDetails);
                displayEmailDetails(response.emailDetails);
            }
        } catch (error) {
            console.error('Scanning failed:', error);
            document.getElementById('email-container').innerHTML = 
                '<p>Error: Please refresh Gmail and try again</p>';
        }
    });
});