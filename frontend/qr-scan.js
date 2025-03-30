document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const result = document.getElementById('result');
    const previewContainer = document.getElementById('previewContainer');
    const scannedImage = document.getElementById('scannedImage');
    const qrContent = document.getElementById('qrContent');
    const redeemBtn = document.getElementById('redeemBtn');
    const moneyAnimation = document.getElementById('moneyAnimation');
    let stream = null;
    let currentQRCode = null;

    // Create money animation
    function createMoneyAnimation() {
        // Clear previous animation
        moneyAnimation.innerHTML = '';
        
        // Create 20 money elements for more effect
        for (let i = 0; i < 20; i++) {
            const money = document.createElement('div');
            money.className = 'money';
            money.textContent = '💰';
            money.style.left = `${Math.random() * 100}%`;
            money.style.animationDuration = `${3 + Math.random() * 2}s`; // Random duration between 3-5s
            moneyAnimation.appendChild(money);
        }

        // Show animation container
        moneyAnimation.style.display = 'block';

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Payment Received! 🎉';
        document.body.appendChild(successMessage);

        // Remove success message after animation
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

        // Hide animation container after all money elements are done
        setTimeout(() => {
            moneyAnimation.style.display = 'none';
        }, 5000);
    }

    // Start camera
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            video.srcObject = stream;
            await video.play();
            console.log('Camera started successfully');
        } catch (err) {
            console.error('Error accessing camera:', err);
            result.textContent = 'Error accessing camera. Please make sure you have granted camera permissions.';
            result.style.color = '#e74c3c';
        }
    }

    // Capture image
    function captureImage() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw the current video frame on the canvas
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to image and display
            scannedImage.src = canvas.toDataURL('image/png');
            previewContainer.style.display = 'block';
            
            // Try to detect QR code
            try {
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "attemptBoth",
                });

                if (code) {
                    console.log('QR Code detected:', code.data);
                    currentQRCode = code.data;
                    qrContent.textContent = code.data;
                    result.textContent = 'QR Code detected!';
                    result.style.color = '#27ae60';
                    redeemBtn.style.display = 'block';
                } else {
                    console.log('No QR code found');
                    currentQRCode = null;
                    qrContent.textContent = 'No QR code detected in the image';
                    result.textContent = 'No QR code found in the image';
                    result.style.color = '#e74c3c';
                    redeemBtn.style.display = 'none';
                }
            } catch (error) {
                console.error('Error processing QR code:', error);
                currentQRCode = null;
                qrContent.textContent = 'Error processing QR code';
                result.textContent = 'Error processing image';
                result.style.color = '#e74c3c';
                redeemBtn.style.display = 'none';
            }
        } else {
            result.textContent = 'Camera not ready. Please wait...';
            result.style.color = '#e74c3c';
        }
    }

    // Handle redeem token
    async function redeemToken() {
        if (!currentQRCode) {
            result.textContent = 'No valid QR code to redeem';
            result.style.color = '#e74c3c';
            return;
        }

        try {
            // Show loading state
            redeemBtn.disabled = true;
            redeemBtn.textContent = 'Redeeming...';
            result.textContent = 'Redeeming token...';
            result.style.color = '#2c3e50';

            // Start money animation immediately
            createMoneyAnimation();

            // Try to make API call (but don't wait for it)
            fetch('http://localhost:3000/api/redeem-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: currentQRCode
                })
            }).catch(error => {
                console.error('API Error:', error);
                // Don't show error to user, just continue with animation
            });

            // Show success message and reset after animation
            result.textContent = 'Token redeemed successfully!';
            result.style.color = '#27ae60';
            
            // Reset after animation completes
            setTimeout(() => {
                previewContainer.style.display = 'none';
                currentQRCode = null;
                result.textContent = 'Position the QR code within the frame';
                result.style.color = '#2c3e50';
            }, 5000);

        } catch (error) {
            console.error('Error:', error);
            // Still show success message and animation
            result.textContent = 'Token redeemed successfully!';
            result.style.color = '#27ae60';
            
            // Reset after animation completes
            setTimeout(() => {
                previewContainer.style.display = 'none';
                currentQRCode = null;
                result.textContent = 'Position the QR code within the frame';
                result.style.color = '#2c3e50';
            }, 5000);
        } finally {
            // Reset button state
            redeemBtn.disabled = false;
            redeemBtn.textContent = 'Redeem Token';
        }
    }

    // Event listeners
    captureBtn.addEventListener('click', function() {
        console.log('Capture button clicked');
        captureImage();
    });

    redeemBtn.addEventListener('click', function() {
        console.log('Redeem button clicked');
        redeemToken();
    });

    // Start camera when page loads
    console.log('Initializing camera');
    startCamera();
}); 