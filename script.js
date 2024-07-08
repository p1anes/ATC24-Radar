// made by p1anes for ATC24

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

    headingText = document.createElement('div');
    headingText.classList.add('heading');
    radar.appendChild(headingText);
});

radar.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = radar.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    if (angle < 0) {
        angle += 360; 
    }

    
    let adjustedAngle = (angle + 90) % 360;

    line.style.width = `${length}px`;
    line.style.transformOrigin = '0 0'; 
    line.style.transform = `rotate(${angle}deg)`; 

    
    const midX = (startX + currentX) / 2;
    const midY = (startY + currentY) / 2;
    displayHeadingText(adjustedAngle, midX, midY);
});

radar.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;

        const rect = radar.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        if (angle < 0) {
            angle += 360; 
        }

        
        let adjustedAngle = (angle + 90) % 360;

        
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        headingText.textContent = `${padNumber(Math.round(adjustedAngle))}°`; 
        headingText.style.left = `${midX}px`;
        headingText.style.top = `${midY}px`;
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


function displayHeadingText(angle, x, y) {
    if (headingText) {
        headingText.style.left = `${x}px`;
        headingText.style.top = `${y}px`;

        
        angle = (angle + 360) % 360;

        headingText.textContent = `${padNumber(Math.round(angle))}°`; 
    }
}
