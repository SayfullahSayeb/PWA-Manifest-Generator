// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const elements = {
        currentUrl: document.getElementById('currentUrl'),
        qrCode: document.getElementById('qrCode'),
        downloadQrBtn: document.getElementById('downloadQrBtn')
    };

    // Get current URL
    const currentUrl = window.location.href;
    
    // Display current URL
    if (elements.currentUrl) {
        elements.currentUrl.textContent = currentUrl;
    }

    // Generate QR Code
    function generateQRCode() {
        if (!elements.qrCode) return;

        // Clear previous QR code
        elements.qrCode.innerHTML = '';

        // Create QR code
        const qr = qrcode(0, 'M');
        qr.addData(currentUrl);
        qr.make();

        // Create QR code image
        const qrImage = qr.createImgTag(10);
        elements.qrCode.innerHTML = qrImage;

        // Add ID to the generated image
        const img = elements.qrCode.querySelector('img');
        if (img) {
            img.id = 'qrCodeImage';
            img.classList.add('mx-auto');
        }
    }

    // Download QR Code
    function downloadQRCode() {
        const img = document.getElementById('qrCodeImage');
        if (!img) return;

        // Create canvas for better quality download
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Create download link
        const link = document.createElement('a');
        link.download = 'pwa-install-qr.png';
        link.href = canvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Add event listeners
    if (elements.downloadQrBtn) {
        elements.downloadQrBtn.addEventListener('click', downloadQRCode);
    }

    // Generate QR code on page load
    generateQRCode();
});