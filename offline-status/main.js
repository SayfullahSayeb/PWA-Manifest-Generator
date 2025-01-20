function updatePreview() {
  const title = document.getElementById('pageTitle').value;
  const bgColor = document.getElementById('backgroundColor').value;
  const heading = document.getElementById('heading').value;
  const headingColor = document.getElementById('headingColor').value;
  const paragraph = document.getElementById('paragraph').value;
  const paragraphColor = document.getElementById('paragraphColor').value;
  const buttonText = document.getElementById('buttonText').value;
  const buttonColor = document.getElementById('buttonColor').value;
  const buttonHoverColor = document.getElementById('buttonHoverColor').value;

  const html = generatePreviewHTML(title, bgColor, heading, headingColor, paragraph, paragraphColor, buttonText, buttonColor, buttonHoverColor);
  const frame = document.getElementById('preview-frame');
  frame.contentDocument.open();
  frame.contentDocument.write(html);
  frame.contentDocument.close();
}

function generatePreviewHTML(title, bgColor, heading, headingColor, paragraph, paragraphColor, buttonText, buttonColor, buttonHoverColor) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow-x: hidden;
            font-family: system-ui, sans-serif;
            background: ${bgColor};
        }
        body {
            display: grid;
            place-items: center;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        .network-icon {
            position: relative;
            display: inline-flex;
            margin: 1rem 0 2rem;
        }
        .signal {
            display: flex;
            align-items: flex-end;
            gap: 3px;
            height: 45px;
        }
        .bar {
            width: 6px;
            background: #ddd;
            border-radius: 1px;
            animation: pulse 2s infinite;
        }
        .bar-1 { height: 12px; }
        .bar-2 { height: 20px; animation-delay: .2s; }
        .bar-3 { height: 28px; animation-delay: .4s; }
        .bar-4 { height: 36px; animation-delay: .6s; }
        .alert {
            position: absolute;
            bottom: -5px;
            right: -10px;
            width: 14px;
            height: 14px;
            background: #ff3b30;
            border-radius: 50%;
            color: #fff;
            font-size: 11px;
            font-weight: bold;
            display: grid;
            place-items: center;
        }
        h1, p {
            margin: 0 0 .5rem;
        }
        h1 {
            color: ${headingColor};
            font-size: 1.5rem;
            font-weight: 600;
        }
        p {
            color: ${paragraphColor};
            margin-bottom: 2rem;
            font-size: 1rem;
        }
        button {
            background: ${buttonColor};
            color: #fff;
            border: none;
            padding: .8rem 2rem;
            border-radius: 25px;
            font-size: .9rem;
            font-weight: 500;
            cursor: pointer;
            transition: .2s;
        }
        button:hover {
            background: ${buttonHoverColor};
            transform: translateY(-1px);
        }
        @keyframes pulse {
            0%, 100% { opacity: .3; }
            50% { opacity: .8; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="network-icon">
            <div class="signal">
                <div class="bar bar-1"></div>
                <div class="bar bar-2"></div>
                <div class="bar bar-3"></div>
                <div class="bar bar-4"></div>
            </div>
            <div class="alert">!</div>
        </div>
        <h1>${heading}</h1>
        <p>${paragraph}</p>
        <button onclick="location.reload()">${buttonText}</button>
    </div>
</body>
</html>`;
}

function generateHTML() {
  const title = document.getElementById('pageTitle').value;
  const bgColor = document.getElementById('backgroundColor').value;
  const heading = document.getElementById('heading').value;
  const headingColor = document.getElementById('headingColor').value;
  const paragraph = document.getElementById('paragraph').value;
  const paragraphColor = document.getElementById('paragraphColor').value;
  const buttonText = document.getElementById('buttonText').value;
  const buttonColor = document.getElementById('buttonColor').value;
  const buttonHoverColor = document.getElementById('buttonHoverColor').value;

  const html = generatePreviewHTML(title, bgColor, heading, headingColor, paragraph, paragraphColor, buttonText, buttonColor, buttonHoverColor);

  const blob = new Blob([html], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html` || 'offline-page.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function copyCode() {
  const title = document.getElementById('pageTitle').value;
  const bgColor = document.getElementById('backgroundColor').value;
  const heading = document.getElementById('heading').value;
  const headingColor = document.getElementById('headingColor').value;
  const paragraph = document.getElementById('paragraph').value;
  const paragraphColor = document.getElementById('paragraphColor').value;
  const buttonText = document.getElementById('buttonText').value;
  const buttonColor = document.getElementById('buttonColor').value;
  const buttonHoverColor = document.getElementById('buttonHoverColor').value;

  const html = generatePreviewHTML(title, bgColor, heading, headingColor, paragraph, paragraphColor, buttonText, buttonColor, buttonHoverColor);

  navigator.clipboard.writeText(html).then(() => {
    const copyBtn = document.querySelector('.btn-copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Add event listeners for real-time preview
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', updatePreview);
});

// Initial preview
document.addEventListener('DOMContentLoaded', updatePreview);
