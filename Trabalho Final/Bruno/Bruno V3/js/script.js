let workingMatrix1 = [];
let workingMatrix2 = [];
let workingMatrix = [];
let originalMatrix = [];
let brightness_last_value = 0;
let teste = false
let button = '';


document.addEventListener("DOMContentLoaded", function () {  
    
    async function firstload () {        
        originalMatrix = await imageToMatrix(); 
        workingMatrix = originalMatrix.slice();
        workingMatrix1 = originalMatrix.slice();
        workingMatrix2 = originalMatrix.slice();
        console.log(5 ^ 3)
    };
    firstload();

    document.getElementById('fileInput').addEventListener('click', function () {
        this.value = null;
    });

    document.getElementById('fileInput_2').addEventListener('click', function () {
        this.value = null;
    });

    document.getElementById('fileInput').addEventListener('change', async function (event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            document.getElementById('originalImage').src = URL.createObjectURL(imageFile);
            document.getElementById('modifiedImage').src = URL.createObjectURL(imageFile);
            workingMatrix = await imageToMatrix();
            workingMatrix1 = await imageToMatrix();
        }
    });
    document.getElementById('recortarImage_num').addEventListener('click', function () {
        var popup = document.getElementById("popup-recortar_num");
        popup.style.display = "block";
    
        document.getElementById('pop-up-button-ok-recortar_num').addEventListener('click', function () {
            popup.style.display = "none";
            applyFilter('recortar')
        
        });
        document.getElementById("pop-up-cancel-recortar_num").addEventListener('click', function () {
            workingMatrix = originalMatrix.slice();
            applyFilter('normal')
            popup.style.display = "none";
        });
    });
    document.getElementById('fileInput_2').addEventListener('change', async function (event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            document.getElementById('originalImage2').src = URL.createObjectURL(imageFile);
            document.getElementById('modifiedImage').src = URL.createObjectURL(imageFile);
            workingMatrix2 = await imageToMatrix();
        }
    });

    

    document.getElementById('btn-brilho').addEventListener('click', function () {
        document.getElementById('range_brightness').value = 0;
        document.getElementById('brightness_label').innerText = 0;
        document.getElementById('range_brightness').addEventListener('change', function () {
            document.getElementById('brightness_label').innerText = document.getElementById('range_brightness').value;
            applyFilter('brightness');
        });
        var popup = document.getElementById("popup-brilho");
        popup.style.display = "block";
    
        document.getElementById('pop-up-button-ok-brilho').addEventListener('click', function () {
            popup.style.display = "none";
        
        });
        document.getElementById("pop-up-cancel-brilho").addEventListener('click', function () {
            workingMatrix = originalMatrix.slice();
            applyFilter('normal')
            popup.style.display = "none";
        });
    });
    
    document.getElementById('btn-contraste').addEventListener('click', function () {
        document.getElementById('contraste_label').innerText = 0;
        document.getElementById('range_contraste').value = 0;
        var popup = document.getElementById("popup-contraste");
        popup.style.display = "block";

        document.getElementById("pop-up-button-ok-contraste").addEventListener('click', function () {
            popup.style.display = "none";
            // applyFilter('contraste');
        });
        document.getElementById("pop-up-cancel-contraste").addEventListener('click', function () {
            workingMatrix = originalMatrix.slice();
            applyFilter('normal')
            popup.style.display = "none";
        });
    });
    
    document.getElementById('btn-binarize').addEventListener('click', function () {
        document.getElementById('binarize_label').innerText = 128;
        document.getElementById('range_binarize').value = 128;
        document.getElementById('range_binarize').addEventListener('change', function () {
            document.getElementById('binarize_label').innerText = document.getElementById('range_binarize').value;
            applyFilter('binarize');
        });
        var popup = document.getElementById("popup-binarize");
        popup.style.display = "block";
        document.getElementById("pop-up-button-ok-binarizar").addEventListener('click', function () {
            popup.style.display = "none";
        });
        document.getElementById("pop-up-cancel-binarize").addEventListener('click', function () {
            popup.style.display = "none";
            workingMatrix = originalMatrix.slice();
            applyFilter('normal')
        });
    
    });
    
    document.getElementById('multiConstButton').addEventListener('click', function () {
        var popup = document.getElementById("popup-multi");
        popup.style.display = "block";
        document.getElementById("pop-up-button-ok-multi").addEventListener('click', function () {
            popup.style.display = "none";
            applyFilter('multiConstante')
        });
        document.getElementById("pop-up-cancel-multi").addEventListener('click', function () {
            popup.style.display = "none";
            workingMatrix = originalMatrix.slice();
            applyFilter('normal')
        });
    
    });

    document.getElementById('divisionConstButton').addEventListener('click', function () {
        var popup = document.getElementById("popup-division");
        popup.style.display = "block";
        document.getElementById("pop-up-button-ok-division").addEventListener('click', function () {
            popup.style.display = "none";
            applyFilter('divisionConstante')
        });
        document.getElementById("pop-up-cancel-division").addEventListener('click', function () {
            popup.style.display = "none";
            workingMatrix = originalMatrix.slice();
            applyFilter('normal')
        });
    
    });

    document.getElementById('negativeButton').addEventListener('click', function () {
        applyFilter('negative');
    });

    document.getElementById('grayButton').addEventListener('click', function () {
        applyFilter('gray');
    });
    document.getElementById('btn-equalizar').addEventListener('click', function () {
        applyFilter('equalizar');
    });
    document.getElementById('multiButton').addEventListener('click', function () {
        applyFilter('multi');
    });
    document.getElementById('divisionButton').addEventListener('click', function () {
        applyFilter('division');
    });
    
    document.getElementById('normalButton').addEventListener('click', function () {
        applyFilter('normal');
    });
    document.getElementById('diffAbsButton').addEventListener('click', function () {
        applyFilter('diffAbs');
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

    document.getElementById('notButton').addEventListener('click', function () {
        applyFilter('not');
    });

    document.getElementById('andButton').addEventListener('click', function () {
        applyFilter('and');
    });

    document.getElementById('orButton').addEventListener('click', function () {
        applyFilter('or');
    });

    document.getElementById('xorButton').addEventListener('click', function () {
        applyFilter('xor');
    });
    
    document.getElementById('secundaryButton').addEventListener('click', function () {        
        document.getElementById("display").classList.toggle("hidden");
        teste = true
    });

    document.getElementById('sumButton').addEventListener('click', function () {
        if(teste){
            applyFilter('sum');
        } else {
            Swal.fire("", "Adicione uma imagem para a soma", "warning");
        }
    });

    document.getElementById('subButton').addEventListener('click', function () {
        if(teste){
            applyFilter('sub');
        } else {
            Swal.fire("", "Adicione uma imagem para a subtrair", "warning");
        }
    });
    
});

function  imageToMatrix() {
    atualizarImagemCorte();
    updateHistogram(workingMatrix);
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
        atualizarImagemCorte();
        img.src = document.getElementById('modifiedImage').src; 
        
    });
    
}


async function applyFilter(filterType, croppedData) {
    updateHistogram(workingMatrix);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.willReadFrequently = true;
    const img = new Image();
    img.src = document.getElementById('originalImage').src;
    if (croppedData) {
        canvas.width = croppedData.width;
        canvas.height = croppedData.height;
    }
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    let modifiedMatrix = [];
    let modifiedMatrix2 = [];
    const originalMatrix = workingMatrix;

    const brightness_value = document.getElementById('range_brightness').value
    const limiar = document.getElementById('range_binarize').value

    if (teste) {
        const height1 = workingMatrix1.length;
        const width1 = workingMatrix1[0].length;
        const height2 = workingMatrix2.length;
        const width2 = workingMatrix2[0].length;

        if (height1 != height2 && width1 != width2) {
            Swal.fire("", "As dimensões das imagens têm que ser as mesmas", "warning");
            return (false);
        }
    }

    switch (filterType) {
        case 'negative':
            modifiedMatrix = negative(workingMatrix, width, height);
            workingMatrix = modifiedMatrix;
            brightness_last_value = 0;
            break;
        case 'gray':
            modifiedMatrix = gray(workingMatrix, width, height);
            workingMatrix = modifiedMatrix;
            break;
        case 'binarize':
            const limiar = document.getElementById('range_binarize').value
            modifiedMatrix = binarize(workingMatrix, width, height, limiar);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height, limiar);
            workingMatrix = modifiedMatrix;
            return;
        case 'brightness':
            // console.log(workingMatrix)
            const brightness_value = parseInt(document.getElementById('range_brightness').value);
            modifiedMatrix = applyArithmeticOperation(workingMatrix, width, height, brightness_value,add);
            // modifiedMatrix = brightness(workingMatrix, width, height, brightness_value);
            workingMatrix = modifiedMatrix;
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height, brightness_value);
            // console.log(workingMatrix)
            return;
        case 'sum':
            modifiedMatrix = applyArithmeticOperationDoubleImage(width, height, workingMatrix1, workingMatrix2,add);
            workingMatrix = modifiedMatrix;
            document.getElementById('modifiedImage').src = max_min(modifiedMatrix, width, height);
            return;
        case 'multi':
            modifiedMatrix = applyArithmeticOperationDoubleImage(width, height, workingMatrix1, workingMatrix2,multiply);
            workingMatrix = modifiedMatrix;
            document.getElementById('modifiedImage').src = max_min(modifiedMatrix, width, height);
            updateHistogram(workingMatrix);
            return;
        case 'division':
            modifiedMatrix = applyArithmeticOperationDoubleImage(width, height, workingMatrix1, workingMatrix2,divide)
            workingMatrix = modifiedMatrix;
            document.getElementById('modifiedImage').src = max_min(modifiedMatrix, width, height);
            updateHistogram(workingMatrix);
            return;
        case 'sub':
            modifiedMatrix = applyArithmeticOperationDoubleImage(width, height, workingMatrix1, workingMatrix2,subtract)
            workingMatrix = modifiedMatrix;
            // document.getElementById('modifiedImage').src = max_min(modifiedMatrix, width, height);
            //desta forma realiza os calculos
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            //desta realiza o trucamento seco
            break;
        case 'multiConstante':
            const multi_value = parseFloat(document.getElementById('inputmulti').value);
            console.log(multi_value)
            modifiedMatrix = applyArithmeticOperation(workingMatrix, width, height, multi_value,multiply);
            workingMatrix = modifiedMatrix;
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height, multi_value);
            // console.log(workingMatrix)
            return;

        case 'divisionConstante':
            const division_value = parseFloat(document.getElementById('inputdivision').value);
            modifiedMatrix = applyArithmeticOperation(workingMatrix, width, height, division_value,divide);
            workingMatrix = modifiedMatrix;
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height, division_value);
            return;
        case 'rotateLeft':
            modifiedMatrix = rotateLeft(workingMatrix, width, height);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            break;
        
        case 'not':
            modifiedMatrix = binarize(workingMatrix, width, height, 128);
            modifiedMatrix = not(modifiedMatrix, width, height);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height,128);
            workingMatrix = modifiedMatrix;
            break;

        case 'or':
            modifiedMatrix = binarize(workingMatrix1, width, height, 128);
            modifiedMatrix2 = binarize(workingMatrix2, width, height, 128);
            modifiedMatrix = applyBitwiseOperation(modifiedMatrix,modifiedMatrix2, width, height,'|'); 
            //o operador é definido por parâmetro ( esse é o or) Ex: 10101 
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height,128);
            workingMatrix = modifiedMatrix;
            break;
        case 'and':
            modifiedMatrix = binarize(workingMatrix1, width, height, 128);
            modifiedMatrix2 = binarize(workingMatrix2, width, height, 128);
            modifiedMatrix = applyBitwiseOperation(modifiedMatrix,modifiedMatrix2, width, height,'&');
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height,128);
            workingMatrix = modifiedMatrix;
            break;
        case 'xor':
            modifiedMatrix = binarize(workingMatrix1, width, height, 128);
            modifiedMatrix2 = binarize(workingMatrix2, width, height, 128);
            modifiedMatrix = applyBitwiseOperation(modifiedMatrix,modifiedMatrix2, width, height,'^');
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height,128);
            workingMatrix = modifiedMatrix;
            break;
        case 'equalizar':
            modifiedMatrix = equalizeHistogram(workingMatrix);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            updateHistogram(modifiedMatrix);
            workingMatrix = modifiedMatrix;
            return;
        case 'diffAbs':
            modifiedMatrix = diffAbs(workingMatrix1, workingMatrix2,width, height,);
            workingMatrix = modifiedMatrix;
            // document.getElementById('modifiedImage').src = max_min(modifiedMatrix, width, height);
            //desta forma realiza os calculos
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            //desta realiza o trucamento seco
            return;
        case 'rotateRight':
            modifiedMatrix = rotateRight(workingMatrix, width, height);
            break;
        case 'flipHorizontal':
            modifiedMatrix = flipHorizontal(workingMatrix, width, height);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            workingMatrix = modifiedMatrix;
            return;
        case 'flipVertical':
            modifiedMatrix = flipVertical(workingMatrix, width, height);
            document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, width, height);
            workingMatrix = modifiedMatrix;
            return;
        case 'normal':
            document.getElementById('modifiedImage').src = matrixToDataURL(workingMatrix1, width, height);
            // console.log(workingMatrix)
            return;
        case 'recortar':
            
            if (croppedData) {
                const startX = croppedData.x;
                const startY = croppedData.y;
                const endX = croppedData.width;
                const endY = croppedData.height;
                // console.log(startX, startY, endX, endY)


                modifiedMatrix = await cropImage(workingMatrix, startX, startY, endX, endY);
                // console.log(modifiedMatrix)
                document.getElementById('modifiedImage').src = matrixToDataURL(modifiedMatrix, endX, endY);
                workingMatrix = modifiedMatrix
                atualizarImagemCorte();

            }
            break;
        default:
            return;
    }
    // console.log(workingMatrix)
    document.getElementById('modifiedImage').src = await matrixToDataURL(workingMatrix, width, height);
    atualizarImagemCorte()

}

function atualizarImagemCorte() {
    var modifiedImageSrc = document.getElementById('modifiedImage').src;
    document.getElementById('corteImage').src = modifiedImageSrc;
}

async function cropImage(originalMatrix, startX, startY, endX, endY) {
    const croppedMatrix = [];
    for (let i = startY; i < startY + endY; i++) {
        croppedMatrix[i - startY] = [];
        for (let j = startX; j < startX + endX; j++) {
            croppedMatrix[i - startY][j - startX] = originalMatrix[i][j];
        }
    }
    // console.log(croppedMatrix)
    return croppedMatrix;
}

function max_min(modifiedMatrix, width, height) {
    let minValueRed = modifiedMatrix[0][0][0];
    let maxValueRed = modifiedMatrix[0][0][0];
    let minValueGreen = modifiedMatrix[0][0][1];
    let maxValueGreen = modifiedMatrix[0][0][1];
    let minValueBlue = modifiedMatrix[0][0][2];
    let maxValueBlue = modifiedMatrix[0][0][2];
    const normalizedMatrix = [];

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
            normalizedMatrix[i][j][0] = parseInt((255 / (maxValueRed - minValueRed))*(modifiedMatrix[i][j][0] - minValueRed));
            normalizedMatrix[i][j][1] = parseInt((255 / (maxValueGreen - minValueGreen))*(modifiedMatrix[i][j][1] - minValueGreen));
            normalizedMatrix[i][j][2] = parseInt((255 / (maxValueBlue - minValueBlue))*(modifiedMatrix[i][j][2] - minValueBlue));
            normalizedMatrix[i][j][3] = modifiedMatrix[i][j][3];
        }
    }
   
    return matrixToDataURL(normalizedMatrix, width, height);
}

function truncate(value) {
    if (value > 255) {
        value = 255;
    }
    if (value < 0) {
        value = 0
    }

    return value;
}
function matrixToDataURL(modifiedMatrix, width, height) {
    const canvas = document.createElement('canvas');
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
            modifiedArray[index] = modifiedMatrix[i][j][0];
            modifiedArray[index + 1] = modifiedMatrix[i][j][1];
            modifiedArray[index + 2] = modifiedMatrix[i][j][2];
            modifiedArray[index + 3] = modifiedMatrix[i][j][3];
        }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

function not(originalMatrix, width, height) {
    const notMatrix = [];
    for (let i = 0; i < height; i++) {
        notMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            let red = originalMatrix[i][j][0];
            let green = originalMatrix[i][j][1];
            let blue = originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];

            //isso é um if reduzido
            red = red === 0 ? 255 : red === 255 ? 0 : red;
            green = green === 0 ? 255 : green === 255 ? 0 : green;
            blue = blue === 0 ? 255 : blue === 255 ? 0 : blue;

            notMatrix[i][j] = [red, green, blue, alpha];
        }
    }
    return notMatrix;
}
function applyBitwiseOperation(matrix1, matrix2, width, height, operator) {
    const resultMatrix = [];
    for (let i = 0; i < height; i++) {
        resultMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            const pixel1 = matrix1[i][j];
            const pixel2 = matrix2[i][j];
            const resultPixel = [
                eval(`pixel1[0] ${operator} pixel2[0]`), 
                eval(`pixel1[1] ${operator} pixel2[1]`), 
                eval(`pixel1[2] ${operator} pixel2[2]`), 
                pixel1[3], 
                pixel2[3]
            ];
            resultMatrix[i][j] = resultPixel;
        }
    }
    return resultMatrix;
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
    return negativeMatrix;
}

function brightness(originalMatrix, width, height, brightness_value) {

    const brightnessMatrix = [];
    for (let i = 0; i < height; i++) {
        brightnessMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            let red = parseInt(brightness_value - brightness_last_value) + originalMatrix[i][j][0];
            let green = parseInt(brightness_value - brightness_last_value) + originalMatrix[i][j][1];
            let blue = parseInt(brightness_value - brightness_last_value) + originalMatrix[i][j][2];
            const alpha = originalMatrix[i][j][3];
            brightnessMatrix[i][j] = [red, green, blue, alpha];
        }
    }

    return brightnessMatrix;
}

function applyArithmeticOperation(originalMatrix, width, height, value, operation) {
    const resultMatrix = [];
    for (let i = 0; i < height; i++) {
        resultMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            const pixel = originalMatrix[i][j];
            const resultPixel = [
                operation(pixel[0], value),
                operation(pixel[1], value),
                operation(pixel[2], value),
                pixel[3]
            ];
            resultMatrix[i][j] = resultPixel;
        }
    }
    return resultMatrix;
}


function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }


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
    return grayMatrix;
}

function binarize(originalMatrix, width, height, limiar) {
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
            binayMatrix[i][j] = [binaryPixel, binaryPixel, binaryPixel, alpha];
        }
    }
    return binayMatrix;
}

function applyArithmeticOperationDoubleImage(width, height, matrix1, matrix2, operation) {
    const resultMatrix = [];
    for (let i = 0; i < height; i++) {
        resultMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            const pixel1 = matrix1[i][j];
            const pixel2 = matrix2[i][j];
            const resultPixel = [
                operation(pixel1[0], pixel2[0]), 
                operation(pixel1[1], pixel2[1]), 
                operation(pixel1[2], pixel2[2]), 
                pixel1[3],
            ];
            resultMatrix[i][j] = resultPixel;
        }
    }
    return resultMatrix;
}

function diffAbs(matrix1, matrix2, width, height) {
    const absDiffMatrix = [];
    for (let i = 0; i < height; i++) {
        absDiffMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            const redDiff = Math.abs(matrix1[i][j][0] - matrix2[i][j][0]);
            const greenDiff = Math.abs(matrix1[i][j][1] - matrix2[i][j][1]);
            const blueDiff = Math.abs(matrix1[i][j][2] - matrix2[i][j][2]);
            const alpha = matrix1[i][j][3];
            absDiffMatrix[i][j] = [redDiff, greenDiff, blueDiff, alpha];
        }
    }
    return absDiffMatrix;
}

function flipVertical(originalMatrix, width, height) {
    const flippedMatrix = [];
    for (let i = 0; i < height; i++) {
        flippedMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            flippedMatrix[i][j] = originalMatrix[i][width - j - 1];
        }
    }
    return flippedMatrix;
}

function flipHorizontal(originalMatrix, width, height) {
    const flippedMatrix = [];
    for (let i = 0; i < height; i++) {
        flippedMatrix[i] = [];
        for (let j = 0; j < width; j++) {
            flippedMatrix[i][j] = originalMatrix[height - i - 1][j];
        }
    }
    return flippedMatrix;
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

let cropper;

document.getElementById('recortarImage').addEventListener('click', function () {
    const popup = document.getElementById("popup-recortar");
    popup.style.display = "block";
    
    const image = document.getElementById('corteImage');
    if (cropper) {
        cropper.destroy(); 
    }
    cropper = new Cropper(image, {
        aspectRatio: NaN,
        viewMode: 1,
    });

    document.getElementById('pop-up-button-ok-recortar').addEventListener('click', function () {
        popup.style.display = "none";
        const croppedData = cropper.getData(true); 
        applyFilter('recortar', croppedData);
    });

    document.getElementById("pop-up-cancel-recortar").addEventListener('click', function () {
        if (cropper) {
            cropper.destroy(); 
            cropper = null; 
        }
        popup.style.display = "none";
    });
});

function updateHistogram(matrix) {
    const flattenData = matrix.flat();
    const counts = {};
    flattenData.forEach(pixel => {
        const intensity = Math.round((truncate(pixel[0]) + truncate(pixel[1]) + truncate(pixel[2])) / 3); 
        counts[intensity] = counts[intensity] ? counts[intensity] + 1 : 1;
    });

    const intensities = Object.keys(counts).map(Number);
    const occurrences = Object.values(counts);

    const ctx = document.getElementById('histogram_modified').getContext('2d');
    if (window.histogramChart) {
        window.histogramChart.destroy(); 
    }
    window.histogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intensities.map(String), 
            datasets: [{
                label: 'Vezes repetidas',
                data: occurrences,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Intensidade das cores'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Vezes repetidas'
                    }
                }
            }
        }
    });
}
function getHistogramData(matrix) {
    const flattenData = matrix.flat();
    const counts = {};
    flattenData.forEach(pixel => {
        const intensity = Math.round((pixel[0] + pixel[1] + pixel[2]) / 3); 
        counts[intensity] = counts[intensity] ? counts[intensity] + 1 : 1;
    });

    const intensities = Object.keys(counts).map(Number);
    const occurrences = Object.values(counts);

    return { intensities, occurrences };
}

function equalizeHistogram(matrix) {
    const { intensities, occurrences } = getHistogramData(matrix);
    const totalPixels = matrix.length * matrix[0].length;

    
    let cumulativeFrequency = 0;
    const cdf = [];
    for (let i = 0; i < 256; i++) { 
        cumulativeFrequency += occurrences[i] || 0;
        cdf[i] = cumulativeFrequency / totalPixels;
    }

    
    const equalizedMatrix = matrix.map(row =>
        row.map(pixel => {
            const intensity = Math.round((pixel[0] + pixel[1] + pixel[2]) / 3); 
            const newIntensity = Math.floor(cdf[intensity] * 255);
            return [newIntensity, newIntensity, newIntensity, pixel[3]];
        })
    );

    return equalizedMatrix;
}

