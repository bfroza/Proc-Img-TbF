document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('fileInput').addEventListener('click', function() {
        this.value = null; 
    });

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            imageToMatrix(file);
        }
    });

    document.getElementById('negativeButton').addEventListener('click', function() {
        applyFilter('negative');
    });

    document.getElementById('grayButton').addEventListener('click', function() {
        applyFilter('gray');
    });

    document.getElementById('binarizeButton').addEventListener('click', function() {
        applyFilter('binarize');
    });
    document.getElementById('normalButton').addEventListener('click', function() {
        applyFilter('normal');
    });
    // document.getElementById('flipButton').addEventListener('click', function() {
    //     applyFilter('flip');
    // });
});

function applyFilter(filterType) {
    const originalImg = document.getElementById('originalImage');
    const canvas = document.createElement('canvas');
    canvas.width = originalImg.naturalWidth; 
    canvas.height = originalImg.naturalHeight; 
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImg, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let modifiedMatrix;

    switch (filterType) {
        case 'negative':
            modifiedMatrix = negative(matrixFromImageData(imageData), canvas.width, canvas.height);
            break;
        case 'gray':
            modifiedMatrix = gray(matrixFromImageData(imageData), canvas.width, canvas.height);
            break;
        case 'binarize':
            modifiedMatrix = binarize(matrixFromImageData(imageData), canvas.width, canvas.height, 127);
            break;
        case 'normal':
            modifiedMatrix = original(matrixFromImageData(imageData), canvas.width, canvas.height);
            break;
        // case 'flip':
        //     modifiedMatrix = flip(matrixFromImageData(imageData), canvas.width, canvas.height);
        //     break;
        default:
            return;
    }

    document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, canvas.width, canvas.height);
}


function matrixFromImageData(imageData) {
    const pixels = imageData.data;
    const matrix = [];

    for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const alpha = pixels[i + 3];
        matrix.push([red, green, blue, alpha]);
    }

    return matrix;
}

function original(matrix, width, height) {
    
    const originalMatrix = [];
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = i * width + j;
            const red = matrix[index][0];
            const green = matrix[index][1];
            const blue = matrix[index][2];
            const alpha = matrix[index][3];
            originalMatrix.push([red, green, blue, alpha]);
        }
    }
    matriz2x2(matrix,width,height)
    return originalMatrix;
}


// function flip(matrix, width, height) {
//     const flippedMatrix = [];
//     for (let i = height - 1; i >= 0; i--) { 
//         for (let j = 0; j < width; j++) {
//             const index = i * width + j;
//             const red = matrix[index][0];
//             const green = matrix[index][1];
//             const blue = matrix[index][2];
//             const alpha = matrix[index][3];
//             flippedMatrix.push([red, green, blue, alpha]);
//         }
//     }
//     return flippedMatrix;
// }

function teste(matriz,width,height){
    const batata = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            console.log(matriz[i][j])
            console.log(matriz[i][j])
            console.log(matriz[i][j])
            console.log(matriz[i][j])

            batata = matriz

        }

}}
function matriz2x2(matrix, width, height) {
    const matriz = [];
    for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            const index = (i * width + j) * 4; // Multiplica por 4 pois cada pixel tem 4 valores RGBA
            const pixelValues = matrix.slice(index, index + 4); // Obtém os valores do pixel
            row.push(pixelValues);
        }
        matriz.push(row);
    }
    console.log(matriz)
    teste(matrix, width, height)
    return matriz;
}
function gray(matrix, width, height) {
    const grayMatrix = [];
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = (i * width + j);
            const red = matrix[index][0];
            const green = matrix[index][1];
            const blue = matrix[index][2];
            const imgGray = Math.round(red * 0.3 + green * 0.59 + blue * 0.11);
            const alpha = matrix[index][3];
            grayMatrix.push([imgGray, imgGray, imgGray, alpha]);
        }
    }
    return grayMatrix;
}




function negative(matrix, width, height) {
    const negativeMatrix = [];
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = (i * width + j);
            const red = 255 - matrix[index][0];
            const green = 255 - matrix[index][1];
            const blue = 255 - matrix[index][2];
            const alpha = matrix[index][3];
            negativeMatrix.push([red, green, blue, alpha]);
        }
    }
    return negativeMatrix;
}

function binarize(matrix, width, height, threshold) {
    const binarizedMatrix = [];
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = (i * width + j);
            const red = matrix[index][0];
            const green = matrix[index][1];
            const blue = matrix[index][2];
            const alpha = matrix[index][3];
            const grayValue = (red + green + blue) / 3;
            const binaryValue = grayValue > threshold ? 255 : 0;
            binarizedMatrix.push([binaryValue, binaryValue, binaryValue, alpha]);
        }
    }
    return binarizedMatrix;
}

function matrixToDataURL(matrix, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;

    for (let i = 0; i < matrix.length; i++) {
        const pixel = matrix[i];
        pixels[i * 4] = pixel[0]; // red
        pixels[i * 4 + 1] = pixel[1]; // green
        pixels[i * 
        4 + 2] = pixel[2]; // blue
        pixels[i * 4 + 3] = pixel[3]; // alpha
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
}

function imageToMatrix(imageFile) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;

        const width = canvas.width;
        const height = canvas.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;
        const matrix = [];

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const index = (i * width + j) * 4;
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                matrix.push([red, green, blue, alpha]);
            }
        }

        const grayMatrix = gray(matrix, width, height);
        // const flippedMatrix = flip(matrix, width, height);
        const negativeMatrix = negative(matrix, width, height);
        const binarizedMatrix = binarize(matrix, width, height, 202);
        const originalMatrix = original(matrix, width,height)
       const matriz2x2 =  matriz2x2(matrix, width, height)

        displayImages(img, grayMatrix, negativeMatrix, binarizedMatrix,originalMatrix);
    };

    img.src = URL.createObjectURL(imageFile);
}

function displayImages(originalImg, grayMatrix, negativeMatrix, binarizedMatrix,originalMatrix) {
    document.getElementById('originalImage').src = originalImg.src;
    document.getElementById('modifiedImage').src = matrixToDataURL(originalMatrix, originalImg.width, originalImg.height);
}


function downloadImage() {
    const tipoDeImagem = document.getElementById("select-tipo-imgs").value
    console.log(tipoDeImagem.value)
    const modifiedImg = document.getElementById('modifiedImage');
    const imageURL = modifiedImg.src;
    
    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = 'modified_image.'+ tipoDeImagem;
    downloadLink.style.display = 'none'; 
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

document.getElementById('downloadButton').addEventListener('click', downloadImage);

