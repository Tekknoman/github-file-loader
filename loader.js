// Load the JSON configuration and inject files based on the current URL pattern
async function loadFilesFromGitHubConfig(token, repoOwner, repoName, jsonFilePath) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${jsonFilePath}`;
    const currentUrl = window.location.hostname; // Current domain for pattern matching

    try {
        // Fetch the JSON configuration file
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

        // Parse the JSON content
        const config = await response.json();

        // Find matching files for the current URL pattern
        const matchingConfig = config.find(entry => currentUrl.includes(entry.urlPattern));

        if (matchingConfig) {
            console.log(`Loading files for URL pattern: ${matchingConfig.urlPattern}`);

            // Load the files specified for the matching pattern
            for (const filePath of matchingConfig.files) {
                await fetchAndInjectGitHubFile(token, repoOwner, repoName, filePath);
            }
        } else {
            console.warn('No matching URL pattern found in the configuration.');
        }
    } catch (error) {
        console.error('Error loading files from JSON config:', error);
    }
}

// Reusable function to fetch and inject a single file
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

        // Dynamic content injection based on file type
        if (filePath.endsWith('.js')) {
            const scriptElement = document.createElement('script');
            scriptElement.textContent = content;
            document.body.appendChild(scriptElement);
        } else if (filePath.endsWith('.css')) {
            const styleElement = document.createElement('style');
            styleElement.textContent = content;
            document.head.appendChild(styleElement);
        } else {
            console.log(`File type not supported for direct injection: ${filePath}`);
        }

        console.log(`Successfully loaded: ${filePath}`);
    } catch (error) {
        console.error(`Error loading file: ${filePath}`, error);
    }
}

// ✅ Example Usage (Loading config from a private GitHub repo)
const token = 'YOUR_PERSONAL_ACCESS_TOKEN';  // Use environment variables for security
const repoOwner = 'username';
const repoName = 'repo-name';
const jsonFilePath = 'config/files-config.json';

// Trigger loading based on the current URL
loadFilesFromGitHubConfig(token, repoOwner, repoName, jsonFilePath);
