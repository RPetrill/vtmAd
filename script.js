// Page navigation
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const page = button.getAttribute('data-page');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page).classList.add('active');
        document.getElementById('page-title').textContent = page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
        if (page === 'ad-management') {
            initializeStream('detroit-bars-screen');
            initializeStream('detroit-bars-banner');
            initializeStream('indiana-bars-screen');
            initializeStream('indiana-bars-banner');
        } else {
            stopStream('detroit-bars-screen');
            stopStream('detroit-bars-banner');
            stopStream('indiana-bars-screen');
            stopStream('indiana-bars-banner');
        }
    });
});

function navigateToEditCarousel(carouselId) {
    const modal = document.getElementById('editCarouselModal');
    if (modal) {
        currentEditCarouselId = carouselId;
        populateEditableGrid();
        modal.style.display = 'block';
    }
}

function hideEditCarousel() {
    const modal = document.getElementById('editCarouselModal');
    if (modal) modal.style.display = 'none';
}

// Ad preview modal
function showAdPreview() {
    document.getElementById('adPreview').style.display = 'block';
    initializePreview();
}

function hideAdPreview() {
    document.getElementById('adPreview').style.display = 'none';
}

let currentPreviewIndex = 0;
let previewData = {
    images: [
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="60" fill="#26a69a" text-anchor="middle">Placeholder Image</text></svg>', type: 'screen' },
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="40" fill="#26a69a" text-anchor="middle">Placeholder Image</text></svg>', type: 'banner' }
    ]
};

function initializePreview() {
    const carousel = document.getElementById('streamPreview');
    if (!carousel) return;
    movePreview(0);
}

function movePreview(direction) {
    const carousel = document.getElementById('streamPreview');
    if (!carousel || !previewData.images) return;

    currentPreviewIndex = (currentPreviewIndex + direction + previewData.images.length) % previewData.images.length;
    const ad = previewData.images[currentPreviewIndex];
    carousel.innerHTML = `
        <div class="${ad.type}-ad" style="width: 100%; height: ${ad.type === 'screen' ? '300px' : '100px'}; position: relative; overflow: hidden;">
            ${ad.src}
        </div>`;
}

// Group selection
document.getElementById('groupSelect').addEventListener('change', function() {
    const group = this.value;
    alert(`Switched to ${group} group. Update content here!`);
    // Add logic to fetch or filter data based on group
});

// Create Ad Group
function createAdGroup() {
    const groupName = document.getElementById('groupName').value;
    if (groupName) {
        alert(`Ad Group "${groupName}" created! Add to select options dynamically here.`);
        document.getElementById('groupName').value = '';
        // Add logic to update ad-group-select and group-ad-select options
    } else {
        alert('Please enter a group name.');
    }
}

// Upload Ad (handles both file input and drag-and-drop)
function uploadAd(files) {
    const adType = document.getElementById('adType').value;
    const fileInput = document.getElementById('adUpload');
    const filesToUpload = files || fileInput.files;
    if (filesToUpload.length > 0) {
        for (let file of filesToUpload) {
            alert(`Uploaded ${file.name} as ${adType}. Add to gallery and stream here.`);
            addUserAd(file.name, adType);
        }
        fileInput.value = ''; // Reset file input after upload
        populateAddAdModal(); // Refresh user ad options
    } else {
        alert('Please select or drop a file to upload.');
    }
}

// Client Upload Ad
function clientUploadAd() {
    const adType = document.getElementById('clientAdType').value;
    const fileInput = document.getElementById('clientAdUpload');
    const group = document.getElementById('clientGroupSelect').value;
    const filesToUpload = fileInput.files;
    if (filesToUpload.length > 0) {
        for (let file of filesToUpload) {
            alert(`Client uploaded ${file.name} as ${adType} to ${group} group. Add to gallery and stream here.`);
            addUserAd(file.name, adType);
        }
        fileInput.value = ''; // Reset file input after upload
        populateAddAdModal(); // Refresh user ad options
    } else {
        alert('Please select or drop a file to upload.');
    }
}

// User Gallery
function addUserAd(name, type) {
    const gallery = document.querySelector('#uploads .gallery');
    const item = document.createElement('div');
    item.className = 'gallery-item personal-ad';
    item.innerHTML = `
        <svg class="${type}-ad-img" width="108" height="${type === 'screen' ? '192' : '44'}" viewBox="0 0 1080 ${type === 'screen' ? '1920' : '441'}">
            <rect width="1080" height="${type === 'screen' ? '1920' : '441'}" fill="#e0f2f1"/>
            <text x="540" y="${type === 'screen' ? '960' : '220'}" font-family="Arial" font-size="${type === 'screen' ? '60' : '40'}" fill="#26a69a" text-anchor="middle">Placeholder Image</text>
        </svg>
        <p>${name}</p>
        <button onclick="deleteUserAd(this)">Delete</button>
    `;
    gallery.insertBefore(item, gallery.firstChild);
}

function deleteUserAd(button) {
    if (confirm('Are you sure you want to delete this ad?')) {
        button.parentElement.remove();
        alert('Ad deleted from User Gallery.');
        populateAddAdModal(); // Refresh user ad options
    }
}

// Drag-and-Drop handlers
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    uploadAd(e.dataTransfer.files);
});

const clientDropZone = document.getElementById('clientDropZone');
clientDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    clientDropZone.classList.add('dragover');
});

clientDropZone.addEventListener('dragleave', () => {
    clientDropZone.classList.remove('dragover');
});

clientDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    clientDropZone.classList.remove('dragover');
    clientUploadAd(e.dataTransfer.files);
});

let currentEditCarouselId = null;
let editData = {
    'detroit-bars-screen': [
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="80" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 1</text></svg>', type: 'screen' },
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="80" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 2</text></svg>', type: 'screen' },
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="80" font-weight="bold" fill="#ff0000" text-anchor="middle">Paid Ad</text></svg>', type: 'screen' },
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="80" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 3</text></svg>', type: 'screen' }
    ],
    'detroit-bars-banner': [
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="60" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 1</text></svg>', type: 'banner' },
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="60" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 2</text></svg>', type: 'banner' },
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="60" font-weight="bold" fill="#ff0000" text-anchor="middle">Paid Ad</text></svg>', type: 'banner' },
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="60" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 3</text></svg>', type: 'banner' }
    ],
    'indiana-bars-screen': [
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="80" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 1</text></svg>', type: 'screen' },
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="80" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 2</text></svg>', type: 'screen' },
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="80" font-weight="bold" fill="#ff0000" text-anchor="middle">Paid Ad</text></svg>', type: 'screen' },
        { src: '<svg width="108" height="192" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#e0f2f1"/><text x="540" y="960" font-family="Arial" font-size="80" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 3</text></svg>', type: 'screen' }
    ],
    'indiana-bars-banner': [
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="60" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 1</text></svg>', type: 'banner' },
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="60" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 2</text></svg>', type: 'banner' },
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="60" font-weight="bold" fill="#ff0000" text-anchor="middle">Paid Ad</text></svg>', type: 'banner' },
        { src: '<svg width="108" height="44" viewBox="0 0 1080 441"><rect width="1080" height="441" fill="#e0f2f1"/><text x="540" y="220" font-family="Arial" font-size="60" font-weight="bold" fill="#26a69a" text-anchor="middle">Placeholder 3</text></svg>', type: 'banner' }
    ]
};

// Edit Carousel
function populateEditableGrid() {
    const grid = document.getElementById('editableAdGrid');
    if (!grid || !currentEditCarouselId) return;

    grid.innerHTML = '';
    editData[currentEditCarouselId].forEach((ad, index) => {
        const item = document.createElement('div');
        item.className = 'editable-ad-item';
        item.draggable = true;
        item.dataset.index = index;
        item.innerHTML = `
            ${ad.src}
            <p>${ad.type} Ad ${index + 1}</p>
        `;
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
        grid.appendChild(item);
    });
    // Add the drop indicator
    const indicator = document.createElement('div');
    indicator.id = 'dropIndicator';
    indicator.style.position = 'absolute';
    indicator.style.width = '2px';
    indicator.style.backgroundColor = '#ff0000';
    indicator.style.height = '100%';
    indicator.style.display = 'none';
    grid.appendChild(indicator);
}

let draggedIndex = null;
let dropIndicator = null;
let tempEditData = {}; // Temporary storage for unsaved changes

function handleDragStart(e) {
    draggedIndex = e.target.dataset.index;
    e.target.classList.add('dragging');
    dropIndicator = document.getElementById('dropIndicator');
    if (dropIndicator) dropIndicator.style.display = 'block';
    // Initialize tempEditData with current order if not set
    if (!tempEditData[currentEditCarouselId]) {
        tempEditData[currentEditCarouselId] = [...editData[currentEditCarouselId]];
    }
}

function handleDragOver(e) {
    e.preventDefault();
    const grid = document.getElementById('editableAdGrid');
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const items = grid.getElementsByClassName('editable-ad-item');
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < items.length; i++) {
        const itemRect = items[i].getBoundingClientRect();
        const centerX = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(x - centerX);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    }

    if (dropIndicator) {
        const targetItem = items[closestIndex];
        const targetRect = targetItem.getBoundingClientRect();
        dropIndicator.style.left = (targetRect.left + targetRect.width / 2) + 'px';
        dropIndicator.style.top = targetRect.top + 'px';
    }
}

function handleDrop(e) {
    e.preventDefault();
    const grid = document.getElementById('editableAdGrid');
    const items = grid.getElementsByClassName('editable-ad-item');
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let dropIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < items.length; i++) {
        const itemRect = items[i].getBoundingClientRect();
        const centerX = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(x - centerX);
        if (distance < minDistance) {
            minDistance = distance;
            dropIndex = i;
        }
    }

    if (draggedIndex !== null && dropIndex !== undefined) {
        const draggedAd = tempEditData[currentEditCarouselId].splice(draggedIndex, 1)[0];
        tempEditData[currentEditCarouselId].splice(dropIndex, 0, draggedAd);
        populateEditableGrid(); // Update modal with temporary order
    }
    if (dropIndicator) dropIndicator.style.display = 'none';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedIndex = null;
    if (dropIndicator) dropIndicator.style.display = 'none';
}

function saveCarouselOrder() {
    if (currentEditCarouselId) {
        const carousel = document.getElementById(currentEditCarouselId);
        if (carousel && tempEditData[currentEditCarouselId]) {
            editData[currentEditCarouselId] = [...tempEditData[currentEditCarouselId]];
            carousel.innerHTML = editData[currentEditCarouselId].map(ad => `
                <div class="${ad.type}-ad" style="width: ${currentEditCarouselId.includes('screen') ? '108px' : '108px'}; height: ${ad.type === 'screen' ? '192px' : '44px'}; position: relative; display: inline-block;">
                    ${ad.src}
                </div>
            `).join('');
        }
        hideEditCarousel();
        // No alert message
    }
}

// Stream management
let streamIndices = {
    'detroit-bars-screen': 0,
    'detroit-bars-banner': 0,
    'indiana-bars-screen': 0,
    'indiana-bars-banner': 0
};

function initializeStream(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const data = editData[carouselId];
    carousel.innerHTML = data.map(ad => `
        <div class="${ad.type}-ad" style="width: ${carouselId.includes('screen') ? '108px' : '108px'}; height: ${ad.type === 'screen' ? '192px' : '44px'}; position: relative; display: none;">
            ${ad.src}
        </div>
    `).join('');
    moveStream(carouselId, 0); // Initialize to first image
}

function moveStream(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const data = editData[carouselId];
    streamIndices[carouselId] = (streamIndices[carouselId] + direction + data.length) % data.length;

    const images = carousel.getElementsByTagName('div');
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = (i === streamIndices[carouselId]) ? 'block' : 'none';
    }
}

function stopStream(carouselId) {
    // No interval to clear since we removed auto-scrolling
}

// Communal Library
function publishCommunalAd() {
    const adType = document.getElementById('communalAdType').value;
    const fileInput = document.getElementById('communalAdUpload');
    const filesToUpload = fileInput.files;
    if (filesToUpload.length > 0) {
        for (let file of filesToUpload) {
            alert(`Published ${file.name} as ${adType} to Communal Library.`);
            addCommunalAd(file.name, adType);
        }
        fileInput.value = ''; // Reset file input after upload
    } else {
        alert('Please select a file to publish.');
    }
}

function addCommunalAd(name, type) {
    const gallery = document.querySelector('#communal-library .gallery');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <svg class="${type}-ad-img" width="108" height="${type === 'screen' ? '192' : '44'}" viewBox="0 0 1080 ${type === 'screen' ? '1920' : '441'}">
            <rect width="1080" height="${type === 'screen' ? '1920' : '441'}" fill="#e0f2f1"/>
            <text x="540" y="${type === 'screen' ? '960' : '220'}" font-family="Arial" font-size="${type === 'screen' ? '60' : '40'}" fill="#26a69a" text-anchor="middle">Placeholder Image</text>
        </svg>
        <p>${name}</p>
        <button onclick="downloadCommunalAd(this)">Download</button>
    `;
    gallery.insertBefore(item, gallery.firstChild);
}

function downloadCommunalAd(button) {
    const name = button.previousElementSibling.textContent;
    alert(`Downloading ${name} to your machine.`);
}

// Add Ad Modal
function addAdToCarousel() {
    const modal = document.getElementById('addAdModal');
    if (modal) {
        populateAddAdModal();
        modal.style.display = 'block';
    }
}

function hideAddAdModal() {
    const modal = document.getElementById('addAdModal');
    if (modal) modal.style.display = 'none';
}

let selectedAd = null;

function populateAddAdModal() {
    const userOptions = document.getElementById('userAdOptions');
    userOptions.innerHTML = '';
    const galleryItems = document.querySelectorAll('#uploads .gallery-item');
    galleryItems.forEach(item => {
        const name = item.querySelector('p').textContent;
        const type = item.querySelector('svg').classList.contains('screen-ad-img') ? 'screen' : 'banner';
        const svg = item.querySelector('svg').outerHTML;
        const option = document.createElement('div');
        option.className = 'ad-option';
        option.onclick = () => selectAd({ name, type, src: svg });
        option.innerHTML = `${svg}<p>${name}</p>`;
        userOptions.appendChild(option);
    });
}

function selectAd(ad) {
    selectedAd = ad;
    document.querySelectorAll('.ad-option').forEach(option => option.classList.remove('selected'));
    event.target.closest('.ad-option').classList.add('selected');
}

function confirmAddAd() {
    if (selectedAd && currentEditCarouselId) {
        if ((selectedAd.type === 'screen' && currentEditCarouselId.includes('screen')) ||
            (selectedAd.type === 'banner' && currentEditCarouselId.includes('banner'))) {
            tempEditData[currentEditCarouselId] = tempEditData[currentEditCarouselId] || [...editData[currentEditCarouselId]];
            tempEditData[currentEditCarouselId].push(selectedAd);
            populateEditableGrid();
            hideAddAdModal();
            alert(`Added ${selectedAd.name || 'Paid Ad'} to ${currentEditCarouselId}.`);
        } else {
            alert('Ad type does not match carousel type.');
        }
    } else {
        alert('Please select an ad to add.');
    }
}

// Window load
window.addEventListener('load', () => {
    if (document.getElementById('ad-management').classList.contains('active')) {
        initializeStream('detroit-bars-screen');
        initializeStream('detroit-bars-banner');
        initializeStream('indiana-bars-screen');
        initializeStream('indiana-bars-banner');
    }
});