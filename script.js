// 1. ADD YOUR TEXT FILE NAMES HERE
const promptFiles = [
  "AB Test Copy Writer.txt",
  "API Documentation Writer.txt",
  "Blog Post Outline.txt",
  "Budget Planner.txt",
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
  "ETL Pipeline Designer.txt",
  "Email Polisher.txt",
  "Essay Writer.txt",
  "Excel Formula Generator.txt",
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
  "REST API Endpoint Designer.txt",
  "Recipe Creator.txt",
  "Regex Pattern Generator.txt",
  "Resume Tailorer.txt",
  "SEO Content Brief.txt",
  "SQL Query Builder.txt",
  "Slack Message Drafter.txt",
  "Snowflake Schema Builder.txt",
  "Social Media Calendar.txt",
  "Storytelling Fiction Writer.txt",
  "Study Plan Creator.txt",
  "System Prompt Builder.txt",
  "Terraform IaC Generator.txt",
  "Travel Itinerary Planner.txt",
  "Twitter Thread Writer.txt",
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
const countDisplay = document.getElementById('prompt-count');

// 2. PARALLEL FETCHING
async function loadPrompts() {
    grid.innerHTML = '<p>Loading prompts...</p>';

    const fetchPromises = promptFiles.map(async (fileName) => {
        try {
            const response = await fetch(`prompts/${fileName}`);
            if (!response.ok) return null; 

            const textData = await response.text();
            const title = fileName.replace('.txt', '');
            
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

            return { title, category, text: promptText };
        } catch (error) {
            console.error(`Failed to load ${fileName}`, error);
            return null;
        }
    });

    const results = await Promise.all(fetchPromises);
    prompts = results.filter(p => p !== null);

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

// 4. RENDER CARDS
function renderPrompts(promptArray) {
    grid.innerHTML = ''; 
    
    if (prompts.length === 0) {
        countDisplay.innerText = ''; 
    } else if (promptArray.length === prompts.length) {
        countDisplay.innerText = `Showing all ${prompts.length} prompts`;
    } else {
        countDisplay.innerText = `Showing ${promptArray.length} of ${prompts.length} prompts`;
    }
    
    if (promptArray.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1;">No prompts found matching your criteria.</p>';
        return;
    }

    promptArray.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Notice the <a> tag here has NO target="_blank", so it opens in the same tab!
        card.innerHTML = `
            <div class="card-header">
                <h3>${prompt.title}</h3>
                <span class="category-tag">${prompt.category}</span>
            </div>
            <div class="prompt-text">${prompt.text}</div>
            <div class="card-actions">
                <button class="copy-btn">Copy Prompt</button>
                <a href="prompt.html?file=${encodeURIComponent(prompt.title)}" class="view-btn" title="View Full Prompt">➔</a>
            </div>
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

// 5. SEARCH & FILTER
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
