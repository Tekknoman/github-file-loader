# GitHub File Loader

This project provides a JavaScript-based solution for dynamically loading files from a **private GitHub repository** based on URL patterns specified in a JSON configuration file.

## Features
- ✅ **Private Repo Access:** Uses a personal access token (PAT) for secure file fetching.
- ✅ **JSON Configuration:** Files to be loaded are defined in a `files-config.json` stored in the repository.
- ✅ **URL Matching:** Files are loaded only if the current domain matches a specified URL pattern.
- ✅ **Automatic Injection:** Injects JavaScript and CSS files directly into the webpage.
- ✅ **Multiple Files Support:** Supports loading multiple files for a given URL pattern.

---

## 📁 Repository Structure Example
```plaintext
repo/
├── config/
│   └── files-config.json   # JSON with file mappings and URL patterns
├── scripts/
│   └── file1.js
│   └── file2.js
└── styles/
    └── style.css
```

## 📜 `files-config.json` Example
```json
[
    {
        "files": ["scripts/file1.js", "styles/style.css"],
        "urlPattern": "google.com"
    },
    {
        "files": ["scripts/file2.js"],
        "urlPattern": "example.com"
    }
]
```

---

## 🚀 How to Use
1. **Add the JavaScript Code:** Include the provided JavaScript code in your project.
2. **Set the Token and Repo Info:** Update the `token`, `repoOwner`, `repoName`, and `jsonFilePath` variables.
3. **Host Files on GitHub:** Upload the files you want to load in the specified repo structure.
4. **Match URL Pattern:** The script will automatically detect the current domain and load matching files.

### ✅ Example Usage
```javascript
const token = 'YOUR_PERSONAL_ACCESS_TOKEN';
const repoOwner = 'username';
const repoName = 'repo-name';
const jsonFilePath = 'config/files-config.json';

loadFilesFromGitHubConfig(token, repoOwner, repoName, jsonFilePath);
```

---

## 🔒 Security Considerations
- **Do not expose your personal access token (PAT) in frontend code.**
- Consider using a **server-side proxy** for handling secure API requests.
- Use **fine-grained GitHub tokens** with minimal permissions for better security.

---

## 📦 Requirements
- Modern Web Browser (Supports `fetch` API)
- GitHub Personal Access Token (PAT) with `repo` access

---

## 📄 License
This project is licensed under the MIT License.

---

## 📞 Contact
For support or questions, please reach out via the repository's **Issues** section.
