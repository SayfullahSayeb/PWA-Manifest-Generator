// Default manifest values
const defaultManifest = {
    id: "",
    name: "",
    short_name: "",
    description: "",
    start_url: "/",
    scope: "/",
    lang: "en-US",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4CAF50",
    dir: "auto",
    orientation: "any",
    category: "utilities",
    screenshots: [],
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

    // Update time immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
}

// Initialize form with default values
function initializeForm() {
    Object.entries({
        'appId': defaultManifest.id,
        'startUrl': defaultManifest.start_url,
        'scope': defaultManifest.scope,
        'lang': defaultManifest.lang,
        'displayMode': defaultManifest.display,
        'backgroundColor': defaultManifest.background_color,
        'themeColor': defaultManifest.theme_color,
        'textDirection': defaultManifest.dir,
        'displayOrientation': defaultManifest.orientation,
        'category': defaultManifest.category
    }).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element && value) element.value = value;
    });
}

// Handle icon upload
document.getElementById('iconUrl').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        const iconPreview = document.getElementById('iconPreview');
        
        reader.onload = function(e) {
            iconPreview.innerHTML = `
                <img src="${e.target.result}" alt="Icon Preview">
            `;
            iconPreview.classList.add('active');
            updateManifestOutput(); // Update manifest immediately
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Handle screenshots
let screenshotFiles = []; // Array to store screenshot files

function handleScreenshots(newFiles) {
    const screenshotsList = document.getElementById('screenshotsList');
    
    // Add new files to existing array
    Array.from(newFiles).forEach(file => {
        if (!screenshotFiles.some(f => f.name === file.name)) {
            screenshotFiles.push(file);
        }
    });
    
    // Clear and rebuild preview
    screenshotsList.innerHTML = '';
    
    screenshotFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'screenshot-preview';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Screenshot ${index + 1}">
                <button class="remove-screenshot" data-index="${index}" onclick="removeScreenshot(${index})">×</button>
            `;
            screenshotsList.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
    
    updateManifestOutput(); // Update manifest immediately
}

// Remove screenshot
function removeScreenshot(index) {
    screenshotFiles.splice(index, 1); // Remove file from array
    handleScreenshots([]); // Rebuild preview
}

// Get screenshots list for manifest
function getScreenshotsList() {
    return screenshotFiles.map((file, index) => ({
        src: `screenshot-${index + 1}${file.name.substr(file.name.lastIndexOf('.'))}`,
        sizes: "1280x720",
        type: file.type
    }));
}

// Update manifest output in real-time
function updateManifestOutput() {
    const manifest = {
        id: document.getElementById('appId').value,
        name: document.getElementById('appName').value,
        short_name: document.getElementById('shortName').value,
        description: document.getElementById('appDescription').value,
        start_url: document.getElementById('startUrl').value || defaultManifest.start_url,
        scope: document.getElementById('scope').value || defaultManifest.scope,
        lang: document.getElementById('lang').value || defaultManifest.lang,
        display: document.getElementById('displayMode').value || defaultManifest.display,
        background_color: document.getElementById('backgroundColor').value || defaultManifest.background_color,
        theme_color: document.getElementById('themeColor').value || defaultManifest.theme_color,
        dir: document.getElementById('textDirection').value,
        orientation: document.getElementById('displayOrientation').value || defaultManifest.orientation,
        category: document.getElementById('category').value,
        screenshots: getScreenshotsList(),
        icons: defaultManifest.icons
    };

    // Remove empty fields
    Object.keys(manifest).forEach(key => {
        if (manifest[key] === "" || 
            (Array.isArray(manifest[key]) && manifest[key].length === 0)) {
            delete manifest[key];
        }
    });

    document.getElementById('manifestOutput').textContent = JSON.stringify(manifest, null, 2);
}

// Update live preview
function updateLivePreview() {
    const themeColor = document.getElementById('themeColor').value || defaultManifest.theme_color;
    const backgroundColor = document.getElementById('backgroundColor').value || defaultManifest.background_color;

    document.querySelector('.mobile-status-bar').style.backgroundColor = themeColor;
    document.querySelector('.mobile-body').style.backgroundColor = backgroundColor;

    const previewText = document.getElementById('previewText');
    previewText.textContent = 'Your App Content Here';

    const isDarkBg = isColorDark(backgroundColor);
    previewText.style.color = isDarkBg ? '#ffffff' : '#333333';
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

// Handle screenshots upload
document.getElementById('screenshots').addEventListener('change', function(e) {
    handleScreenshots(e.target.files);
});

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

    // Add screenshots
    screenshotFiles.forEach((file, index) => {
        zip.file(`screenshot-${index + 1}${file.name.substr(file.name.lastIndexOf('.'))}`, file);
    });

    zip.generateAsync({ type: 'blob' })
        .then(function(content) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'manifest-and-assets.zip';
            link.click();
        });
});

// Form submission handler
document.getElementById('manifestForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateManifestOutput();
    document.getElementById('downloadManifest').style.display = 'inline-block';
    document.getElementById('copyJsonButton').style.display = 'inline-block';
});

// Drag and drop handlers for file uploads
['iconUrl', 'screenshots'].forEach(id => {
    const container = document.getElementById(id).closest('.file-upload-container');
    
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('drag-over');
    });

    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
        const input = document.getElementById(id);
        const dt = e.dataTransfer;
        input.files = dt.files;
        
        if (id === 'screenshots') {
            handleScreenshots(dt.files);
        } else {
            const event = new Event('change');
            input.dispatchEvent(event);
        }
        updateManifestOutput();
    });
});

// Dropdown functionality
function toggleInstructions() {
    const content = document.getElementById('installSteps');
    const header = document.querySelector('.dropdown-header');
    content.classList.toggle('active');
    header.classList.toggle('active');
}