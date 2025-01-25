document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const iconURLInput = document.getElementById('iconURL');
    const buttonColorInput = document.getElementById('buttonColor');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const containerColorInput = document.getElementById('containerColor');
    const headingTextInput = document.getElementById('headingText');
    const paragraphTextInput = document.getElementById('paragraphText');
    const downloadButton = document.getElementById('downloadButton');
    const copyButton = document.getElementById('copyButton');

    // Generate styles for the installation page
function generateStyles(buttonColor, backgroundColor, containerColor, isPreview = false) {
    return `
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${backgroundColor};
            color: #1F2937;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .install-container {
            background: ${containerColor};
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 90%;
            margin: 20px;
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
            text-align: center;
            width: 100%;
        }
        p {
            margin-bottom: 1.5rem;
            color: #4B5563;
            text-align: center;
            width: 100%;
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
            display: ${isPreview ? 'block' : 'none'};
            margin: 0 auto;
            min-width: 200px;
        }
        .install-button:hover {
            opacity: 0.9;
        }
        .success-message {
            color: #10B981;
            margin-top: 1rem;
            display: none;
            text-align: center;
            width: 100%;
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
            text-align: center;
        }
        .instructions ol {
            margin-left: 1.5rem;
            padding-left: 1rem;
        }
        .instructions li {
            margin-bottom: 0.5rem;
        }`;
        
}



    // Generate installation script
    function generateInstallScript(buttonColor) {
        return `
        <script>
            let deferredPrompt;

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                
                const installButton = document.querySelector('.install-button');
                if (installButton) {
                    installButton.style.display = 'block';
                    
                    installButton.addEventListener('click', async () => {
                        if (!deferredPrompt) return;
                        
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        
                        if (outcome === 'accepted') {
                            document.querySelector('.success-message').style.display = 'block';
                        }
                        
                        deferredPrompt = null;
                    });
                }
            });

            window.addEventListener('appinstalled', (evt) => {
                console.log('PWA was installed');
                document.querySelector('.success-message').style.display = 'block';
            });

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
        </script>`;
    }

    // Generate HTML content
    function generateHTML(params, isPreview = false) {
        const {iconURL, buttonColor, backgroundColor, containerColor, headingText, paragraphText} = params;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install Our PWA</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="${buttonColor}">
    <link rel="apple-touch-icon" href="${iconURL}">
    <style>${generateStyles(buttonColor, backgroundColor, containerColor, isPreview)}</style>
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
    }

    // Update preview
    function updatePreview() {
        const params = {
            iconURL: iconURLInput.value || '../icon.png',
            buttonColor: buttonColorInput.value || '#4F46E5',
            backgroundColor: backgroundColorInput.value || '#F3F4F6',
            containerColor: containerColorInput.value || '#FFFFFF',
            headingText: headingTextInput.value || 'Install Our App',
            paragraphText: paragraphTextInput.value || 'Get the best experience by installing our app on your device!'
        };

        const previewFrame = document.querySelector('.preview-frame');
        if (previewFrame) {
            const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
            previewDocument.open();
            previewDocument.write(generateHTML(params, true));
            previewDocument.close();
        }
    }

    // Show copy notification
    function showCopyNotification() {
        const notification = document.getElementById('copyNotification');
        if (notification) {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    // Instructions popup functions
    window.showInstructions = () => {
        const popup = document.getElementById('instructionsPopup');
        if (popup) popup.classList.add('show');
    };

    window.closeInstructions = () => {
        const popup = document.getElementById('instructionsPopup');
        if (popup) popup.classList.remove('show');
    };

    // Close popup when clicking outside
    const instructionsPopup = document.getElementById('instructionsPopup');
    if (instructionsPopup) {
        instructionsPopup.addEventListener('click', (e) => {
            if (e.target.id === 'instructionsPopup') {
                closeInstructions();
            }
        });
    }

    // Add event listeners
    [iconURLInput, buttonColorInput, backgroundColorInput, containerColorInput, 
     headingTextInput, paragraphTextInput].forEach(input => {
        if (input) input.addEventListener('input', updatePreview);
    });

    // Download button handler
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            const params = {
                iconURL: iconURLInput.value || 'icon.png',
                buttonColor: buttonColorInput.value || '#4F46E5',
                backgroundColor: backgroundColorInput.value || '#F3F4F6',
                containerColor: containerColorInput.value || '#FFFFFF',
                headingText: headingTextInput.value || 'Install Our App',
                paragraphText: paragraphTextInput.value || 'Get the best experience by installing our app on your device!'
            };

            const htmlContent = generateHTML(params);
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
    }

    // Copy button handler
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const params = {
                iconURL: iconURLInput.value || 'icon.png',
                buttonColor: buttonColorInput.value || '#4F46E5',
                backgroundColor: backgroundColorInput.value || '#F3F4F6',
                containerColor: containerColorInput.value || '#FFFFFF',
                headingText: headingTextInput.value || 'Install Our App',
                paragraphText: paragraphTextInput.value || 'Get the best experience by installing our app on your device!'
            };

            navigator.clipboard.writeText(generateHTML(params))
                .then(() => {
                    showCopyNotification();
                })
                .catch((err) => {
                    alert('Failed to copy code: ' + err);
                });
        });
    }

    // Initialize preview
    updatePreview();
});