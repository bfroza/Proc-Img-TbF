import { imageToMatrix } from "./imageProcessing.js";

const globalVars = {
    recoverMatrix: [],
    previousMatrix: [],
    workingMatrix: [],
    filterMatrix: [],
    secondaryMatrix: [],
    appliedFilter: '',
    hideSecondaryImage: true,
    cropper: "",
    histogramOriginal: {},
    histogramModified: {}
};


export function getVar(globalVar) {
    return globalVars[globalVar];
}


export function setVar(globalVar, value) {
    globalVars[globalVar] = value;
}


export function downloadImage() {
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

export function truncate(modifiedMatrix) {
    const width = modifiedMatrix[0].length;
    const height = modifiedMatrix.length;
    const truncatedMatrix = [];
    let value = 0;
    for (let i = 0; i < height; i++) {
        truncatedMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            truncatedMatrix[i][j] = [];
            for (let k = 0; k < 4; k++) {
                value = modifiedMatrix[i][j][k];
                if (value > 255) {
                    value = 255;
                }
                else if (value < 0) {
                    value = 0
                }
                truncatedMatrix[i][j][k] = value;
            }
        }
    }
    return truncatedMatrix;
}


export function normalize(modifiedMatrix) {
    let minValueRed = modifiedMatrix[0][0][0];
    let maxValueRed = modifiedMatrix[0][0][0];
    let minValueGreen = modifiedMatrix[0][0][1];
    let maxValueGreen = modifiedMatrix[0][0][1];
    let minValueBlue = modifiedMatrix[0][0][2];
    let maxValueBlue = modifiedMatrix[0][0][2];
    const normalizedMatrix = [];

    const width = modifiedMatrix[0].length;
    const height = modifiedMatrix.length;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (modifiedMatrix[i][j][0] < minValueRed) minValueRed = modifiedMatrix[i][j][0];
            if (modifiedMatrix[i][j][1] < minValueGreen) minValueGreen = modifiedMatrix[i][j][1];
            if (modifiedMatrix[i][j][2] < minValueBlue) minValueBlue = modifiedMatrix[i][j][2];
            if (modifiedMatrix[i][j][0] > maxValueRed) maxValueRed = modifiedMatrix[i][j][0];
            if (modifiedMatrix[i][j][1] > maxValueGreen) maxValueGreen = modifiedMatrix[i][j][1];
            if (modifiedMatrix[i][j][2] > maxValueBlue) maxValueBlue = modifiedMatrix[i][j][2];
        }
    }
    for (let i = 0; i < height; i++) {
        normalizedMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            normalizedMatrix[i][j] = [];
            normalizedMatrix[i][j][0] = parseInt((255 / (maxValueRed - minValueRed)) * (modifiedMatrix[i][j][0] - minValueRed));
            normalizedMatrix[i][j][1] = parseInt((255 / (maxValueGreen - minValueGreen)) * (modifiedMatrix[i][j][1] - minValueGreen));
            normalizedMatrix[i][j][2] = parseInt((255 / (maxValueBlue - minValueBlue)) * (modifiedMatrix[i][j][2] - minValueBlue));
            normalizedMatrix[i][j][3] = modifiedMatrix[i][j][3];
        }
    }
    return normalizedMatrix;
}


export function resetRangeInputs() {
    // document.querySelectorAll('.range-reset').forEach(input => {
    //     input.value = 0;
    // });
}


export function resetLabelTexts() {
    // document.querySelectorAll('.label-reset').forEach(label => {
    //     label.innerText = '0';
    // });
}


export function openSecondaryImage() {
    document.getElementById('secondary-image').classList.remove('hidden');
    document.getElementById('fileInput_2').click();
    document.getElementById('header-page').classList.add('disabled');
    setVar('hideSecondaryImage', false);
    const previousMatrix = imageToMatrix(document.getElementById('originalImage'));
    setVar('previousMatrix', previousMatrix);
    document.getElementById('originalImage').src = document.getElementById('modifiedImage').src;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = document.getElementById('modifiedImage').naturalWidth;
    const height = document.getElementById('modifiedImage').naturalHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    document.getElementById('modifiedImage').src = canvas.toDataURL();

    document.querySelectorAll('.secondary-hide').forEach(div => {
        div.classList.remove('hidden');
    });
}


export function closeSecondaryImage() {
    document.getElementById('secondary-image').classList.add('hidden');
    document.getElementById('header-page').classList.remove('disabled');
}


export function resizeImage() {
    const images = document.querySelectorAll('.resizable-image');
    images.forEach(img => {
        img.onload = function () {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            if (width > height) {
                img.classList.add('resize-width');
                img.classList.remove('resize-height');
            } else {
                img.classList.add('resize-height');
                img.classList.remove('resize-width');
            }
        };
    });
}