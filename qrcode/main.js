document.addEventListener('DOMContentLoaded', function() {
    const qrButton = document.getElementById('qr-button');
    const qrPopup = document.getElementById('qr-popup');
    const closePopup = document.getElementById('close-popup');
    const qrText = document.getElementById('qr-text');
    const qrCodeDiv = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('download-btn');
    
    let qrCode = null;

    // Toggle popup
    qrButton.addEventListener('click', () => {
        qrPopup.classList.add('active');
    });

    closePopup.addEventListener('click', () => {
        qrPopup.classList.remove('active');
    });

    // Generate QR Code when text is entered
    qrText.addEventListener('input', () => {
        const text = qrText.value.trim();
        
        // Clear previous QR code
        qrCodeDiv.innerHTML = '';
        
        if (text) {
            // Create new QR code
            qrCode = new QRCode(qrCodeDiv, {
                text: text,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            downloadBtn.disabled = false;
        } else {
            qrCode = null;
            downloadBtn.disabled = true;
        }
    });

    // Download QR Code
    downloadBtn.addEventListener('click', () => {
        if (!qrCode) return;

        // Get the QR code image
        const qrCanvas = qrCodeDiv.querySelector('canvas');
        
        // Create a temporary link
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = qrCanvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!qrPopup.contains(e.target) && !qrButton.contains(e.target)) {
            qrPopup.classList.remove('active');
        }
    });
});