document.addEventListener('DOMContentLoaded', () => {
    const layoutTemplates = {
        minimal: {
            name: "Minimal",
            preview: "images/minimal-preview.png",
            features: ["Simple Install Button", "Basic Instructions"]
        },
        material: {
            name: "Material Design",
            preview: "images/material-preview.png",
            features: ["Material UI Components", "Platform-specific Instructions"]
        },
        modern: {
            name: "Modern",
            preview: "images/modern-preview.png",
            features: ["Animated Elements", "Dark/Light Mode"]
        },
        enterprise: {
            name: "Enterprise",
            preview: "images/enterprise-preview.png",
            features: ["Brand Guidelines Support", "Multiple Language Support"]
        }
    };

    const templatesGrid = document.querySelector('.templates-grid');
    
    Object.entries(layoutTemplates).forEach(([key, template]) => {
        const templateElement = document.createElement('div');
        templateElement.className = 'template-option';
        templateElement.innerHTML = `
            <img src="${template.preview}" alt="${template.name}">
            <h3>${template.name}</h3>
            <ul>
                ${template.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
        templatesGrid.appendChild(templateElement);
    });

    function updatePreview() {
        const appName = document.getElementById('appName').value;
        const appDescription = document.getElementById('appDescription').value;
        const primaryColor = document.getElementById('primaryColor').value;
        
        const previewFrame = document.querySelector('.preview-frame');
        const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;

        previewDocument.open();
        previewDocument.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${appName}</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background-color: #F3F4F6;
                        color: #1F2937;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        text-align: center;
                        margin: 0;
                    }
                    .container {
                        background: white;
                        padding: 2rem;
                        border-radius: 1rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        max-width: 500px;
                        width: 90%;
                    }
                    .app-icon {
                        width: 128px;
                        height: 128px;
                        margin: 0 auto 1.5rem;
                        border-radius: 24px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: ${primaryColor};
                        margin-bottom: 1rem;
                        font-size: 1.8rem;
                    }
                    p {
                        margin-bottom: 1.5rem;
                        color: #4B5563;
                    }
                    .btn {
                        background-color: ${primaryColor};
                        color: white;
                        padding: 1rem 2rem;
                        border: none;
                        border-radius: 0.5rem;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }
                    .btn:hover {
                        background-color: #818CF8;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <img src="images/icon-512x512.png" alt="${appName}" class="app-icon">
                    <h1>${appName}</h1>
                    <p>${appDescription}</p>
                    <button class="btn">Install App</button>
                </div>
            </body>
            </html>
        `);
        previewDocument.close();
    }

    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    updatePreview();
});