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
