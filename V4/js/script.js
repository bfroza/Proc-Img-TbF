let workingMatrix = [];

document.addEventListener("DOMContentLoaded", function () {
    workingMatrix = imageToMatrix();
    document.getElementById('fileInput').addEventListener('click', function () {
        this.value = null;
    });

    document.getElementById('fileInput').addEventListener('change',  async function (event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            document.getElementById('originalImage').src = URL.createObjectURL(imageFile);
            document.getElementById('modifiedImage').src = URL.createObjectURL(imageFile);
            workingMatrix = await imageToMatrix();

        }

    });

    document.getElementById('range_id').addEventListener('change', function () {
        const brightness_value = document.getElementById('range_id').value;
        const p = document.getElementById('p').innerText = brightness_value ;
    });
    
    document.getElementById('range_id_binarize').addEventListener('change', function () {
        const limiar = document.getElementById('range_id_binarize').value
        const p1 = document.getElementById('p1').innerText = limiar ;
    });

    document.getElementById('negativeButton').addEventListener('click', function () {
        applyFilter('negative');
    });

    document.getElementById('grayButton').addEventListener('click', function () {
        applyFilter('gray');
    });

    document.getElementById('binarizeButton').addEventListener('click', function () {
        applyFilter('binarize');
    });

    document.getElementById('brightnessButton').addEventListener('click', function () {
        applyFilter('brightness');
    });
    document.getElementById('normalButton').addEventListener('click', function () {
        applyFilter('normal');
    });

    document.getElementById('rotate-left').addEventListener('click', function () {
        applyFilter('rotateLeft');
    });

    document.getElementById('rotate-right').addEventListener('click', function () {
        applyFilter('rotateRight');
    });

    document.getElementById('flip-horizontal').addEventListener('click', function () {
        applyFilter('flipHorizontal');
    });

    document.getElementById('flip-vertical').addEventListener('click', function () {
        applyFilter('flipVertical');
    });


    document.getElementById('secundaryButton').addEventListener('click', function () {
        const selectImg = document.getElementById("display");
        if (selectImg) {
            selectImg.classList.toggle("hidden");
        } else {
            console.log("Elemento com ID 'display' não encontrado.");
        }
    });



});

function imageToMatrix() {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = function () {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, width, height);
            const originalMatrix = [];
            const originalArray = imageData.data;

            for (let i = 0; i < height; i++) {
                originalMatrix[i] = [];
                for (let j = 0; j < width; j++) {
                    const index = (i * width + j) * 4;
                    const red = originalArray[index];
                    const green = originalArray[index + 1];
                    const blue = originalArray[index + 2];
                    const alpha = originalArray[index + 3];
                    originalMatrix[i][j] = [red, green, blue, alpha];
                }
            }
            resolve(originalMatrix);
        };
        img.src = document.getElementById('modifiedImage').src;
    });
}


function applyFilter(filterType) {            
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.willReadFrequently = true;
    const img = new Image();
    img.src = document.getElementById('originalImage').src;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    canvas.width = width;
    canvas.height = height;            
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    let modifiedMatrix = [];
    const originalMatrix =  workingMatrix;
    const brightness_value = document.getElementById('range_id').value
    const limiar = document.getElementById('range_id_binarize').value
    switch (filterType) {
        case 'negative':
            modifiedMatrix = negative(originalMatrix, width, height);
            workingMatrix = modifiedMatrix;
            break;
        case 'gray':
            modifiedMatrix = gray(originalMatrix, width, height);
            workingMatrix = modifiedMatrix;
            break;
        case 'binarize':
            modifiedMatrix = binarize(originalMatrix, width, height,limiar);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height,limiar);
            workingMatrix = modifiedMatrix;
            return;
        case 'brightness':
            const copyOriginalMatrix = originalMatrix
            modifiedMatrix = brightness(copyOriginalMatrix, width, height, brightness_value);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height, brightness_value);
            return;
        case 'rotateLeft':
            modifiedMatrix = rotateLeft(originalMatrix, width, height);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            return;
        case 'rotateRight':
            modifiedMatrix =  rotateRight(originalMatrix, width, height);
            break;
        case 'flipHorizontal':
            modifiedMatrix = flipHorizontal(originalMatrix, width, height);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            return;
        case 'flipVertical':
            modifiedMatrix = flipVertical(originalMatrix, width, height);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            return;
        case 'normal':
            document.getElementById('modifiedImage').src = document.getElementById('originalImage').src
            return;
        default:
            return;
    }
    document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
}

function max_min(value) {
    if (value > 255) {
        value = 255;
    }
    if (value < 0) {
        value = 0
    }

    return value;
}

function matrixToDataURL(modifiedMatrix, width, height) {
    const canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.willReadFrequently = true;
    const imageData = ctx.createImageData(width, height);
    const modifiedArray = imageData.data;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = (i * width + j) * 4;
            const rgba = modifiedMatrix[i][j];
            modifiedArray[index] = rgba[0];
            modifiedArray[index + 1] = rgba[1];
            modifiedArray[index + 2] = rgba[2];
            modifiedArray[index + 3] = rgba[3];
        }                
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

function negative(originalMatrix, width, height) {
    const negativeMatrix = [];
    for (let i = 0; i < height; i++) {
        negativeMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            let red = 255 - originalMatrix[i][j][0];
            let green = 255 - originalMatrix[i][j][1];
            let blue = 255 - originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];
            negativeMatrix[i][j] = [max_min(red), max_min(green), max_min(blue), alpha];
        }
    }
    return negativeMatrix;
}

function brightness(copyOriginalMatrix, width, height, brightness_value) {

    const brightnessMatrix = [];
    for (let i = 0; i < height; i++) {
        brightnessMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            let red = parseInt(brightness_value) + copyOriginalMatrix[i][j][0];
            let green = parseInt(brightness_value) + copyOriginalMatrix[i][j][1];
            let blue = parseInt(brightness_value) + copyOriginalMatrix[i][j][2];
            const alpha = copyOriginalMatrix[i][j][3];
            brightnessMatrix[i][j] = [max_min(red), max_min(green), max_min(blue), alpha];
        }
    }
    return brightnessMatrix;
}

function gray(originalMatrix, width, height) {
    const grayMatrix = [];
    for (let i = 0; i < height; i++) {
        grayMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            const red = originalMatrix[i][j][0];
            const green = originalMatrix[i][j][1];
            const blue = originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];
            let grayPixel = Math.round(red * 0.3 + green * 0.59 + blue * 0.11);
            grayMatrix[i][j] = [max_min(grayPixel), max_min(grayPixel), max_min(grayPixel), alpha];
        }
    }
    return grayMatrix;
}

function binarize(originalMatrix, width, height,limiar) {
    const binayMatrix = [];
    for (let i = 0; i < height; i++) {
        binayMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            const red = originalMatrix[i][j][0];
            const green = originalMatrix[i][j][1];
            const blue = originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];
            const grayPixel = (red + green + blue) / 3;
            let binaryPixel = grayPixel > limiar ? 255 : 0;
            binayMatrix[i][j] = [max_min(binaryPixel), max_min(binaryPixel), max_min(binaryPixel), alpha];
        }
    }
    return binayMatrix;
}


function rotateLeft(originalMatrix, width, height) {
    const rotateLeft = [];
    for (let i = 0; i < height; i++) {
        rotateLeft[i] = [];
        for (let j = width - 1; j >= 0; j--) {
            const red = originalMatrix[j][i][0];
            const green = originalMatrix[j][i][1];
            const blue = originalMatrix[j][i][2];
            const alpha = originalMatrix[j][i][3];
            rotateLeft[i][height - 1 - j] = [red, green, blue, alpha];
        }
    }
    return rotateLeft;
}


function rotateRight(originalMatrix, width, height) {
    const rotateRight = [];
    for (let i = 0; i < width; i++) {
        rotateRight[i] = [];
        for (let j = height - 1; j >= 0; j--) {
            const red = originalMatrix[i][j][0];
            const green = originalMatrix[i][j][1];
            const blue = originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];
            rotateRight[i][height - 1 - j] = [red, green, blue, alpha];
        }
    }
    return rotateRight;
}




function flipVertical(originalMatrix, width, height) {
    const flipVertical = [];
    for (let i = 0; i < width; i++) {
        flipVertical[i] = [];
        for (let j = height - 1; j >= 0; j--) {
            const red = originalMatrix[i][j][0];
            const green = originalMatrix[i][j][1];
            const blue = originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];
            flipVertical[i][height - 1 - j] = [red, green, blue, alpha];
        }
    }
    return flipVertical;
}


function downloadImage() {
    const tipoDeImagem = document.getElementById("select-tipo-imgs").value
    const modifiedImg = document.getElementById('modifiedImage');
    const imageURL = modifiedImg.src;

    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = 'modified_image.' + tipoDeImagem;
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

document.getElementById('downloadButton').addEventListener('click', downloadImage);