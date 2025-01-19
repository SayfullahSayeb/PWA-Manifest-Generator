document.addEventListener('DOMContentLoaded', () => {

    const iconURLInput = document.getElementById('iconURL');
    const buttonColorInput = document.getElementById('buttonColor');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const containerColorInput = document.getElementById('containerColor');
    const headingTextInput = document.getElementById('headingText');
    const paragraphTextInput = document.getElementById('paragraphText');

    function updatePreview() {
        const iconURL = iconURLInput.value || 'icon.png';
        const buttonColor = buttonColorInput.value || '#4F46E5';
        const backgroundColor = backgroundColorInput.value || '#F3F4F6';
        const containerColor = containerColorInput.value || '#FFFFFF';
        const headingText = headingTextInput.value || 'Install Our App';
        const paragraphText = paragraphTextInput.value || 'Get the best experience by installing our app on your device!';

        const previewFrame = document.querySelector('.preview-frame');
        const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;

        previewDocument.open();
        previewDocument.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Install Our PWA</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background-color: ${backgroundColor};
                        color: #1F2937;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .install-container {
                        background: ${containerColor};
                        padding: 2rem;
                        border-radius: 1rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 500px;
                        width: 90%;
                    }
                    .app-icon {
                        width: 128px;
                        height: 128px;
                        margin-bottom: 1.5rem;
                        border-radius: 24px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        margin-bottom: 1rem;
                        color: ${buttonColor};
                        font-size: 1.8rem;
                    }
                    p {
                        margin-bottom: 1.5rem;
                        color: #4B5563;
                    }
                    .install-button {
                        background-color: ${buttonColor};
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 0.5rem;
                        font-size: 1.1rem;
                        cursor: pointer;
                    }
                    .install-button:hover {
                        background-color: #6366F1;
                    }
                    .success-message {
                        color: #10B981;
                        margin-top: 1rem;
                        display: none;
                    }
                    .instructions {
                        margin-top: 2rem;
                        padding: 1rem;
                        background-color: #F3F4F6;
                        border-radius: 0.5rem;
                        text-align: left;
                    }
                    .instructions h2 {
                        font-size: 1.2rem;
                        margin-bottom: 0.5rem;
                        color: ${buttonColor};
                    }
                    .instructions ol {
                        margin-left: 1.5rem;
                    }
                    .instructions li {
                        margin-bottom: 0.5rem;
                    }
                </style>
            </head>
            <body>
                <div class="install-container">
                    <img src="${iconURL}" alt="App Icon" class="app-icon">
                    <h1>${headingText}</h1>
                    <p>${paragraphText}</p>
                    <button class="install-button">Install App</button>
                    <p class="success-message">✅ Installation started! Follow your browser's instructions.</p>
                    <div class="instructions">
                        <h2>Installation Instructions</h2>
                        <ol>
                            <li>Click the install button above, or</li>
                            <li>Click the install icon in your browser's address bar</li>
                        </ol>
                    </div>
                </div>
            </body>
            </html>
        `);
        previewDocument.close();
    }

    iconURLInput.addEventListener('input', updatePreview);
    buttonColorInput.addEventListener('input', updatePreview);
    backgroundColorInput.addEventListener('input', updatePreview);
    containerColorInput.addEventListener('input', updatePreview);
    headingTextInput.addEventListener('input', updatePreview);
    paragraphTextInput.addEventListener('input', updatePreview);

    updatePreview();
});