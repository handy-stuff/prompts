// 1. Get the prompt name from the URL (e.g., ?name=Blog%20Post%20Outline)
const urlParams = new URLSearchParams(window.location.search);
const promptName = urlParams.get('name');
const container = document.getElementById('prompt-content');

async function loadSinglePrompt() {
    if (!promptName) {
        container.innerHTML = '<h2>Error: No prompt specified.</h2>';
        return;
    }

    try {
        // 2. Fetch the specific text file
        const response = await fetch(`prompts/${promptName}.txt`);
        
        if (!response.ok) {
            container.innerHTML = `<h2>Error: Could not find "${promptName}"</h2>`;
            return;
        }

        const textData = await response.text();
        
        // 3. Parse Category and Text
        let category = "General";
        let promptText = textData;
        
        const lines = textData.split('\n');
        if (lines[0].startsWith('Category:')) {
            category = lines[0].replace('Category:', '').trim();
            let textLines = lines.slice(1);
            if (textLines[0] && textLines[0].trim() === '---') {
                textLines = textLines.slice(1);
            }
            promptText = textLines.join('\n').trim();
        }

        // Update the browser tab title to look professional
        document.title = `${promptName} | My Prompts`;

        // 4. Render the professional layout
        container.innerHTML = `
            <div class="card-header" style="border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 2rem; color: #333;">${promptName}</h1>
                <span class="category-tag" style="font-size: 1rem; padding: 6px 12px;">${category}</span>
            </div>
            
            <button class="copy-btn" style="width: 100%; margin-bottom: 20px; font-size: 1.1rem; padding: 15px;" 
                onclick="copyPrompt(this, \`${promptText.replace(/`/g, '\\`')}\`)">
                📋 Copy Prompt to Clipboard
            </button>
            
            <div class="single-prompt-text">${promptText}</div>
        `;

    } catch (error) {
        console.error("Error loading prompt:", error);
        container.innerHTML = '<h2>Error loading prompt data.</h2>';
    }
}

// 5. Copy function for the single page
function copyPrompt(buttonElement, textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '✅ Copied to Clipboard!';
        buttonElement.classList.add('copied');
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.classList.remove('copied');
        }, 2000);
    });
}

// Start loading when page opens
loadSinglePrompt();
