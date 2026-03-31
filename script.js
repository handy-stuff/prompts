// 1. ADD YOUR TEXT FILE NAMES HERE
const promptFiles = [
    "AB Test Copy Writer.txt",
    "API Documentation Writer.txt",
    "Blog Post Outline.txt",
    "Bug Fixer.txt",
    "Changelog Generator.txt",
    "Code Explainer.txt",
    "Code Refactorer.txt",
    "Code Reviewer.txt",
    "Cold Email Writer.txt",
    "Cover Letter Writer.txt",
    "Customer Persona Builder.txt",
    "Data Analysis Assistant.txt",
    "Database Schema Designer.txt",
    "Docker DevOps Script Helper.txt",
    "Email Polisher.txt",
    "Essay Writer.txt",
    "FAQ Generator.txt",
    "Git Commit Message Generator.txt",
    "GitHub Actions Workflow Builder.txt",
    "Interview Prep Coach.txt",
    "Job Description Writer.txt",
    "Landing Page Copy Writer.txt",
    "Learn a New Skill.txt",
    "LinkedIn Post Generator.txt",
    "Meeting Summarizer.txt",
    "Midjourney Portrait.txt",
    "Negotiation Script.txt",
    "Newsletter Writer.txt",
    "Onboarding Email Sequence.txt",
    "Performance Review Writer.txt",
    "Pitch Deck Outliner.txt",
    "Press Release Writer.txt",
    "Product Description Writer.txt",
    "Prompt Improver.txt",
    "Python Script Generator.txt",
    "README Generator.txt",
    "Recipe Creator.txt",
    "Regex Pattern Generator.txt",
    "Resume Tailorer.txt",
    "SEO Content Brief.txt",
    "SQL Query Builder.txt",
    "Slack Message Drafter.txt",
    "Snowflake Schema Builder.txt",
    "Social Media Calendar.txt",
    "Storytelling Fiction Writer.txt",
    "System Prompt Builder.txt",
    "Terraform IaC Generator.txt",
    "Travel Itinerary Planner.txt",
    "Unit Test Generator.txt",
    "User Story Writer.txt",
    "Video Script Writer.txt",
    "Weekly Planner.txt",
    "Workout Plan Generator.txt"
];

let prompts = []; 

const grid = document.getElementById('prompt-grid');
const searchInput = document.getElementById('searchInput');
const categoryList = document.getElementById('category-list');

// 2. FETCH AND READ TEXT FILES (NOW IN PARALLEL!)
async function loadPrompts() {
    
    if (window.location.protocol === 'file:') {
        grid.innerHTML = `
            <div style="background: #ffebee; color: #c62828; padding: 20px; border-radius: 8px; grid-column: 1 / -1; border: 1px solid #ef9a9a;">
                <h3 style="margin-top:0;">⚠️ Security Block (Local File)</h3>
                <p>Browsers block scripts from reading folders when you open files directly (your URL starts with <code>file:///</code>).</p>
                <p><strong>Fix:</strong> Push your code to GitHub Pages, or use VS Code "Live Server" locally.</p>
            </div>
        `;
        return; 
    }

    grid.innerHTML = '<p>Loading prompts...</p>';

    // 🚀 NEW PARALLEL FETCHING MAGIC 
    const fetchPromises = promptFiles.map(async (fileName) => {
        try {
            const response = await fetch(`prompts/${fileName}`);
            if (!response.ok) return null; // Skip if file is missing

            const textData = await response.text();
            const title = fileName.replace('.txt', '');
            
            let category = "General";
            let promptText = textData;
            
            const lines = textData.split('\n');
            if (lines[0].startsWith('Category:')) {
                category = lines[0].replace('Category:', '').trim();
                let textLines = lines.slice(1);
                
                // Extra safety check in case the file has blank lines
                if (textLines.length > 0 && textLines[0].trim() === '---') {
                    textLines = textLines.slice(1);
                }
                promptText = textLines.join('\n').trim();
            }

            return { title, category, text: promptText };
        } catch (error) {
            console.error(`Failed to load ${fileName}`, error);
            return null;
        }
    });

    // Wait for all 54 files to load simultaneously
    const results = await Promise.all(fetchPromises);
    
    // Remove any nulls (files that couldn't be loaded)
    prompts = results.filter(p => p !== null);

    if (prompts.length === 0) {
        grid.innerHTML = `
            <div style="background: #fff3cd; color: #856404; padding: 20px; border-radius: 8px; grid-column: 1 / -1; border: 1px solid #ffeeba;">
                <h3 style="margin-top:0;">⚠️ No Prompts Found</h3>
                <p>Could not load any text files. Please check:</p>
                <ul>
                    <li>Is your folder named exactly <code>prompts</code>? (lowercase)</li>
                    <li>Are the text files uploaded to GitHub?</li>
                </ul>
            </div>
        `;
        return; 
    }

    populateCategories();
    renderPrompts(prompts);
}

// 3. GENERATE SIDEBAR CHECKBOXES
function populateCategories() {
    const uniqueCategories = [...new Set(prompts.map(p => p.category))].sort();
    categoryList.innerHTML = ''; 

    uniqueCategories.forEach(category => {
        const label = document.createElement('label');
        label.className = 'category-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category;
        checkbox.className = 'category-checkbox';
        checkbox.addEventListener('change', filterPrompts);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(category));
        categoryList.appendChild(label);
    });
}

// 4. RENDER CARDS & COPY BUTTON
function renderPrompts(promptArray) {
    grid.innerHTML = ''; 
    
    if (promptArray.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1;">No prompts found matching your search.</p>';
        return;
    }

    promptArray.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${prompt.title}</h3>
                <span class="category-tag">${prompt.category}</span>
            </div>
            <div class="prompt-text">${prompt.text}</div>
            <button class="copy-btn">Copy Prompt</button>
        `;

        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(prompt.text).then(() => {
                copyBtn.innerText = 'Copied! ✅';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerText = 'Copy Prompt';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });

        grid.appendChild(card);
    });
}

// 5. SEARCH & MULTI-SELECT FILTER
function filterPrompts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const checkedBoxes = document.querySelectorAll('.category-checkbox:checked');
    const selectedCategories = Array.from(checkedBoxes).map(cb => cb.value);

    const filtered = prompts.filter(prompt => {
        const matchesSearch = prompt.title.toLowerCase().includes(searchTerm) || 
                              prompt.text.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(prompt.category);
        
        return matchesSearch && matchesCategory;
    });

    renderPrompts(filtered);
}

searchInput.addEventListener('input', filterPrompts);

// START APP
loadPrompts();
