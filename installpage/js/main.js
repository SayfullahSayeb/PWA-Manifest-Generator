document.addEventListener('DOMContentLoaded', () => {
    const iconURLInput = document.getElementById('iconURL');
    const buttonColorInput = document.getElementById('buttonColor');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const containerColorInput = document.getElementById('containerColor');
    const headingTextInput = document.getElementById('headingText');
    const paragraphTextInput = document.getElementById('paragraphText');
    const downloadButton = document.getElementById('downloadButton');
    const copyButton = document.getElementById('copyButton');

    function generateInstallScript(buttonColor) {
        return `
            <script>
                let deferredPrompt;
                window.addEventListener('beforeinstallprompt', (e) => {
                    e.preventDefault();
                    deferredPrompt = e;
                    const installButton = document.querySelector('.install-button');
                    installButton.addEventListener('click', async () => {
                        if (deferredPrompt) {
                            deferredPrompt.prompt();
                            const { outcome } = await deferredPrompt.userChoice;
                            if (outcome === 'accepted') {
                                document.querySelector('.success-message').style.display = 'block';
                            }
                            deferredPrompt = null;
                        }
                    });
                });

                // Register Service Worker
                if ('serviceWorker' in navigator) {
                    window.addEventListener('load', () => {
                        navigator.serviceWorker.register('/sw.js')
                            .then(registration => {
                                console.log('ServiceWorker registration successful');
                            })
                            .catch(err => {
                                console.log('ServiceWorker registration failed: ', err);
                            });
                    });
                }
            </script>
        `;
    }

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
                <link rel="manifest" href="/manifest.json">
                <meta name="theme-color" content="${buttonColor}">
                <link rel="apple-touch-icon" href="${iconURL}">
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
                        transition: background-color 0.3s ease;
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
                ${generateInstallScript(buttonColor)}
            </body>
            </html>
        `);
        previewDocument.close();
    }

    // Event listeners for input changes
    iconURLInput.addEventListener('input', updatePreview);
    buttonColorInput.addEventListener('input', updatePreview);
    backgroundColorInput.addEventListener('input', updatePreview);
    containerColorInput.addEventListener('input', updatePreview);
    headingTextInput.addEventListener('input', updatePreview);
    paragraphTextInput.addEventListener('input', updatePreview);

    // Download button handler
    downloadButton.addEventListener('click', () => {
        const iconURL = iconURLInput.value || 'icon.png';
        const buttonColor = buttonColorInput.value || '#4F46E5';
        const backgroundColor = backgroundColorInput.value || '#F3F4F6';
        const containerColor = containerColorInput.value || '#FFFFFF';
        const headingText = headingTextInput.value || 'Install Our App';
        const paragraphText = paragraphTextInput.value || 'Get the best experience by installing our app on your device!';

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install Our PWA</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="${buttonColor}">
    <link rel="apple-touch-icon" href="${iconURL}">
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
            transition: background-color 0.3s ease;
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
    ${generateInstallScript(buttonColor)}
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'installation-page.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Copy button handler
    copyButton.addEventListener('click', () => {
        const iconURL = iconURLInput.value || 'icon.png';
        const buttonColor = buttonColorInput.value || '#4F46E5';
        const backgroundColor = backgroundColorInput.value || '#F3F4F6';
        const containerColor = containerColorInput.value || '#FFFFFF';
        const headingText = headingTextInput.value || 'Install Our App';
        const paragraphText = paragraphTextInput.value || 'Get the best experience by installing our app on your device!';

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install Our PWA</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="${buttonColor}">
    <link rel="apple-touch-icon" href="${iconURL}">
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
            transition: background-color 0.3s ease;
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
    ${generateInstallScript(buttonColor)}
</body>
</html>`;

navigator.clipboard.writeText(htmlContent).then(() => {
    alert('Code copied to clipboard!');
}, (err) => {
    alert('Failed to copy code: ' + err);
});
});

// Initialize the preview when the page loads
updatePreview();
});