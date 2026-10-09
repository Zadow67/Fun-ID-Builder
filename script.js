
const input = document.getElementById('photo-upload');
const preview = document.getElementById('photo-preview');
const text = document.getElementById('upload-text');
const dropZone = document.getElementById('drop-zone');
const downloadButton = document.getElementById('downloadButton');

function uploadPhoto(file) {
    if (file && file.type === 'image/png') {
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        text.style.display = 'none';
    } else if (file) {
        alert('Please upload a PNG image.');
    }
}

input.addEventListener('change', function () {
    uploadPhoto(this.files[0]);
});

dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
});

dropZone.addEventListener('drop', function (event) {
    event.preventDefault();
    uploadPhoto(event.dataTransfer.files[0]);
});

function downloadImage(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

downloadButton.addEventListener('click', function () {
    if (!preview.naturalWidth || preview.style.display === 'none') {
        alert('Please upload a photo first!');
        return;
    }

    const front = document.querySelector('.front-card > img');
    const back = document.querySelector('.back-card > img');

    if (back && back.complete && back.naturalWidth) {
        const backCanvas = document.createElement('canvas');
        backCanvas.width = back.naturalWidth;
        backCanvas.height = back.naturalHeight;

        const backCtx = backCanvas.getContext('2d');
        backCtx.drawImage(back, 0, 0);

        downloadImage(backCanvas, 'doomsday-loki-back.png');
    }

    const canvas = document.createElement('canvas');
    canvas.width = front.naturalWidth;
    canvas.height = front.naturalHeight;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(front, 0, 0);

    const cardBox = front.getBoundingClientRect();
    const photoBox = dropZone.getBoundingClientRect();

    const scaleX = canvas.width / cardBox.width;
    const scaleY = canvas.height / cardBox.height;

    const x = (photoBox.left - cardBox.left + dropZone.clientLeft) * scaleX;
    const y = (photoBox.top - cardBox.top + dropZone.clientTop) * scaleY;
    const width = dropZone.clientWidth * scaleX;
    const height = dropZone.clientHeight * scaleY;

    const imageRatio = preview.naturalWidth / preview.naturalHeight;
    const boxRatio = width / height;

    let sx = 0;
    let sy = 0;
    let sw = preview.naturalWidth;
    let sh = preview.naturalHeight;

    if (imageRatio > boxRatio) {
        sw = preview.naturalHeight * boxRatio;
        sx = (preview.naturalWidth - sw) / 2;
    } else {
        sh = preview.naturalWidth / boxRatio;
        sy = (preview.naturalHeight - sh) / 2;
    }

    ctx.drawImage(preview, sx, sy, sw, sh, x, y, width, height);

    downloadImage(canvas, 'front.png');

    const backCanvas = document.createElement('canvas');
    backCanvas.width = back.naturalWidth;
    backCanvas.height = back.naturalHeight;

    const backCtx = backCanvas.getContext('2d');

    backCtx.drawImage(back, 0, 0);
    downloadImage(backCanvas, 'back.png');
});
