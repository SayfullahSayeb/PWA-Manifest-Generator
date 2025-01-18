// Default manifest values
const defaultManifest = {
    name: "My PWA App",
    short_name: "PWA App",
    description: "A Progressive Web Application",
    start_url: "/",
    scope: "/",
    lang: "en-US",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4CAF50",
    text_direction: "ltr",
    orientation: "any",
    category: "utilities",
    icons: [{
        purpose: "any",
        sizes: "512x512",
        src: "icon.png",
        type: "image/png"
    }]
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize time display
    initializeTimeDisplay();

    // Initialize form with default values
    initializeForm();

    // Add input event listeners to all form fields
    const formInputs = document.querySelectorAll('#manifestForm input, #manifestForm select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateManifestOutput();
            updateLivePreview();
        });
    });

    // Initial updates
    updateManifestOutput();
    updateLivePreview();
});

// Initialize time display function
function initializeTimeDisplay() {
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }

    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

// Initialize form with default values
function initializeForm() {
    Object.entries({
        'appName': defaultManifest.name,
        'shortName': defaultManifest.short_name,
        'appDescription': defaultManifest.description,
        'startUrl': defaultManifest.start_url,
        'scope': defaultManifest.scope,
        'lang': defaultManifest.lang,
        'displayMode': defaultManifest.display,
        'backgroundColor': defaultManifest.background_color,
        'themeColor': defaultManifest.theme_color,
        'textDirection': defaultManifest.text_direction,
        'displayOrientation': defaultManifest.orientation,
        'category': defaultManifest.category
    }).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });
}

// Update manifest output in real-time
function updateManifestOutput() {
    const manifest = {
        name: document.getElementById('appName').value || defaultManifest.name,
        short_name: document.getElementById('shortName').value || defaultManifest.short_name,
        description: document.getElementById('appDescription').value || defaultManifest.description,
        start_url: document.getElementById('startUrl').value || defaultManifest.start_url,
        scope: document.getElementById('scope').value || defaultManifest.scope,
        lang: document.getElementById('lang').value || defaultManifest.lang,
        display: document.getElementById('displayMode').value || defaultManifest.display,
        background_color: document.getElementById('backgroundColor').value || defaultManifest.background_color,
        theme_color: document.getElementById('themeColor').value || defaultManifest.theme_color,
        text_direction: document.getElementById('textDirection').value || defaultManifest.text_direction,
        orientation: document.getElementById('displayOrientation').value || defaultManifest.orientation,
        category: document.getElementById('category').value || defaultManifest.category,
        icons: defaultManifest.icons
    };

    document.getElementById('manifestOutput').textContent = JSON.stringify(manifest, null, 2);
}

// Update live preview
function updateLivePreview() {
    const themeColor = document.getElementById('themeColor').value || defaultManifest.theme_color;
    const backgroundColor = document.getElementById('backgroundColor').value || defaultManifest.background_color;

    document.querySelector('.mobile-status-bar').style.backgroundColor = themeColor;
    document.querySelector('.mobile-body').style.backgroundColor = backgroundColor;

    const isDarkBg = isColorDark(backgroundColor);
    document.getElementById('previewText').style.color = isDarkBg ? '#ffffff' : '#333333';
}

// Helper function to determine if a color is dark
function isColorDark(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness < 128;
}

// Handle file upload
document.getElementById('iconUrl').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const iconFile = e.target.files[0];
            resizeIcon(iconFile);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Resize icon function
function resizeIcon(iconFile) {
    const sizes = [512];
    const resizedIconsList = document.getElementById('resizedIconsList');
    resizedIconsList.innerHTML = '';

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(event) {
        img.onload = function() {
            sizes.forEach(size => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(img, 0, 0, size, size);

                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const li = document.createElement('li');
                    li.innerHTML = `${size}x${size} <a href="${url}" download="icon-${size}.png">Download</a>`;
                    resizedIconsList.appendChild(li);
                }, 'image/png');
            });
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(iconFile);
}

// Copy JSON button handler
document.getElementById('copyJsonButton').addEventListener('click', function() {
    const jsonText = document.getElementById('manifestOutput').textContent;
    navigator.clipboard.writeText(jsonText)
        .then(() => alert("Manifest JSON copied to clipboard!"))
        .catch(err => console.error('Failed to copy:', err));
});

// Download manifest button handler
document.getElementById('downloadManifest').addEventListener('click', function() {
    const manifestJson = document.getElementById('manifestOutput').textContent;
    const iconFile = document.getElementById('iconUrl').files[0];
    const zip = new JSZip();

    zip.file('manifest.json', manifestJson);
    if (iconFile) zip.file('icon.png', iconFile);

    zip.generateAsync({ type: 'blob' })
        .then(function(content) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'manifest-and-icon.zip';
            link.click();
        });
});

// Form submission handler
document.getElementById('manifestForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateManifestOutput();
    document.getElementById('downloadManifest').style.display = 'inline-block';
    document.getElementById('copyJsonButton').style.display = 'inline-block';
    document.getElementById('resizedIconsList').style.display = 'block';
});

// Listen for display mode changes
document.getElementById('displayMode').addEventListener('change', function(e) {
    updateMobilePreview(e.target.value);
});


// Dropdown functionality
function toggleInstructions() {
    const content = document.getElementById('installSteps');
    const header = document.querySelector('.dropdown-header');
    content.classList.toggle('active');
    header.classList.toggle('active');
}
