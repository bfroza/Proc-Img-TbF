
import { getVar, normalize, setVar, truncate } from "./utils.js";
import { imageToMatrix, matrixToDataURL, okFunction } from "./imageProcessing.js";

export function applyFilter(filterType, wildCard) {
    const filterFunctions = {
        'brightness': brightness,
        'negative': negative,
        'gray': gray,
        'binarize': binarize,
        'arithmeticOperation': arithmeticOperation,
        'arithmeticConstantOperation': arithmeticConstantOperation,
        'flip': flip,
        'rotate': rotate,
        'crop': crop
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
    document.getElementById('image-brightness').src = matrixToDataURL(brightnessMatrix);
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
    document.getElementById('image-binarize').src = matrixToDataURL(binaryMatrix);
    setVar('appliedFilter', 'Limiarizar: ' + binarize_value);
}

function arithmeticOperation(originalMatrix, width, height, operator) {
    const operation = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        'average': (a, b) => {
            let result = (a + b);
            if (result > 255) result = 255;
            result /= 2;
            return result;
        },
        'blending': (a, b) => {
            const ratio = parseInt(document.getElementById('range-blending').value) / 100;
            let result = ratio * a + (1 - ratio) * b;
            return result;
        },
        'and': (a, b) => a & b,
        'or': (a, b) => a | b,
        'xor': (a, b) => a ^ b,
        'not1': (a, b) => ~a & 0xFF,
        'not2': (a, b) => ~b & 0xFF
    };
    const operationMatrix = [];
    const img = new Image();
    img.src = document.getElementById('originalImage2').src;
    img.onload = function () {
        const secondaryMatrix = imageToMatrix(img);

        if (originalMatrix.length != secondaryMatrix.length) {
            console.log("Imagens de tamanhos diferentes");
            return
        }

        for (let i = 0; i < height; i++) {
            operationMatrix[i] = [];
            for (let j = 0; j < width; j++) {
                operationMatrix[i][j] = [];
                operationMatrix[i][j][0] = operation[operator](originalMatrix[i][j][0], secondaryMatrix[i][j][0]);
                operationMatrix[i][j][1] = operation[operator](originalMatrix[i][j][1], secondaryMatrix[i][j][1]);
                operationMatrix[i][j][2] = operation[operator](originalMatrix[i][j][2], secondaryMatrix[i][j][2]);
                operationMatrix[i][j][3] = originalMatrix[i][j][3];
            }
        }
        let normalizedMatrix = [];
        const selectedValue = document.getElementById('operation-select').value;
        let textOperation = "";
        if (selectedValue === 'normalize') {
            normalizedMatrix = normalize(operationMatrix);
            textOperation = "Normalizado";
        } else if (selectedValue === 'truncate') {
            normalizedMatrix = truncate(operationMatrix);
            textOperation = "Truncado";
        }
        setVar('filterMatrix', normalizedMatrix);
        setVar('appliedFilter', 'Operação: ' + operator + " / " + textOperation);
        document.getElementById('modifiedImage').src = matrixToDataURL(normalizedMatrix);
    }
}

function arithmeticConstantOperation(originalMatrix, width, height, operator) {
    const operation = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    };
    const value = parseFloat(document.getElementById('arithmetic-input').value);
    const operationMatrix = [];
    for (let i = 0; i < height; i++) {
        operationMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            operationMatrix[i][j] = [];
            operationMatrix[i][j][0] = operation[operator](originalMatrix[i][j][0], value);
            operationMatrix[i][j][1] = operation[operator](originalMatrix[i][j][1], value);
            operationMatrix[i][j][2] = operation[operator](originalMatrix[i][j][2], value);
            operationMatrix[i][j][3] = originalMatrix[i][j][3];
        }
    }
    setVar('filterMatrix', operationMatrix);
    setVar('appliedFilter', 'Op. Aritmética: ' + operator + " " + value);
    document.getElementById('image-arithmetic').src = matrixToDataURL(operationMatrix);
}

function flip(originalMatrix, width, height, direction) {
    const flippedMatrix = [];
    if (direction === 'horizontal') {
        for (let i = 0; i < height; i++) {
            flippedMatrix[i] = [];
            for (let j = 0; j < width; j++) {
                flippedMatrix[i][j] = originalMatrix[i][width - j - 1];
            }
        }
    }
    else if (direction === 'vertical') {
        for (let i = 0; i < height; i++) {
            flippedMatrix[i] = [];
            for (let j = 0; j < width; j++) {
                flippedMatrix[i][j] = originalMatrix[height - i - 1][j];
            }
        }
    }
    setVar('filterMatrix', flippedMatrix);
    setVar('appliedFilter', 'Flip ' + direction);
    okFunction();
}

function rotate(originalMatrix, width, height, direction) {
    const rotatedMatrix = [];
    if (direction === 'horário') {
        for (let i = 0; i < width; i++) {
            rotatedMatrix[i] = [];
            for (let j = 0; j < height; j++) {
                rotatedMatrix[i][j] = originalMatrix[height - 1 - j][i];
            }
        }
    }
    else if (direction === 'anti-horário') {
        for (let i = 0; i < width; i++) {
            rotatedMatrix[i] = [];
            for (let j = 0; j < height; j++) {
                rotatedMatrix[i][j] = originalMatrix[j][width - 1 - i];
            }
        }
    }
    setVar('filterMatrix', rotatedMatrix);
    setVar('appliedFilter', 'Rotação sentido ' + direction);
    okFunction();
}

function crop(originalMatrix) {    
    const image = document.getElementById('image-crop');
    image.onload = function() {
        const cropper = new Cropper(image, {
            // aspectRatio: 1,
            viewMode: 1
        });
    
    }
}