import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import Groq from "groq-sdk";

let groq: Groq | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Gitivity extension is now activated!');

    // Command to create GitHub repository
    const createRepoDisposable = vscode.commands.registerCommand('gitivity.createRepo', async () => {
        try {
            console.log('Running Create GitHub Repository command...');
            const session = await vscode.authentication.getSession('github', ['repo'], { createIfNone: true });
            const token = session.accessToken;

            const response = await axios.post('https://api.github.com/user/repos', {
                name: 'gitivity-repo',
                private: true
            }, {
                headers: {
                    Authorization: `token ${token}`
                }
            });

            if (response.status === 201) {
                vscode.window.showInformationMessage('GitHub repository created successfully!');
                console.log('GitHub repository created successfully!');
            } else {
                vscode.window.showErrorMessage('Failed to create GitHub repository.');
                console.error('GitHub API response:', response.status, response.data);
            }
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unknown error occurred.');
            }
        }
    });

    context.subscriptions.push(createRepoDisposable);

    // Detect workspace folder and set log file path
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to use this extension.');
        console.error('No workspace folder detected!');
        return;
    }
    const logFilePath = path.join(workspaceFolders[0].uri.fsPath, 'log.txt');
    console.log('Log file path:', logFilePath);

    // Ensure log file exists
    try {
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '');
            console.log('Log file created successfully:', logFilePath);
        } else {
            console.log('Log file already exists:', logFilePath);
        }
    } catch (err) {
        console.error('Error creating log file:', err);
    }

    // Retrieve stored Groq API Key
    const storedApiKey = context.globalState.get<string>('groqApiKey');

    if (storedApiKey) {
        groq = new Groq({ apiKey: storedApiKey });
        console.log('Groq API Key retrieved from storage and initialized.');
    } else {
        vscode.window.showInputBox({
            prompt: 'Enter your Groq API Key to use summarization features.',
            ignoreFocusOut: true,
            password: true,
        }).then(apiKey => {
            if (apiKey) {
                context.globalState.update('groqApiKey', apiKey);
                groq = new Groq({ apiKey });
                vscode.window.showInformationMessage('Groq API Key saved successfully!');
                console.log('Groq API Key initialized and saved.');
            } else {
                vscode.window.showErrorMessage('Groq API Key is required to use summarization features.');
            }
        });
    }

    // File watcher to monitor file events
    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);
    let fileActivities: { action: string; folder: string; fileName: string; content?: string }[] = [];

    fileWatcher.onDidCreate(async uri => {
        const filePath = uri.fsPath;
        const activity = {
            action: 'created',
            folder: path.basename(path.dirname(filePath)),
            fileName: path.basename(filePath),
            content: await readFileContent(filePath)
        };
        console.log(activity);
        fileActivities.push(activity);
    });

    fileWatcher.onDidChange(async uri => {
        const filePath = uri.fsPath;
        const activity = {
            action: 'modified',
            folder: path.basename(path.dirname(filePath)),
            fileName: path.basename(filePath),
            content: await readFileContent(filePath)
        };
        console.log(activity);
        fileActivities.push(activity);
    });

    fileWatcher.onDidDelete(uri => {
        const filePath = uri.fsPath;
        const activity = {
            action: 'deleted',
            folder: path.basename(path.dirname(filePath)),
            fileName: path.basename(filePath)
        };
        console.log(activity);
        fileActivities.push(activity);
    });

    context.subscriptions.push(fileWatcher);

    const readFileContent = async (filePath: string): Promise<string | undefined> => {
        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                return content.length > 500 ? content.substring(0, 500) + '...' : content;
            }
        } catch (err) {
            console.error(`Error reading file content for ${filePath}:`, err);
        }
        return undefined;
    };

    // Generate a summary log for file activities
	const generateWorkLog = async (fileActivities: { action: string; folder: string; fileName: string; content?: string }[]): Promise<string> => {
		console.log('Generating work log...');
		
		const modifiedFiles = Array.from(new Set(fileActivities.filter(a => a.action === 'modified').map(a => a.fileName)));
		const createdFiles = Array.from(new Set(fileActivities.filter(a => a.action === 'created').map(a => a.fileName)));
		const deletedFiles = Array.from(new Set(fileActivities.filter(a => a.action === 'deleted').map(a => a.fileName)));
	
		const formattedTime = new Date().toLocaleString();
	
		let workLog = `===============================
	Work log generated at ${formattedTime}:
	\n\nModified Files: ${JSON.stringify(modifiedFiles)}
	Created Files: ${JSON.stringify(createdFiles)}
	Deleted Files: ${JSON.stringify(deletedFiles)}
	===============================`;
	
		return workLog;
	};
	

    // Summarize file activities using Groq
    const summarizeWorkLog = async (fileActivities: { action: string; folder: string; fileName: string; content?: string }[]): Promise<string> => {
        console.log('Summarizing work log using Groq...');

        try {
            if (!groq) {
                throw new Error('Groq instance is not initialized.');
            }

            const detailedLog = fileActivities.map(a => {
                const contentSnippet = a.content ? `\nContent: ${a.content}` : '';
                return `${a.action.toUpperCase()} ${a.folder}/${a.fileName}${contentSnippet}`;
            }).join('\n');

            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `Summarize the following work activities concisely without providing suggestions, recommendations, or additional information:
${detailedLog}`
                    }
                ],
                model: "llama-3.2-3b-preview"
            });

            const summary = response.choices[0]?.message?.content || 'Summary could not be generated.';
            console.log('Summary generated:', summary);
            return summary;
        } catch (err) {
            console.error('Error summarizing work log:', err);
            return 'Error generating summary.';
        }
    };

    // Append log data to the log.txt file
    const appendLogToFile = async (log: string) => {
        try {
            console.log('Appending to log file:', log);
            fs.appendFileSync(logFilePath, `${log}\n\n`);
            console.log('Log file updated successfully.');
        } catch (err) {
            console.error('Error writing to log file:', err);
        }
    };

    // Push logs to the GitHub repository
    const pushLogsToGitHub = async () => {
        try {
            console.log('Pushing logs to GitHub...');
            const session = await vscode.authentication.getSession('github', ['repo'], { createIfNone: true });
            const token = session.accessToken;

            // Read log file content and encode it
            const content = Buffer.from(fs.readFileSync(logFilePath)).toString('base64');

            // Always fetch the latest SHA before updating the file
            let sha: string | undefined;
            try {
                const response = await axios.get(
                    `https://api.github.com/repos/${session.account.label}/gitivity-repo/contents/log.txt`,
                    {
                        headers: {
                            Authorization: `token ${token}`,
                        },
                    }
                );
                sha = response.data.sha; // Extract the file's latest SHA
                console.log('Fetched existing file SHA:', sha);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
                    console.log('File does not exist in the repository. Creating a new file.');
                    sha = undefined; // File doesn't exist, no SHA required
                } else {
                    console.error('Error checking file existence:', err);
                    throw err;
                }
            }

            // Upload or update the log file
            await axios.put(
                `https://api.github.com/repos/${session.account.label}/gitivity-repo/contents/log.txt`,
                {
                    message: 'Update log.txt',
                    content,
                    sha, // Include SHA if updating an existing file
                },
                {
                    headers: {
                        Authorization: `token ${token}`,
                    },
                }
            );

            vscode.window.showInformationMessage('Logs pushed to GitHub successfully!');
            console.log('Logs pushed to GitHub successfully!');
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error pushing logs to GitHub: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unknown error occurred while pushing logs to GitHub.');
            }
            console.error('Error pushing logs to GitHub:', error);
        }
    };

    // Periodically update the log file and push to GitHub
    const intervalMinutes = 30; // Configurable interval in minutes
    setInterval(async () => {
        if (fileActivities.length > 0) {
            console.log('Updating logs...');
            const log = await generateWorkLog(fileActivities);
            const summary = await summarizeWorkLog(fileActivities);
            const combinedLog = `${log}\n\nSummary:\n${summary}`;
            await appendLogToFile(combinedLog);
            await pushLogsToGitHub();
            fileActivities = [];
        }
    }, intervalMinutes * 60 * 1000);
}

export function deactivate() {
    console.log('Deactivating Gitivity extension...');
}
