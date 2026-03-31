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

// 3. GENERATE SIDEBAR CHECKBOXES
function populateCategories() {
    // Get unique categories and sort them alphabetically
    const uniqueCategories = [...new Set(prompts.map(p => p.category))].sort();
    
    categoryList.innerHTML = ''; 

    uniqueCategories.forEach(category => {
        // Create the label wrapper
        const label = document.createElement('label');
        label.className = 'category-item';

        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category;
        checkbox.className = 'category-checkbox';
        
        // Listen for clicks on the checkbox
        checkbox.addEventListener('change', filterPrompts);

        // Add checkbox and text to label
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(category));

        // Add to sidebar
        categoryList.appendChild(label);
    });
}

// 4. RENDER CARDS & COPY BUTTON
function renderPrompts(promptArray) {
    grid.innerHTML = ''; 
    
    if (promptArray.length === 0) {
        grid.innerHTML = '<p>No prompts found matching your criteria.</p>';
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
    
    // Find all checkboxes that are currently checked
    const checkedBoxes = document.querySelectorAll('.category-checkbox:checked');
    // Map them into an array of category names
    const selectedCategories = Array.from(checkedBoxes).map(cb => cb.value);

    const filtered = prompts.filter(prompt => {
        // Check text search
        const matchesSearch = prompt.title.toLowerCase().includes(searchTerm) || 
                              prompt.text.toLowerCase().includes(searchTerm);
        
        // If NO boxes are checked, we show everything.
        // Otherwise, the prompt's category must be inside our selectedCategories array.
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(prompt.category);
        
        return matchesSearch && matchesCategory;
    });

    renderPrompts(filtered);
}

// Listen for typing in the search bar
searchInput.addEventListener('input', filterPrompts);

// START APP
loadPrompts();
