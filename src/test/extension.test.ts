import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Activate Extension', async () => {
		const extension = vscode.extensions.getExtension('your.extension.id');
		if (!extension) {
			assert.fail('Extension not found');
		} else {
			await extension.activate();
			assert.ok(extension.isActive, 'Extension is not active');
		}
	});

	test('Create GitHub Repository Command', async () => {
		const createRepoCommand = vscode.commands.executeCommand('gitivity.createRepo');
		assert.ok(createRepoCommand, 'Create GitHub Repository command not found');
	});
});
