
---

# Gitivity: A GitHub Productivity Tracker Extension for VS Code

## Description

Gitivity is a VS Code extension that boosts your productivity by monitoring file changes in your workspace and providing concise work logs and summaries. It helps developers track their progress efficiently by logging file modifications, creations, and deletions, with an optional integration to summarize these changes using the Groq API.

## Features

* **Automatic Work Log Generation** :
* Tracks file modifications, creations, and deletions.
* Generates work logs with human-readable timestamps for better traceability.
* **Groq Summarization Integration** :
* Summarizes work logs to provide concise insights into development progress.
* **GitHub Repository Creation** :
* Easily create private GitHub repositories directly from VS Code.
* **Customizable Log Interval** :
* Configure the log update interval through VS Code settings.
* **Localized Logs** :
* Displays logs with local computer time for better understanding.

## Installation Steps

### 1. **Prerequisites**

* Install [Visual Studio Code](https://code.visualstudio.com/) (version **1.96.0** or higher).
* Install [Node.js](https://nodejs.org/) and npm if not already installed.
* Obtain a [GitHub Personal Access Token (PAT)](https://github.com/settings/tokens) with the `repo` permission to enable GitHub repository creation.

### 2. **Install the Extension**

* **Option 1: Install from the VS Code Marketplace** :

1. Open the Extensions view in VS Code (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
2. Search for `Gitivity` in the search bar.
3. Click `Install` next to the **Gitivity** extension.

* **Option 2: Install from a `.vsix` File** :

1. Download the `.vsix` file for  **Gitivity** .
2. Open the Extensions view in VS Code.
3. Click the ellipsis (`...`) in the top-right corner, then select `Install from VSIX...`.
4. Browse to the downloaded `.vsix` file and install it.

### 3. **Authenticate with the Groq API (Optional)**

* If you want to enable work log summarization, obtain a Groq API key.
* Enter the API key when prompted after installing the extension or via the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).

---

## Usage

### Work Log Generation

* Open a workspace folder in VS Code.
* The extension automatically tracks file activities and logs them in a `log.txt` file within the workspace.
* Logs include file names, actions (modified, created, deleted), and timestamps.

### File Summarization

* If a Groq API key is provided, summaries of the work logs will be appended to the `log.txt` file.
* Summaries do not include suggestions or recommendations, ensuring a concise description of work activities.

### GitHub Repository Creation

* Trigger the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
* Run the `Gitivity: Create GitHub Repository` command.
* The extension uses your authenticated GitHub session to create a private repository.

---

## Commands

| Command                                | Description                                 |
| -------------------------------------- | ------------------------------------------- |
| `Gitivity: Create GitHub Repository` | Creates a new private repository on GitHub. |

---

## Configuration

### Settings

* **Log Update Interval** :
  Configure the interval at which logs are updated. This can be done by updating the extension settings in the VS Code settings menu.

### Environment Variables

* **GitHub Authentication** :
  Ensure you are authenticated with GitHub in VS Code to enable repository creation.
* **Groq API Key** :
  Add your API key when prompted to enable summarization features.

---

## File Structure

```
.
├── src/
│   ├── extension.ts         # Main extension logic
│   ├── testCompile.ts       # Auxiliary logic
│   └── test/                # Test files
├── out/                     # Compiled files
├── node_modules/            # Dependencies
├── package.json             # Extension metadata and dependencies
├── tsconfig.json            # TypeScript configuration
├── README.md                # Project documentation
└── log.txt                  # Automatically generated work logs
```

---

## Development

### Prerequisites

* Install dependencies:
  ```bash
  npm install
  ```
* Compile the TypeScript files:
  ```bash
  npm run compile
  ```

### Testing

* Run tests using the following command:
  ```bash
  npm test
  ```

### Packaging

* Package the extension into a `.vsix` file:
  ```bash
  vsce package
  ```

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## Future Enhancements

* Add a sidebar icon to enhance user experience.
* Display a UI to re-enter environment keys when required.
* Support for additional models for summarization.
* Custom time limits for saving logs.
* Options for customizing GitHub repository names.
* Daywise saving of logs.
* Generate End-of-Day (EOD) summaries using LLMs when the day finishes.

---

## License

This project is licensed under the MIT License.

---

## Contact

For support or feedback, please open an issue in the [GitHub repository](https://github.com/aqueel-softsensor/Gitivity-Extension).
