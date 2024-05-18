
import { getVar, setVar } from "./utils.js";
import { imageToMatrix, matrixToDataURL, okFunction } from "./imageProcessing.js";

export function applyFilter(filterType, wildCard) {
    const filterFunctions = {
        'brightness': brightness,
        'negative': negative,
        'gray': gray,
        'binarize': binarize,
        'arithmeticOperation': arithmeticOperation
    };
    const originalMatrix = getVar('workingMatrix');
    const width = originalMatrix[0].length;
    const height = originalMatrix.length;

    filterFunctions[filterType](originalMatrix, width, height, wildCard);
}

function brightness(originalMatrix, width, height) {
    const brightness_value = parseInt(document.getElementById('range_brightness').value);
    const brightnessMatrix = [];
    for (let i = 0; i < height; i++) {
        brightnessMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            let red = brightness_value + originalMatrix[i][j][0];
            let green = brightness_value + originalMatrix[i][j][1];
            let blue = brightness_value + originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];
            brightnessMatrix[i][j] = [red, green, blue, alpha];
        }
    }
    setVar('filterMatrix', brightnessMatrix);
    setVar('appliedFilter', 'Brilho: ' + brightness_value);
    document.getElementById('image-brightness').src = matrixToDataURL(brightnessMatrix, width, height);
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
            negativeMatrix[i][j] = [red, green, blue, alpha];
        }
    }
    setVar('filterMatrix', negativeMatrix);
    setVar('appliedFilter', 'Negativo');
    okFunction();
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
            grayMatrix[i][j] = [grayPixel, grayPixel, grayPixel, alpha];
        }
    }
    setVar('filterMatrix', grayMatrix);
    setVar('appliedFilter', 'Escala de cinza');
    okFunction();
}

function binarize(originalMatrix, width, height) {
    const binarize_value = parseInt(document.getElementById('range_binarize').value);
    const binaryMatrix = [];
    for (let i = 0; i < height; i++) {
        binaryMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            const red = originalMatrix[i][j][0];
            const green = originalMatrix[i][j][1];
            const blue = originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];
            const grayPixel = (red + green + blue) / 3;
            let binaryPixel = grayPixel > binarize_value ? 255 : 0;
            binaryMatrix[i][j] = [binaryPixel, binaryPixel, binaryPixel, alpha];
        }
    }
    setVar('filterMatrix', binaryMatrix);
    document.getElementById('image-binarize').src = matrixToDataURL(binaryMatrix, width, height);
    setVar('appliedFilter', 'Limiarizar: ' + binarize_value);
}

function arithmeticOperation(originalMatrix, width, height, operator) {
    const operationMatrix = [];
    const secondaryMatrix = imageToMatrix(document.getElementById('secondary-image'));
    if (originalMatrix.length != secondaryMatrix.length) {
        console.log("Imagens de tamanhos diferentes");
        return
    }
    for (let i = 0; i < height; i++) {
        operationMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            operationMatrix[i][j][0] = originalMatrix[i][j][0] + secondaryMatrix[i][j][0];
            operationMatrix[i][j][0] = originalMatrix[i][j][0] + secondaryMatrix[i][j][0];
            operationMatrix[i][j][0] = originalMatrix[i][j][0] + secondaryMatrix[i][j][0];
            operationMatrix[i][j][3] = originalMatrix[i][j][3];
            const alpha = originalMatrix[i][j][3];
            const grayPixel = (red + green + blue) / 3;
            let binaryPixel = grayPixel > binarize_value ? 255 : 0;
            binaryMatrix[i][j] = [binaryPixel, binaryPixel, binaryPixel, alpha];
        }
    }
}