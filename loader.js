// Fetch and load multiple files from a private GitHub repository
async function fetchAndInjectMultipleGitHubFiles(token, repoOwner, repoName, files) {
    for (const file of files) {
        const { filePath, elementId } = file;
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.statusText}`);
            }

            const content = await response.text();
            
            // Dynamically inject based on file type
            if (filePath.endsWith('.js')) {
                const scriptElement = document.createElement('script');
                scriptElement.textContent = content;
                document.body.appendChild(scriptElement);
            } 
            else if (filePath.endsWith('.css')) {
                const styleElement = document.createElement('style');
                styleElement.textContent = content;
                document.head.appendChild(styleElement);
            } 
            else {
                // Default: Inject content into a specified HTML element
                if (elementId) {
                    const targetElement = document.getElementById(elementId);
                    if (targetElement) {
                        targetElement.textContent = content;
                    } else {
                        console.warn(`Element with ID "${elementId}" not found.`);
                    }
                } else {
                    console.warn(`Element ID is missing for file: ${filePath}`);
                }
            }

            console.log(`File ${filePath} successfully loaded.`);
        } catch (error) {
            console.error(`Error fetching the file ${filePath}:`, error);
        }
    }
}

// Example Usage: Provide multiple files and their target element IDs
const token = 'YOUR_PERSONAL_ACCESS_TOKEN'; // Replace with a secure token handling method
const repoOwner = 'username';
const repoName = 'repo-name';

const filesToLoad = [
    { filePath: 'scripts/app.js' }, // JavaScript will auto-load as a script tag
    { filePath: 'styles/main.css' }, // CSS will auto-load as a style tag
    { filePath: 'docs/readme.md', elementId: 'readme-container' }, // Inject as text content
    { filePath: 'data/config.json', elementId: 'config-area' } // Inject JSON as text content
];

// Fetch and inject multiple files
fetchAndInjectMultipleGitHubFiles(token, repoOwner, repoName, filesToLoad);
