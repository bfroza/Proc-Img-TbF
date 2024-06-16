import { getVar, normalize, setVar, truncate } from "./utils.js";
import { calculateCDF, calculateHistogram, imageToMatrix, matrixToDataURL, okFunction } from "./imageProcessing.js";

export function applyMask(maskType, wildCard) {
    const maskFunctions = {
        'enhance': enhance,
        'border': border,
        'morphology': morphology
    };
    const originalMatrix = getVar('workingMatrix');
    const width = originalMatrix[0].length;
    const height = originalMatrix.length;

    maskFunctions[maskType](originalMatrix, width, height, wildCard);
}

function enhance(originalMatrix, width, height) {
    const operations = {
        max: values => Math.max(...values),
        min: values => Math.min(...values),
        average: values => {
            const sum = values.reduce((a, b) => a + b, 0);
            return Math.floor(sum / values.length);
        },
        median: values => {
            const sortedValues = values.slice().sort((a, b) => a - b);
            const middleIndex = Math.floor(sortedValues.length / 2);
            return sortedValues[middleIndex];
        },
        order: (values) => {
            const k = parseInt(document.getElementById('filter-input').value - 1);
            if (k >= values.length) return -1;
            const sortedValues = values.slice().sort((a, b) => a - b);
            return sortedValues[k];
        },
        conservativeSmoothing: values => {
            const centralIndex = Math.floor(values.length / 2);
            const centralValue = values[centralIndex];
            const neighbors = values.slice(0, centralIndex).concat(values.slice(centralIndex + 1));
            const minValue = Math.min(...neighbors);
            const maxValue = Math.max(...neighbors);
            if (centralValue > maxValue) {
                return maxValue;
            } else if (centralValue < minValue) {
                return minValue;
            } else {
                return centralValue;
            }
        },
        gaussian: values => {
            const maskSize = parseInt(document.getElementById('mask-select').value);
            const sigma = parseFloat(document.getElementById('sigma-input')?.value || 1.0);
            const kernel = [];
            const mean = Math.floor(maskSize / 2);
            let sum = 0;

            for (let x = 0; x < maskSize; x++) {
                kernel[x] = [];
                for (let y = 0; y < maskSize; y++) {
                    kernel[x][y] = (1 / (2 * Math.PI * sigma * sigma)) * Math.exp(-((x - mean) ** 2 + (y - mean) ** 2) / (2 * sigma * sigma));
                    sum += kernel[x][y];
                }
            }

            for (let x = 0; x < maskSize; x++) {
                for (let y = 0; y < maskSize; y++) {
                    kernel[x][y] /= sum;
                }
            }

            let newValue = 0;
            for (let i = 0; i < maskSize; i++) {
                for (let j = 0; j < maskSize; j++) {
                    newValue += values[i * maskSize + j] * kernel[i][j];
                }
            }
            return Math.floor(newValue);
        }
    };

    const operation = document.getElementById('filter-select').value;
    const maskSize = parseInt(document.getElementById('mask-select').value);

    if (operation === "" || maskSize === "") return;

    const enhancedMatrix = JSON.parse(JSON.stringify(originalMatrix));
    const offset = Math.floor(maskSize / 2);

    for (let i = offset; i < height - offset; i++) {
        for (let j = offset; j < width - offset; j++) {
            for (let c = 0; c < 3; c++) {
                let values = [];

                for (let x = -offset; x <= offset; x++) {
                    for (let y = -offset; y <= offset; y++) {
                        values.push(originalMatrix[i + x][j + y][c]);
                    }
                }
                enhancedMatrix[i][j][c] = operations[operation](values);
                if (enhancedMatrix[i][j][c] === -1) {
                    Swal.fire("Erro", "Digite um valor de Ordem válido / Máximo: " + maskSize * maskSize, "warning");
                    return;
                }
            }
        }
    }
    setVar('filterMatrix', enhancedMatrix);
    setVar('appliedFilter', 'Realce: ' + operation + " / Máscara " + maskSize + "x" + maskSize);
    document.getElementById('image-filters').src = matrixToDataURL(enhancedMatrix);
}



function border(originalMatrix, width, height, wildCard) {
    const operations = {
        prewitt: (maskSize) => {
            const halfSize = Math.floor(maskSize / 2);
            const Gx = Array.from({ length: maskSize }, (_, i) => Array(maskSize).fill(0));
            const Gy = Array.from({ length: maskSize }, (_, i) => Array(maskSize).fill(0));

            for (let i = -halfSize; i <= halfSize; i++) {
                for (let j = -halfSize; j <= halfSize; j++) {
                    Gx[i + halfSize][j + halfSize] = j;
                    Gy[i + halfSize][j + halfSize] = i;
                }
            }
            if (Gx != "") {
                console.log('Prewitt ' + maskSize + ' x ' + maskSize)
                console.log(Gx, Gy)
            }

            return { Gx, Gy };
        },
        sobel: (maskSize) => {
            const halfSize = Math.floor(maskSize / 2);
            const Gx = Array.from({ length: maskSize }, (_, i) => Array(maskSize).fill(0));
            const Gy = Array.from({ length: maskSize }, (_, i) => Array(maskSize).fill(0));

            for (let i = -halfSize; i <= halfSize; i++) {
                for (let j = -halfSize; j <= halfSize; j++) {
                    Gx[i + halfSize][j + halfSize] = j * (halfSize + 1 - Math.abs(i));
                    Gy[i + halfSize][j + halfSize] = i * (halfSize + 1 - Math.abs(j));
                }
            }
            if (Gx != "") {
                console.log('Sobel ' + maskSize + ' x ' + maskSize)
                console.log(Gx, Gy)
            }

            return { Gx, Gy };
        },

        laplacian: (maskSize) => {
            const mask = Array.from({ length: maskSize }, (_, i) => Array(maskSize).fill(-1));
            const center = Math.floor(maskSize / 2);
            mask[center][center] = maskSize * maskSize - 1;

            if (mask != "") {
                console.log('Laplacian ' + maskSize + ' x ' + maskSize);
                console.log(mask);
            }

            return mask;

        }
    }
    const operation = document.getElementById('filter-select-border').value;
    const maskSize = parseInt(document.getElementById('mask-select-border').value);
    if (operation === "" || maskSize === "") return;
    const kernel = operations[operation](maskSize);
    const halfKernelSize = Math.floor(maskSize / 2);
    const borderedMatrix = JSON.parse(JSON.stringify(originalMatrix));

    for (let i = halfKernelSize; i < height - halfKernelSize; i++) {
        for (let j = halfKernelSize; j < width - halfKernelSize; j++) {
            for (let c = 0; c < 3; c++) {
                let sumGx = 0;
                let sumGy = 0;

                for (let k = -halfKernelSize; k <= halfKernelSize; k++) {
                    for (let l = -halfKernelSize; l <= halfKernelSize; l++) {
                        const row = i + k;
                        const col = j + l;

                        if (operation === 'prewitt' || operation === 'sobel') {
                            sumGx += originalMatrix[row][col][c] * kernel.Gx[k + halfKernelSize][l + halfKernelSize];
                            sumGy += originalMatrix[row][col][c] * kernel.Gy[k + halfKernelSize][l + halfKernelSize];
                        } else if (operation === 'laplacian') {
                            sumGx += originalMatrix[row][col][c] * kernel[k + halfKernelSize][l + halfKernelSize];
                        }
                    }
                }
                if (operation === 'prewitt' || operation === 'sobel') {
                    const G = Math.sqrt(sumGx * sumGx + sumGy * sumGy);
                    borderedMatrix[i][j][c] = G;
                } else if (operation === 'laplacian') {
                    borderedMatrix[i][j][c] = sumGx;
                }
            }
        }
    }
    setVar('filterMatrix', borderedMatrix);
    setVar('appliedFilter', 'Border: ' + operation + " / Máscara " + maskSize + "x" + maskSize);
    document.getElementById('image-filters-border').src = matrixToDataURL(borderedMatrix);
}



function morphology(originalMatrix, width, height, wildCard) {
    const operations = {
        dilation: (matrix, kernel) => {
            const dilatedMatrix = JSON.parse(JSON.stringify(matrix));
            const halfKernel = Math.floor(kernel.length / 2);

            for (let i = halfKernel; i < height - halfKernel; i++) {
                for (let j = halfKernel; j < width - halfKernel; j++) {
                    for (let c = 0; c < 3; c++) {
                        let max = 0;
                        for (let k = -halfKernel; k <= halfKernel; k++) {
                            for (let l = -halfKernel; l <= halfKernel; l++) {
                                const value = matrix[i + k][j + l][c];
                                if (value > max) {
                                    max = value;
                                }
                            }
                        }
                        dilatedMatrix[i][j][c] = max;
                    }
                }
            }
            return dilatedMatrix;
        },
        erosion: (matrix, kernel) => {
            const erodedMatrix = JSON.parse(JSON.stringify(matrix));
            const halfKernel = Math.floor(kernel.length / 2);

            for (let i = halfKernel; i < height - halfKernel; i++) {
                for (let j = halfKernel; j < width - halfKernel; j++) {
                    for (let c = 0; c < 3; c++) {
                        let min = 255;
                        for (let k = -halfKernel; k <= halfKernel; k++) {
                            for (let l = -halfKernel; l <= halfKernel; l++) {
                                const value = matrix[i + k][j + l][c];
                                if (value < min) {
                                    min = value;
                                }
                            }
                        }
                        erodedMatrix[i][j][c] = min;
                    }
                }
            }
            return erodedMatrix;
        },
        opening: (matrix, kernel) => {
            const erodedMatrix = operations.erosion(matrix, kernel);
            return operations.dilation(erodedMatrix, kernel);
        },
        closing: (matrix, kernel) => {
            const dilatedMatrix = operations.dilation(matrix, kernel);
            return operations.erosion(dilatedMatrix, kernel);
        },
        contour: (matrix, kernel) => {
            const erodedMatrix = operations.erosion(matrix, kernel);
            const contourMatrix = JSON.parse(JSON.stringify(matrix));

            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    for (let c = 0; c < 3; c++) {
                        contourMatrix[i][j][c] = matrix[i][j][c] - erodedMatrix[i][j][c];
                    }
                }
            }
            return contourMatrix;
        }
    };

    const operation = document.getElementById('filter-select-morphology').value;
    const maskSize = parseInt(document.getElementById('mask-select-morphology').value);
    if (operation === "" | maskSize === "") return;

    const kernel = Array.from({ length: maskSize }, () => Array(maskSize).fill(1));
    const morphedMatrix = operations[operation](originalMatrix, kernel);

    setVar('filterMatrix', morphedMatrix);
    setVar('appliedFilter', 'Morfologia: ' + operation + " / Máscara " + maskSize + "x" + maskSize);
    document.getElementById('image-filters-morphology').src = matrixToDataURL(morphedMatrix);
}
