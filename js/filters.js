
import { getVar, normalize, setVar, truncate } from "./utils.js";
import { calculateCDF, calculateHistogram, imageToMatrix, matrixToDataURL, okFunction } from "./imageProcessing.js";

let cropper;
let updatingFromInput = false;

export function applyFilter(filterType, wildCard) {
    const filterFunctions = {
        'brightness': brightness,
        'contrast': contrast,
        'negative': negative,
        'gray': gray,
        'binarize': binarize,
        'arithmeticOperation': arithmeticOperation,
        'arithmeticConstantOperation': arithmeticConstantOperation,
        'flip': flip,
        'rotate': rotate,
        'crop': crop,
        'cropSelection': cropSelection,
        'histogram': histogram,
        'concatenate': concatenate
    };
    const originalMatrix = getVar('workingMatrix');
    const width = originalMatrix[0].length;
    const height = originalMatrix.length;

    filterFunctions[filterType](originalMatrix, width, height, wildCard);
}

function brightness(originalMatrix, width, height) {
    const brightness_value = parseInt(document.getElementById('brightness-range').value);
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

function contrast(originalMatrix, width, height) {
    const contrastValue = parseFloat(document.getElementById('range-contrast').value);
    const contrastMatrix = [];
    for (let i = 0; i < height; i++) {
        contrastMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            let red = parseInt(contrastValue * originalMatrix[i][j][0]);
            let green = parseInt(contrastValue * originalMatrix[i][j][1]);
            let blue = parseInt(contrastValue * originalMatrix[i][j][2]);
            const alpha = originalMatrix[i][j][3];
            contrastMatrix[i][j] = [red, green, blue, alpha];
        }
    }
    setVar('filterMatrix', contrastMatrix);
    setVar('appliedFilter', 'Contraste: ' + contrastValue);
    document.getElementById('image-contrast').src = matrixToDataURL(contrastMatrix);
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
        'diffABS': (a, b) => Math.abs(a - b),
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

        if (originalMatrix.length != secondaryMatrix.length | originalMatrix[0].length != secondaryMatrix[0].length) {
            Swal.fire("", "Imagens de tamanhos diferentes", "warning");
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

function crop(originalMatrix, width, height) {
    const croppedMatrix = [];
    let top = parseInt(document.getElementById('top-crop').value);
    let bottom = parseInt(document.getElementById('bottom-crop').value);
    let left =parseInt(document.getElementById('left-crop').value);
    let right = parseInt(document.getElementById('right-crop').value);

    top = isNaN(top) ? 0 : top;
    bottom = isNaN(bottom) ? 0 : bottom;
    left = isNaN(left) ? 0 : left;
    right = isNaN(right) ? 0 : right;

    top = Math.max(0, top);
    bottom = Math.max(0, bottom);
    left = Math.max(0, left);
    right = Math.max(0, right);

    const newWidth = width - left - right;
    const newHeight = height - top - bottom;

    if (newWidth < 1 | newHeight < 1) {
        Swal.fire("Erro", "Valores de corte maiores que a imagem!", "warning");
        return;
    }

    for (let i = top; i < height - bottom; i++) {
        croppedMatrix[i - top] = [];
        for (let j = left; j < width - right; j++) {
            croppedMatrix[i - top][j - left] = originalMatrix[i][j];
        }
    }
    setVar('filterMatrix', croppedMatrix);
    setVar('appliedFilter', 'Imagem recortada: ' + (newWidth) + ' x ' + (newHeight) + ' px');
    okFunction();
}

function cropSelection() {
    if (cropper) cropper.destroy();
    const image = document.getElementById('image-crop');

    cropper = new Cropper(image, {
        aspectRatio: NaN,
        viewMode: 1,
        crop(event) {
            if (updatingFromInput) {
                // Se a atualização foi desencadeada por um input, não atualize os inputs
                return;
            }
            const cropData = cropper.getData();
            const imageWidth = image.naturalWidth;
            const imageHeight = image.naturalHeight;
            const pixelsTop = parseInt(cropData.y);
            const pixelsBottom = parseInt(imageHeight - (cropData.y + cropData.height));
            const pixelsLeft = parseInt(cropData.x);
            const pixelsRight = parseInt(imageWidth - (cropData.x + cropData.width));

            document.getElementById('top-crop').value = pixelsTop;
            document.getElementById('bottom-crop').value = pixelsBottom;
            document.getElementById('left-crop').value = pixelsLeft;
            document.getElementById('right-crop').value = pixelsRight;
        }
    });
    document.getElementById('top-crop').addEventListener('input', () => updateCropperFromInput('top'));
    document.getElementById('bottom-crop').addEventListener('input', () => updateCropperFromInput('bottom'));
    document.getElementById('left-crop').addEventListener('input', () => updateCropperFromInput('left'));
    document.getElementById('right-crop').addEventListener('input', () => updateCropperFromInput('right'));
}

export function updateCropperFromInput(side) {
    updatingFromInput = true;
    const top = Math.max(0, parseInt(document.getElementById('top-crop').value));
    const bottom = Math.max(0, parseInt(document.getElementById('bottom-crop').value));
    const left = Math.max(0, parseInt(document.getElementById('left-crop').value));
    const right = Math.max(0, parseInt(document.getElementById('right-crop').value));

    const cropData = cropper.getData(true);
    const image = document.getElementById('image-crop');
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;

    switch (side) {
        case 'top':
            cropData.height = imageHeight - top - bottom;
            cropData.y = top;
            break;
        case 'bottom':
            cropData.height = imageHeight - top - bottom;
            break;
        case 'left':
            cropData.x = left;
            cropData.width = imageWidth - left - right;
            break;
        case 'right':
            cropData.width = imageWidth - left - right;
            break;
    }
    cropper.setData(cropData);
    updatingFromInput = false;
}

function histogram(originalMatrix, width, height) {
    const histogram = calculateHistogram(originalMatrix);
    const cdf = calculateCDF(histogram);    
    const totalPixels = width * height;
    const L = 256;
    const normalizedMatrix = [];

    const cdfMin = {
        r: cdf.r.find(value => value > 0),
        g: cdf.g.find(value => value > 0),
        b: cdf.b.find(value => value > 0)
    };

    for (let i = 0; i < height; i++) {
        normalizedMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            normalizedMatrix[i][j] = [];
            normalizedMatrix[i][j][0] = Math.floor(((cdf.r[originalMatrix[i][j][0]] - cdfMin.r) / (totalPixels - cdfMin.r)) * (L - 1));
            normalizedMatrix[i][j][1] = Math.floor(((cdf.g[originalMatrix[i][j][1]] - cdfMin.g) / (totalPixels - cdfMin.g)) * (L - 1));
            normalizedMatrix[i][j][2] = Math.floor(((cdf.b[originalMatrix[i][j][2]] - cdfMin.b) / (totalPixels - cdfMin.b)) * (L - 1));
            normalizedMatrix[i][j][3] = originalMatrix[i][j][3];
        }
    }    
    setVar('filterMatrix', normalizedMatrix);
    setVar('appliedFilter', 'Histograma equalizado');
    okFunction();    
}

function concatenate(originalMatrix, width, height, operator) {
    const concatenateMatrix = [];
    const img = new Image();
    img.src = document.getElementById('originalImage2').src;
    img.onload = function () {
        const secondaryMatrix = imageToMatrix(img);

        if (originalMatrix.length != secondaryMatrix.length) {
            Swal.fire("", "Imagens de alturas diferentes", "warning");
            return
        }

        for (let i = 0; i < height; i++) {
            concatenateMatrix[i] = [];
            for (let j = 0; j < width + secondaryMatrix[0].length; j++) {
                concatenateMatrix[i][j] = [];
                if (j < width) {
                    concatenateMatrix[i][j][0] = originalMatrix[i][j][0];
                    concatenateMatrix[i][j][1] = originalMatrix[i][j][1];
                    concatenateMatrix[i][j][2] = originalMatrix[i][j][2];
                    concatenateMatrix[i][j][3] = originalMatrix[i][j][3];
                }
                else {
                    concatenateMatrix[i][j][0] = secondaryMatrix[i][j - width][0];
                    concatenateMatrix[i][j][1] = secondaryMatrix[i][j - width][1];
                    concatenateMatrix[i][j][2] = secondaryMatrix[i][j - width][2];
                    concatenateMatrix[i][j][3] = secondaryMatrix[i][j - width][3];
                }  
            }
        }        
        setVar('filterMatrix', concatenateMatrix);
        setVar('appliedFilter', 'Concatenação');
        document.getElementById('modifiedImage').src = matrixToDataURL(concatenateMatrix);
    }
}