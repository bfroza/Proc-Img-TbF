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

    displayHistogram(getVar('previousMatrix'), 'histogramOriginal');
    displayHistogram(getVar('workingMatrix'), 'histogramModified');

    resizeImage();

    resetRangeInputs();
    resetLabelTexts();

    if (getVar('hideSecondaryImage') === true) closeSecondaryImage();
    setVar('hideSecondaryImage', true);
}

    export function calculateHistogram(matrix) {
    const width = matrix[0].length;
    const height = matrix.length;

    const histogram = {
        r: new Array(256).fill(0),
        g: new Array(256).fill(0),
        b: new Array(256).fill(0)
    };

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            histogram.r[matrix[i][j][0]]++;
            histogram.g[matrix[i][j][1]]++;
            histogram.b[matrix[i][j][2]]++;
        }
    }
    return histogram;
}

export function calculateCDF(histogram) {
    const cdf = {
        r: new Array(256).fill(0),
        g: new Array(256).fill(0),
        b: new Array(256).fill(0)
    };

    for (let i = 1; i < 256; i++) {
        cdf.r[i] = cdf.r[i - 1] + histogram.r[i];
        cdf.g[i] = cdf.g[i - 1] + histogram.g[i];
        cdf.b[i] = cdf.b[i - 1] + histogram.b[i];
    }
    return cdf;
}

export function displayHistogram(matrix, canvasId) {   
    
    const histogram = calculateHistogram(matrix);
    const ctx = document.getElementById(canvasId).getContext('2d');
    let newChart = getVar(canvasId);
    if (newChart instanceof Chart) {
        newChart.destroy();
    }    
    newChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 256 }, (_, i) => i),
            datasets: [
                {
                    label: 'Red',
                    backgroundColor: 'rgba(180, 0, 0, 1)',
                    data: histogram.r
                },
                {
                    label: 'Green',
                    backgroundColor: 'rgba(0, 150, 0, 1)',
                    data: histogram.g
                },
                {
                    label: 'Blue',
                    backgroundColor: 'rgba(0, 0, 190, 1)',
                    data: histogram.b
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 20
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    setVar(canvasId, newChart);
}