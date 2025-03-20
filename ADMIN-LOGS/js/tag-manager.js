// DOM Elements
const tagNameInput = document.getElementById('tag-name');
const tagBgColorInput = document.getElementById('tag-bg-color');
const tagTextColorInput = document.getElementById('tag-text-color');
const existingTags = document.getElementById('existing-tags');
const projectTags = document.getElementById('project-tags');
const previewTag = document.getElementById('preview-tag');

// Tag Management
let tags = [];

// Load tags from JSON file
async function loadTags() {
    try {
        const response = await fetch('../data/tags-config.json');
        const data = await response.json();
        tags = data.tags || [];
        renderTags();
    } catch (error) {
        console.error('Error loading tags:', error);
        tags = [];
    }
}


// Save tags to JSON file
async function saveTags() {
    try {
        const response = await fetch('../data/tags-config.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tags })
        });
        if (!response.ok) throw new Error('Failed to save tags');
    } catch (error) {
        console.error('Error saving tags:', error);
        alert('Failed to save tags. Please try again.');
    }
}

// Render tags in the existing tags section
function renderTags() {
    existingTags.innerHTML = '';
    projectTags.innerHTML = '';
    
    tags.forEach((tag, index) => {
        // Render in existing tags section
        const tagElement = document.createElement('div');
        tagElement.className = 'flex items-center justify-between bg-white p-2 rounded-md shadow-sm';
        tagElement.innerHTML = `
            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium" 
                  style="background-color: ${tag.bgColor}; color: ${tag.textColor}">
                ${tag.name}
            </span>
            <button class="text-red-500 hover:text-red-700" onclick="deleteTag(${index})">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;
        existingTags.appendChild(tagElement);

        // Render in project tags section
        const projectTagElement = document.createElement('div');
        projectTagElement.className = 'cursor-pointer inline-block px-3 py-1 rounded-full text-sm font-medium'
        projectTagElement.style.backgroundColor = tag.bgColor;
        projectTagElement.style.color = tag.textColor;
        projectTagElement.textContent = tag.name;
        projectTagElement.onclick = () => toggleProjectTag(tag.name);
        projectTags.appendChild(projectTagElement);
    });
}

// Delete a tag
function deleteTag(index) {
    tags.splice(index, 1);
    saveTags();
    renderTags();
}

// Add a new tag
function addTag() {
    const name = tagNameInput.value.trim();
    const bgColor = tagBgColorInput.value;
    const textColor = tagTextColorInput.value;

    if (!name) {
        alert('Please enter a tag name');
        return;
    }

    if (tags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) {
        alert('This tag already exists');
        return;
    }

    tags.push({ name, bgColor, textColor });
    saveTags();
    renderTags();

    // Clear inputs
    tagNameInput.value = '';
    tagBgColorInput.value = '#000000';
    tagTextColorInput.value = '#ffffff';
    updatePreview();
}

// Toggle project tag selection
function toggleProjectTag(tagName) {
    const element = document.querySelector(`[data-tag="${tagName}"]`);
    if (element) {
        element.classList.toggle('opacity-50');
    }
}

// Event Listeners
document.getElementById('add-tag').addEventListener('click', addTag);

// Update preview function
function updatePreview() {
    const name = tagNameInput.value.trim() || 'Tag Preview';
    const bgColor = tagBgColorInput.value;
    const textColor = tagTextColorInput.value;
    
    previewTag.textContent = name;
    previewTag.style.backgroundColor = bgColor;
    previewTag.style.color = textColor;
}

// Initialize
loadTags();
updatePreview();