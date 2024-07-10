const radar = document.getElementById('radar');
let isDragging = false;
let startX, startY, headingText;

function removeExistingHeading() {
    if (headingText) {
        radar.removeChild(headingText);
        headingText = null;
    }
}


radar.addEventListener('dragstart', (e) => {
    e.preventDefault(); 
});

radar.addEventListener('mousedown', (e) => {
    removeExistingHeading();

    const rect = radar.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;

    headingText = document.createElement('div');
    headingText.className = 'heading';
    radar.appendChild(headingText);
});

radar.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = radar.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    if (angle < 0) {
        angle += 360;
    }

    
    angle = (450 - angle) % 360;

    
    displayHeadingText(angle, (startX + currentX) / 2, (startY + currentY) / 2);
});

radar.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
    }
});

radar.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        removeExistingHeading();
    }
});


function padNumber(number) {
    return number.toString().padStart(3, '0');
}


function displayHeadingText(angle, midX, midY) {
    if (!headingText) {
        headingText = document.createElement('div');
        headingText.className = 'heading';
        radar.appendChild(headingText);
    }

    headingText.textContent = `${padNumber(Math.round(angle))}°`;
    headingText.style.left = `${midX}px`;
    headingText.style.top = `${midY}px`;
}
