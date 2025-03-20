// js/data-loader.js
class PortfolioData {
    constructor() {
      this.studies = [];
      this.projects = [];
      this.experience = [];
      this.tagsConfig = {};
    }
  
    async loadData() {
      try {
        // Load all data files concurrently
        const [studiesData, projectsData, experienceData, tagsConfigData] = await Promise.all([
          fetch('./data/studies.json').then(response => response.json()),
          fetch('./data/projects.json').then(response => response.json()),
          fetch('./data/experience.json').then(response => response.json()),
          fetch('./data/tags-config.json').then(response => response.json())
        ]);
        
        this.studies = studiesData;
        this.projects = projectsData;
        this.experience = experienceData;
        this.tagsConfig = tagsConfigData.tags;
        
        return true;
      } catch (error) {
        console.error('Error loading portfolio data:', error);
        return false;
      }
    }
  
    renderTags(tags) {
      if (!tags || !Array.isArray(tags)) return '';
      
      return tags.map(tag => {
        const tagConfig = this.tagsConfig[tag] || {};
        const style = Object.entries(tagConfig)
          .map(([key, value]) => {
            // Convert camelCase to kebab-case
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}:${value}`;
          })
          .join(';');
        
        return `<span class="tag" data-type="${tag}">${tag}</span>`;
      }).join('');
    }

    renderStudies() {
      const studiesList = document.querySelector('#studies ul');
      if (!studiesList) return;
      
      studiesList.innerHTML = ''; // Clear existing content
      
      this.studies.forEach(study => {
        const li = document.createElement('li');
        li.className = 'item';
        
        const tagsHtml = this.renderTags(study.tags);
        
        if (study.url) {
          li.innerHTML = `
            <div>
              <a href="${study.url}" target="_blank">
                <h4>${study.title}</h4>
              </a>
              <div class="tags">${tagsHtml}</div>
            </div>
            <h4 class="s-date">${study.date}</h4>
          `;
        } else {
          li.innerHTML = `
            <div>
              <h4>${study.title}</h4>
              <div class="tags">${tagsHtml}</div>
            </div>
            <h4 class="s-date">${study.date}</h4>
          `;
        
        studiesList.appendChild(li);
      }
      studiesList.appendChild(li);
      });
    }
  
    renderProjects() {
      const projectsGrid = document.querySelector('.projects-grid');
      if (!projectsGrid) return;
      
      projectsGrid.innerHTML = ''; // Clear existing content
      
      this.projects.forEach(project => {
        const div = document.createElement('div');
        div.className = 'p-container project-tile';
        
        const tagsHtml = this.renderTags(project.tags);
        
        div.innerHTML = `
          <a href="${project.url}" target="_blank">
            <div class="img-container">
              <img src="${project.image}" alt="${project.title}">
            </div>
            <legend>${project.title}</legend>
            <div class="tags">${tagsHtml}</div>
          </a>
        `;
        
        projectsGrid.appendChild(div);
      });
    }
  
    renderExperience() {
      const experienceSection = document.getElementById('experience');
      if (!experienceSection) return;
      
      const experienceList = experienceSection.querySelector('ul');
      if (!experienceList) return;
      
      experienceList.innerHTML = ''; // Clear existing content
      
      if (this.experience.length > 0) {
        experienceSection.classList.remove('hidden');
        
        this.experience.forEach(job => {
          const li = document.createElement('li');
          li.className = 'item';
          
          li.innerHTML = `
            <div>
              <h4>${job.title}</h4>
              <p>${job.description || ''}</p>
            </div>
            <h4 class="s-date">${job.date}</h4>
          `;
          
          experienceList.appendChild(li);
        });
      } else {
        experienceSection.classList.add('hidden');
      }
    }
  
    renderAll() {
      this.renderStudies();
      this.renderProjects();
      this.renderExperience();
    }
  }
  
  // Initialize and use
  document.addEventListener('DOMContentLoaded', async () => {
    const portfolio = new PortfolioData();
    const dataLoaded = await portfolio.loadData();
    
    if (dataLoaded) {
      portfolio.renderAll();
    }
  });