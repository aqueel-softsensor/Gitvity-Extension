
# Gitivity: A GitHub Productivity Tracker Extension for VS Code

## Description

Gitivity is a VS Code extension that boosts your productivity by monitoring file changes in your workspace and providing concise work logs and summaries. It helps developers track their progress efficiently by logging file modifications, creations, and deletions, with an optional integration to summarize these changes using the Groq API.

## Features

- **Automatic Work Log Generation**:
  - Tracks file modifications, creations, and deletions.
  - Generates work logs with human-readable timestamps for better traceability.
- **Groq Summarization Integration**:
  - Summarizes work logs to provide concise insights into development progress.
- **GitHub Repository Creation**:
  - Easily create private GitHub repositories directly from VS Code.
- **Customizable Log Interval**:
  - Configure the log update interval through VS Code settings.
- **Localized Logs**:
  - Displays logs with local computer time for better understanding.

## Installation

1. Ensure you have the following prerequisites:
   - Visual Studio Code v1.96.0 or higher
   - Node.js and npm installed
   - A GitHub Personal Access Token (PAT) with `repo` permissions
2. Install the extension:
   - Download the `.vsix` file of this extension.
   - Open VS Code and install it via `Extensions > Install from VSIX...`.
3. Authenticate with your Groq API key (optional for summarization):
   - Enter your Groq API key in the input box when prompted.

## Usage

### Work Log Generation

- Open a workspace folder in VS Code.
- The extension automatically tracks file activities and logs them in a `log.txt` file within the workspace.
- Logs include file names, actions (modified, created, deleted), and timestamps.

### File Summarization

- If a Groq API key is provided, summaries of the work logs will be appended to the `log.txt` file.
- Summaries do not include suggestions or recommendations, ensuring a concise description of work activities.

### GitHub Repository Creation

- Trigger the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
- Run the `Gitivity: Create GitHub Repository` command.
- The extension uses your authenticated GitHub session to create a private repository.

## Commands

| Command                                | Description                                 |
| -------------------------------------- | ------------------------------------------- |
| `Gitivity: Create GitHub Repository` | Creates a new private repository on GitHub. |

## Configuration

### Settings

- **Log Update Interval**:
  Configure the interval at which logs are updated. This can be done by updating the extension settings in the VS Code settings menu.

### Environment Variables

- **GitHub Authentication**:
  Ensure you are authenticated with GitHub in VS Code to enable repository creation.
- **Groq API Key**:
  Add your API key when prompted to enable summarization features.

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

## Development

### Prerequisites

- Install dependencies:
  ```bash
  npm install
  ```
- Compile the TypeScript files:
  ```bash
  npm run compile
  ```

### Testing

- Run tests using the following command:
  ```bash
  npm test
  ```

### Packaging

- Package the extension into a `.vsix` file:
  ```bash
  vsce package
  ```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.

---

## Contact

For support or feedback, please open an issue in the [GitHub repository](https://github.com/aqueel-softsensor/Gitvity-Extension).
