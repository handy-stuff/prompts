// 1. ADD YOUR TEXT FILE NAMES HERE
const promptFiles = [
    // ── Original 9 (upgraded) ──
    "Blog Post Outline.txt",
    "Bug Fixer.txt",
    "Code Explainer.txt",
    "Code Reviewer.txt",
    "Email Polisher.txt",
    "Learn a New Skill.txt",
    "Meeting Summarizer.txt",
    "Midjourney Portrait.txt",
    "Social Media Calendar.txt",

    // ── Coding & Dev ──
    "Code Refactorer.txt",
    "Unit Test Generator.txt",
    "API Documentation Writer.txt",
    "README Generator.txt",
    "Git Commit Message Generator.txt",

    // ── Data & Analytics ──
    "SQL Query Builder.txt",
    "Snowflake Schema Builder.txt",

    // ── AI & Prompt Engineering ──
    "Prompt Improver.txt",
    "System Prompt Builder.txt",

    // ── Writing ──
    "Cold Email Writer.txt",
    "LinkedIn Post Generator.txt",

    // ── Career & Job Search ──
    "Resume Tailorer.txt",
    "Cover Letter Writer.txt",
    "Interview Prep Coach.txt",

    // ── Automation & Tools ──
    "Python Script Generator.txt",
    "GitHub Actions Workflow Builder.txt"
];

let prompts = []; 

const grid = document.getElementById('prompt-grid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// 2. FETCH AND READ TEXT FILES
async function loadPrompts() {
    grid.innerHTML = '<p>Loading prompts...</p>';
    prompts = [];

    for (const fileName of promptFiles) {
        try {
            const response = await fetch(`prompts/${fileName}`);
            if (!response.ok) continue;

            const textData = await response.text();
            const title = fileName.replace('.txt', '');
            
            let category = "General";
            let promptText = textData;
            
            const lines = textData.split('\n');
            if (lines[0].startsWith('Category:')) {
                category = lines[0].replace('Category:', '').trim();
                let textLines = lines.slice(1);
                if (textLines[0].trim() === '---') {
                    textLines = textLines.slice(1);
                }
                promptText = textLines.join('\n').trim();
            }

            prompts.push({ title, category, text: promptText });
        } catch (error) {
            console.error("Error loading file:", error);
        }
    }

    populateCategories();
    renderPrompts(prompts);
}

// 3. GENERATE CATEGORIES
function populateCategories() {
    const uniqueCategories = [...new Set(prompts.map(p => p.category))];
    categoryFilter.innerHTML = '<option value="All">All Categories</option>';
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// 4. RENDER CARDS & BULLETPROOF COPY BUTTON
function renderPrompts(promptArray) {
    grid.innerHTML = ''; 
    
    if (promptArray.length === 0) {
        grid.innerHTML = '<p>No prompts found.</p>';
        return;
    }

    promptArray.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Build the HTML WITHOUT inline onclick attributes
        card.innerHTML = `
            <div class="card-header">
                <h3>${prompt.title}</h3>
                <span class="category-tag">${prompt.category}</span>
            </div>
            <div class="prompt-text">${prompt.text}</div>
            <button class="copy-btn">Copy Prompt</button>
        `;

        // Safely attach the click event in Javascript
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(prompt.text).then(() => {
                // Change button state
                copyBtn.innerText = 'Copied! ✅';
                copyBtn.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.innerText = 'Copy Prompt';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Copy failed', err);
                copyBtn.innerText = 'Failed!';
            });
        });

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

searchInput.addEventListener('input', filterPrompts);
categoryFilter.addEventListener('change', filterPrompts);

// START THE APP
loadPrompts();
