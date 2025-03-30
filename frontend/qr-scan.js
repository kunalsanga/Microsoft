document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const result = document.getElementById('result');
    const previewContainer = document.getElementById('previewContainer');
    const scannedImage = document.getElementById('scannedImage');
    const qrContent = document.getElementById('qrContent');
    let stream = null;
    let scanning = true; // Start with scanning enabled
    let lastScannedCode = null;

    // Request camera access
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            video.srcObject = stream;
            
            // Start scanning when video is ready
            video.addEventListener('loadedmetadata', function() {
                video.play();
                requestAnimationFrame(scanQRCode);
            });
        } catch (err) {
            result.textContent = 'Error accessing camera. Please make sure you have granted camera permissions.';
            console.error('Error accessing camera:', err);
        }
    }

    // Scan for QR codes
    function scanQRCode() {
        if (!scanning) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                // QR code found
                lastScannedCode = code;
                result.textContent = `QR Code detected: ${code.data}`;
                result.style.color = '#27ae60';
                showPreview(code);
            } else {
                // No QR code found, continue scanning
                result.textContent = 'Scanning for QR code...';
                result.style.color = '#2c3e50';
            }
            // Continue scanning regardless of whether a code was found
            requestAnimationFrame(scanQRCode);
        } else {
            // Video not ready yet, try again
            requestAnimationFrame(scanQRCode);
        }
    }

    // Show preview of scanned QR code
    function showPreview(code) {
        scannedImage.src = canvas.toDataURL('image/png');
        qrContent.textContent = code.data;
        previewContainer.style.display = 'block';
    }

    // Start scanning
    function startScanning() {
        scanning = true;
        result.textContent = 'Scanning for QR code...';
        result.style.color = '#2c3e50';
        previewContainer.style.display = 'none';
        startCamera(); // Restart camera when starting new scan
    }

    // Stop camera stream
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            video.srcObject = null;
        }
    }

    // Event listeners
    captureBtn.addEventListener('click', function() {
        if (!scanning) {
            startScanning();
            captureBtn.textContent = 'Stop Scanning';
        } else {
            scanning = false;
            captureBtn.textContent = 'Capture QR Code';
            result.textContent = 'Position the QR code within the frame';
            result.style.color = '#2c3e50';
            if (lastScannedCode) {
                showPreview(lastScannedCode);
            }
        }
    });

    // Start camera and scanning when page loads
    startCamera();
}); 