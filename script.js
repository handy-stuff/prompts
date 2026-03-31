// 1. ADD YOUR TEXT FILE NAMES HERE
// Whenever you add a new .txt file to the "prompts" folder, just add its name to this list.
const promptFiles = [
    "Code Reviewer.txt",
    "Blog Post Outline.txt",
    "Code Explainer.txt",
    "Bug Fixer.txt",
    "Meeting Summarizer.txt",
    "Email Polisher.txt",
    "Learn a New Skill.txt",
    "Social Media Calendar.txt",
    "Midjourney Portrait.txt"
];

let prompts = []; // We will store the fetched data here

const grid = document.getElementById('prompt-grid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// 2. FETCH AND READ THE TEXT FILES
async function loadPrompts() {
    grid.innerHTML = '<p>Loading prompts...</p>';
    prompts = [];

    for (const fileName of promptFiles) {
        try {
            // Fetch the text file from the prompts folder
            const response = await fetch(`prompts/${fileName}`);
            
            if (!response.ok) {
                console.error(`Could not find file: ${fileName}`);
                continue;
            }

            const textData = await response.text();
            
            // The title is the filename without '.txt'
            const title = fileName.replace('.txt', '');
            
            // Parse category and prompt text
            let category = "General";
            let promptText = textData;
            
            const lines = textData.split('\n');
            if (lines[0].startsWith('Category:')) {
                category = lines[0].replace('Category:', '').trim();
                
                // Remove the category line and the "---" separator line
                let textLines = lines.slice(1);
                if (textLines[0].trim() === '---') {
                    textLines = textLines.slice(1);
                }
                promptText = textLines.join('\n').trim();
            }

            // Save to our array
            prompts.push({ title, category, text: promptText });

        } catch (error) {
            console.error("Error loading file:", error);
        }
    }

    // Build the UI
    populateCategories();
    renderPrompts(prompts);
}

// 3. GENERATE CATEGORY DROPDOWN DYNAMICALLY
function populateCategories() {
    // Get unique categories from our prompts
    const uniqueCategories = [...new Set(prompts.map(p => p.category))];
    
    // Keep the "All" option, but clear the rest
    categoryFilter.innerHTML = '<option value="All">All Categories</option>';
    
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// 4. RENDER THE CARDS
function renderPrompts(promptArray) {
    grid.innerHTML = ''; 
    
    if (promptArray.length === 0) {
        grid.innerHTML = '<p>No prompts found.</p>';
        return;
    }

    promptArray.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h3 style="margin: 0;">${prompt.title}</h3>
                <span class="category-tag">${prompt.category}</span>
            </div>
            <div class="prompt-text">${prompt.text}</div>
            <button class="copy-btn" onclick="copyPrompt(this, \`${prompt.text.replace(/`/g, '\\`')}\`)">Copy Prompt</button>
        `;
        grid.appendChild(card);
    });
}

// 5. SEARCH & FILTER
function filterPrompts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = prompts.filter(prompt => {
        const matchesSearch = prompt.title.toLowerCase().includes(searchTerm) || 
                              prompt.text.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    renderPrompts(filtered);
}

// 6. COPY TO CLIPBOARD
function copyPrompt(buttonElement, textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = buttonElement.innerText;
        buttonElement.innerText = 'Copied! ✅';
        buttonElement.classList.add('copied');
        setTimeout(() => {
            buttonElement.innerText = originalText;
            buttonElement.classList.remove('copied');
        }, 2000);
    });
}

// Event Listeners
searchInput.addEventListener('input', filterPrompts);
categoryFilter.addEventListener('change', filterPrompts);

// START THE APP
loadPrompts();
