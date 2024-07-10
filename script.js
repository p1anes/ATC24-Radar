const radar = document.getElementById('radar');
let isDragging = false;
let startX, startY, line, headingText;

function removeExistingLineAndHeading() {
    if (line) {
        radar.removeChild(line);
        line = null;
    }
    if (headingText) {
        radar.removeChild(headingText);
        headingText = null;
    }
}


radar.addEventListener('dragstart', (e) => {
    e.preventDefault(); 
});

radar.addEventListener('mousedown', (e) => {
    removeExistingLineAndHeading();

    const rect = radar.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;

    line = document.createElement('div');
    line.classList.add('line');
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    radar.appendChild(line);
});

radar.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = radar.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const deltaX = currentX - startX;
    const deltaY = startY - currentY; 

    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    if (angle < 0) {
        angle += 360; 
    }

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`; 

    
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
        removeExistingLineAndHeading();
    }
});


function padNumber(number) {
    return number.toString().padStart(3, '0');
}


function displayHeadingText(angle, midX, midY) {
    if (headingText) {
        radar.removeChild(headingText);
    }

    headingText = document.createElement('div');
    headingText.classList.add('heading');

    
    let displayedAngle = (450 - angle) % 360;

    headingText.textContent = `${padNumber(Math.round(displayedAngle))}°`;
    headingText.style.left = `${midX}px`;
    headingText.style.top = `${midY}px`;
    radar.appendChild(headingText);
}
