// Load files from multiple repositories, branches, and handle regex for URL patterns
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

        const config = await response.json();

        // Match the URL using regex
        const matchingConfig = config.find(entry => 
            new RegExp(entry.urlPattern).test(currentUrl)
        );

        if (matchingConfig) {
            console.log(`Loading files for pattern: ${matchingConfig.urlPattern}`);
            
            // Load files from multiple repositories and branches
            for (const repoEntry of matchingConfig.files) {
                for (const filePath of repoEntry.paths) {
                    await fetchAndInjectGitHubFile(token, repoOwner, repoEntry.repo, repoEntry.branch, filePath);
                }
            }
        } else {
            console.warn('No matching URL pattern found in the configuration.');
        }
    } catch (error) {
        console.error('Error loading files from JSON config:', error);
    }
}

// Fetch and inject a file from a specific repository and branch
async function fetchAndInjectGitHubFile(token, repoOwner, repoName, branch, filePath) {
    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${filePath}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching file from ${repoName}/${branch}: ${response.statusText}`);
        }

        const content = await response.text();

        // Inject content based on file type
        if (filePath.endsWith('.js')) {
            const scriptElement = document.createElement('script');
            scriptElement.textContent = content;
            document.body.appendChild(scriptElement);
        } else if (filePath.endsWith('.css')) {
            const styleElement = document.createElement('style');
            styleElement.textContent = content;
            document.head.appendChild(styleElement);
        } else {
            console.warn(`Unsupported file type: ${filePath}`);
        }

        console.log(`Successfully loaded: ${filePath} from branch: ${branch}`);
    } catch (error) {
        console.error(`Error loading file: ${filePath}`, error);
    }
}

// ✅ Example Usage
const token = 'YOUR_PERSONAL_ACCESS_TOKEN';  // Ensure secure storage in production
const repoOwner = 'username';
const jsonFilePath = 'config/files-config.json';

// Load files from the provided config
loadFilesFromGitHubConfig(token, repoOwner, jsonFilePath);
