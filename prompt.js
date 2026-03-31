async function loadSinglePrompt() {
    const container = document.getElementById('single-prompt-container');
    
    // Read the URL to find out which file to load
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');

    if (!fileName) {
        container.innerHTML = `
            <p>Error: No prompt specified.</p>
            <a href="index.html" class="back-link">← Back to Library</a>
        `;
        return;
    }

    try {
        const response = await fetch(`prompts/${fileName}.txt`);
        
        if (!response.ok) {
            container.innerHTML = `
                <p>Error: Prompt not found.</p>
                <a href="index.html" class="back-link">← Back to Library</a>
            `;
            return;
        }

        const textData = await response.text();
        
        let category = "General";
        let promptText = textData;
        
        const lines = textData.split('\n');
        if (lines[0].startsWith('Category:')) {
            category = lines[0].replace('Category:', '').trim();
            let textLines = lines.slice(1);
            if (textLines.length > 0 && textLines[0].trim() === '---') {
                textLines = textLines.slice(1);
            }
            promptText = textLines.join('\n').trim();
        }

        // Generate the clean, full-page UI
        container.innerHTML = `
            <a href="index.html" class="back-link">← Back to Library</a>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 1.8rem;">${fileName}</h2>
                <span class="category-tag" style="font-size: 1rem; padding: 6px 12px;">${category}</span>
            </div>
            
            <div class="single-prompt-text">${promptText}</div>
            
            <button class="copy-btn" id="copySingleBtn" style="width: 100%;">Copy Full Prompt</button>
        `;

        const copyBtn = document.getElementById('copySingleBtn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(promptText).then(() => {
                copyBtn.innerText = 'Copied! ✅';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerText = 'Copy Full Prompt';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });

    } catch (error) {
        container.innerHTML = `
            <p>Error loading prompt.</p>
            <a href="index.html" class="back-link">← Back to Library</a>
        `;
    }
}

loadSinglePrompt();
