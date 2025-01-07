// Load multiple files from multiple repositories with regex-based URL pattern matching
async function loadFilesFromGitHubConfig(token, repoOwner, jsonFilePath) {
    const url = `https://api.github.com/repos/${repoOwner}/${jsonFilePath}`;
    const currentUrl = window.location.hostname;

    try {
        // Fetch the JSON config file
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        });

        if (!response.ok) {
            throw new Error(`Error loading JSON config: ${response.statusText}`);
        }

        // Parse the configuration
        const config = await response.json();

        // Find matching entries using regex
        const matchingConfig = config.find(entry => 
            new RegExp(entry.urlPattern).test(currentUrl)
        );

        if (matchingConfig) {
            console.log(`Loading files for pattern: ${matchingConfig.urlPattern}`);
            
            // Loop through each repo and load specified files
            for (const repoEntry of matchingConfig.files) {
                for (const filePath of repoEntry.paths) {
                    await fetchAndInjectGitHubFile(token, repoOwner, repoEntry.repo, filePath);
                }
            }
        } else {
            console.warn('No matching URL pattern found in the configuration.');
        }
    } catch (error) {
        console.error('Error loading files from JSON config:', error);
    }
}

// Fetch and inject a file from a specified repository
async function fetchAndInjectGitHubFile(token, repoOwner, repoName, filePath) {
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
            throw new Error(`Error fetching the file: ${response.statusText}`);
        }

        const content = await response.text();

        // Inject file content dynamically based on file type
        if (filePath.endsWith('.js')) {
            const scriptElement = document.createElement('script');
            scriptElement.textContent = content;
            document.body.appendChild(scriptElement);
        } else if (filePath.endsWith('.css')) {
            const styleElement = document.createElement('style');
            styleElement.textContent = content;
            document.head.appendChild(styleElement);
        } else {
            console.warn(`Unsupported file type for injection: ${filePath}`);
        }

        console.log(`Successfully loaded: ${filePath}`);
    } catch (error) {
        console.error(`Error loading file from repo ${repoName}: ${filePath}`, error);
    }
}

// ✅ Example Usage:
const token = 'YOUR_PERSONAL_ACCESS_TOKEN';  // Replace with a secure handling method
const repoOwner = 'username';
const jsonFilePath = 'config/files-config.json';

// Trigger file loading based on the current URL and the JSON config
loadFilesFromGitHubConfig(token, repoOwner, jsonFilePath);
