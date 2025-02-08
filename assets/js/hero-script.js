document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("marvelCanvas");
  const ctx = canvas.getContext("2d");

  const CONFIG = {
    MOTION_BLUR_STRENGTH: 80,
    MOTION_BLUR_QUALITY: 20,
    ANIMATION_SPEED: 100,
    BLUR_OPACITY: 0.9,
    TOTAL_IMAGES: 28,
    CANVAS_WIDTH: 1920,
    CANVAS_HEIGHT: 1080,
  };

  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;

  const images = Array.from({ length: CONFIG.TOTAL_IMAGES }, (_, i) => ({
    src: `assets/hero-images/marvel${i + 1}.jpg`,
    y: -CONFIG.CANVAS_HEIGHT,
    targetY: 0,
    done: false,
    active: false,
  }));

  let currentImageIndex = 0;
  const loadedImages = [];
  let imagesLoaded = 0;
  let animationFrameId; 

  function drawImageWithBlur(img, imageData) {
    if (!imageData.active) return;

    const scale = Math.max(
      canvas.width / img.width,
      canvas.height / img.height
    );
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (canvas.width - width) / 2;

    if (imageData.done) {
      ctx.drawImage(img, x, imageData.y, width, height);
      return;
    }

    for (let i = 0; i < CONFIG.MOTION_BLUR_QUALITY; i++) {
      ctx.save();
      const blurOffset =
        (CONFIG.MOTION_BLUR_STRENGTH * i) / CONFIG.MOTION_BLUR_QUALITY;
      const blurY = imageData.y - blurOffset;

      ctx.globalAlpha =
        (1 - i / CONFIG.MOTION_BLUR_QUALITY) * CONFIG.BLUR_OPACITY;
      if (i > 0) {
        ctx.filter = `blur(${i * 0.5}px)`;
      }

      ctx.drawImage(img, x, blurY, width, height);
      ctx.restore();
    }
  }

  function updateAnimation(imageData, index) {
    if (!imageData.active || imageData.done) return;
  
    imageData.y += CONFIG.ANIMATION_SPEED;
  
    if (imageData.y >= imageData.targetY) {
      imageData.y = imageData.targetY;
      imageData.done = true;
  
      // Activate the next image in the sequence
      if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        images[currentImageIndex].active = true;
      }
  
      // Remove the image after it has been fully placed
      setTimeout(() => {
        images.splice(index, 1); // Remove the image data from the array
        loadedImages.splice(index, 1); // Remove the preloaded image
        currentImageIndex--; // Adjust the index due to the removed item
      }, 100); // Delay slightly to ensure it has been drawn
    }
  }
  

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#160202";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    images.forEach((imageData, index) => {
      if (loadedImages[index]) {
        updateAnimation(imageData, index); // Pass the index
        drawImageWithBlur(loadedImages[index], imageData);
      }
    });
  
    animationFrameId = requestAnimationFrame(animate);
  }
  

  function cleanup() {
    cancelAnimationFrame(animationFrameId); 
    images.length = 0; 
    loadedImages.length = 0; 
    canvas.remove(); 
    
  }

  images.forEach((imageData, index) => {
    const img = new Image();
    img.onload = () => {
      imagesLoaded++;
      loadedImages[index] = img;
      if (imagesLoaded === CONFIG.TOTAL_IMAGES) {
        images[0].active = true;
        animate();

        
        setTimeout(() => {
          cleanup();
        }, 5500);
      }
    };
    img.src = imageData.src;
  });
});
