import { closeSecondaryImage, getVar, resetLabelTexts, resetRangeInputs, resizeImage, setVar, truncate } from "./utils.js";


export function imageToMatrix(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
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
            originalMatrix[i][j] = [];
            const index = (i * width + j) * 4;
            originalMatrix[i][j][0] = originalArray[index];
            originalMatrix[i][j][1] = originalArray[index + 1];
            originalMatrix[i][j][2] = originalArray[index + 2];
            originalMatrix[i][j][3] = originalArray[index + 3];
        }
    }
    return originalMatrix;   
}


export function matrixToDataURL(modifiedMatrix) {
    const width = modifiedMatrix[0].length;
    const height = modifiedMatrix.length;
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


export function okFunction() {
    const previousMatrix = getVar('workingMatrix');
    const workingMatrix = getVar('filterMatrix');
    setVar('filterMatrix', [])
    setVar('previousMatrix', previousMatrix);
    setVar('workingMatrix', truncate(workingMatrix));

    document.getElementById('originalImage').src = matrixToDataURL(previousMatrix);
    document.getElementById('modifiedImage').src = matrixToDataURL(workingMatrix);
    document.getElementById('h2-modified-image').innerText = getVar('appliedFilter');

    resizeImage();
    
    resetRangeInputs();
    resetLabelTexts();

    if(getVar('hideSecondaryImage') === true) closeSecondaryImage();
    setVar('hideSecondaryImage', true);
}