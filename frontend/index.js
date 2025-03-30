document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('verificationForm');
    const loadingScreen = document.getElementById('loadingScreen');
    const successMessage = document.getElementById('successMessage');
    const verificationStatus = document.getElementById('verificationStatus');
    const imagePreview = document.getElementById('imagePreview');
    const aadharImage = document.getElementById('aadharImage');

    // Handle image preview
    aadharImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading screen
        loadingScreen.style.display = 'flex';
        
        // Simulate verification process (replace with actual verification logic)
        setTimeout(() => {
            // Hide loading screen
            loadingScreen.style.display = 'none';
            
            // Show success message
            successMessage.style.display = 'block';
            
            // Redirect to QR scan page after a short delay
            setTimeout(() => {
                window.location.href = 'qr-scan.html';
            }, 1500);
        }, 2000);
    });
}); 