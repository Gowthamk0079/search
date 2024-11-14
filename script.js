// Trigger image generation when pressing Enter
document.getElementById("prompt").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        generateImage();
    }
});

async function generateImage() {
    const prompt = document.getElementById("prompt").value;
    if (!prompt) {
        alert("Please enter a prompt!");
        return;
    }

    const imageDisplay = document.getElementById("image-display");
    const loading = document.getElementById("loading");
    const progressText = document.getElementById("progress-text");

    // Clear previous images and show loading
    imageDisplay.innerHTML = "";
    loading.style.display = "flex";

    // Start fake progress animation
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        progressText.textContent = `Generating... ${progress}%`;

        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 200);

    setTimeout(async () => {
        const apiUrl = `https://api.unsplash.com/search/photos?page=1&query=${prompt}&client_id=FBb4j7jnblWca8SbXIk98QreUryIQAp49RdMN2pOWGo`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) throw new Error("No images found");

            loading.style.display = "none";
            progressText.textContent = "Generating... 0%";

            const randomCount = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
            data.results.slice(0, randomCount).forEach(result => {
                const img = document.createElement("img");
                img.src = result.urls.small;
                img.alt = prompt;
                img.style.opacity = "0";
                img.onload = () => (img.style.opacity = "1");
                img.classList.add("generated-image");

                // Create the download link
                const downloadLink = document.createElement("a");
                downloadLink.href = result.urls.full; // Full-resolution image URL
                downloadLink.download = `image-${Math.random().toString(36).substring(7)}.jpg`; // Random filename
                downloadLink.textContent = "Download";
                downloadLink.style.marginTop = "10px";
                downloadLink.style.display = "block";
                downloadLink.style.textAlign = "center";
                downloadLink.style.color = "#333";
                downloadLink.style.fontWeight = "bold";
                downloadLink.style.textDecoration = "none";
                downloadLink.style.transition = "color 0.3s";
                downloadLink.addEventListener("mouseover", () => {
                    downloadLink.style.color = "#007BFF"; // Change color on hover
                });
                downloadLink.addEventListener("mouseout", () => {
                    downloadLink.style.color = "#333"; // Reset color when not hovered
                });

                // Append image and download link to the display
                const imageContainer = document.createElement("div");
                imageContainer.appendChild(img);
                imageContainer.appendChild(downloadLink);
                imageDisplay.appendChild(imageContainer);
            });
        } catch (error) {
            loading.style.display = "none";
            alert("Failed to generate images. Please try again.");
        }
    }, 3000);
}
