// app.js
document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        pwaUrl: document.getElementById('pwaUrl'),
        generateBtn: document.getElementById('generateBtn'),
        qrContainer: document.getElementById('qrContainer'),
        qrCode: document.getElementById('qrCode'),
        downloadQrBtn: document.getElementById('downloadQrBtn')
    };

    function generateQRCode(url) {
        if (!elements.qrCode) return;

        // Clear previous QR code
        elements.qrCode.innerHTML = '';

        // Add PWA installation parameters to URL
        const installUrl = new URL(url);
        // Add parameters that trigger PWA install prompt
        installUrl.searchParams.set('mode', 'pwa');
        installUrl.searchParams.set('source', 'qr');

        // Create QR code
        const qr = qrcode(0, 'M');
        qr.addData(installUrl.toString());
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

        // Show QR container
        elements.qrContainer.classList.remove('hidden');
    }

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
    elements.generateBtn.addEventListener('click', () => {
        const url = elements.pwaUrl.value.trim();
        
        if (!url) {
            alert('Please enter a valid PWA URL');
            return;
        }

        try {
            new URL(url); // Validate URL
            generateQRCode(url);
        } catch (e) {
            alert('Please enter a valid URL');
        }
    });

    elements.downloadQrBtn?.addEventListener('click', downloadQRCode);

    // Add Enter key support
    elements.pwaUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            elements.generateBtn.click();
        }
    });
});