import { imageToMatrix, okFunction, matrixToDataURL, displayHistogram } from './imageProcessing.js';
import { downloadImage, setVar, getVar, openSecondaryImage, closeSecondaryImage, resizeImage } from './utils.js';
import { applyFilter } from './filters.js';
import { applyMask } from './masks.js';




export function setupEventListeners() {

    //INPUTS

    document.getElementById('fileInput').addEventListener('click', function () {
        this.value = null;
    });

    document.getElementById('fileInput_2').addEventListener('click', function () {
        this.value = null;
    });

    document.getElementById('fileInput').addEventListener('change', function (event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const img = new Image();
            img.src = URL.createObjectURL(imageFile);
            img.onload = function () {
                document.getElementById('originalImage').src = img.src;
                document.getElementById('modifiedImage').src = img.src;
                const matrix = imageToMatrix(img);
                setVar("workingMatrix", matrix);
                setVar("recoverMatrix", matrix);
                setVar('appliedFilter', 'Imagem sem edição');
                document.getElementById('h2-modified-image').innerText = getVar('appliedFilter');
                resizeImage();
                displayHistogram(getVar('workingMatrix'), 'histogramOriginal');
                displayHistogram(getVar('workingMatrix'), 'histogramModified');
            };
        }
    });

    document.getElementById('fileInput_2').addEventListener('change', function (event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const img = new Image();
            img.src = URL.createObjectURL(imageFile);
            img.onload = function () {
                document.getElementById('originalImage2').src = img.src;
                const matrix = imageToMatrix(img);
                setVar("secondaryMatrix", matrix);
                resizeImage();
            };
        }
    });
    
    document.getElementById('filter-input').addEventListener('input', function () {
        applyMask('enhance');
    });


    // RANGES

    document.getElementById('brightness-range').addEventListener('change', function () {
        document.getElementById('brightness-label').innerText = document.getElementById('brightness-range').value;
        applyFilter('brightness');
    });

    document.getElementById('range-contrast').addEventListener('change', function () {
        document.getElementById('contrast-label').innerText = document.getElementById('range-contrast').value;
        applyFilter('contrast');
    });

    document.getElementById('range_binarize').addEventListener('change', function () {
        document.getElementById('binarize_label').innerText = document.getElementById('range_binarize').value;
        applyFilter('binarize');
    });

    document.getElementById('range-blending').addEventListener('change', function () {
        document.getElementById('label-blending').innerText = this.value + "%";
    });



    //SELECTS

    document.getElementById('filter-select').addEventListener('change', function () {
        applyMask('enhance');
    });

    document.getElementById('mask-select').addEventListener('change', function () {
        applyMask('enhance');
    });

    document.getElementById('filter-select-border').addEventListener('change', function () {
        applyMask('border');
    });

    document.getElementById('mask-select-border').addEventListener('change', function () {
        applyMask('border');
    });

    document.getElementById('filter-select-morphology').addEventListener('change', function () {
        applyMask('morphology');
    });

    document.getElementById('mask-select-border').addEventListener('change', function () {
        applyMask('morphology');
    });



    //BUTTONS

    document.getElementById('downloadButton').addEventListener('click', downloadImage);



    document.querySelectorAll('.popup-ok').forEach(button => {
        button.addEventListener('click', function () {
            const popupId = this.getAttribute('data-popup-id');
            document.getElementById('popup-container').style.display = 'none';
            document.getElementById(popupId).style.display = 'none';
            if (getVar('filterMatrix') != "") okFunction();
        });
    });

    document.getElementById('cancel-secondary-button').addEventListener('click', function () {
        closeSecondaryImage();
        document.getElementById('modifiedImage').src = document.getElementById('originalImage').src
        const previousMatrix = getVar('previousMatrix');
        document.getElementById('originalImage').src = matrixToDataURL(previousMatrix);
    });

    document.getElementById('ok-secondary-button').addEventListener('click', function () {
        const elements = document.querySelectorAll('.secondary-hide');
        elements.forEach(element => {
            element.classList.add('hidden');
        });
        document.getElementById('header-page').classList.remove('disabled');
        okFunction();
    });

    document.getElementById('add-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', '+')
    });

    document.getElementById('subtract-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', '-')
    });

    document.getElementById('divide-abs-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', 'diffABS')
    });

    document.getElementById('multiply-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', '*')
    });

    document.getElementById('divide-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', '/')
    });

    document.getElementById('average-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', 'average')
    });

    document.getElementById('blending-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', 'blending')
    });

    document.getElementById('and-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', 'and')
    });

    document.getElementById('or-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', 'or')
    });

    document.getElementById('xor-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', 'xor')
    });

    document.getElementById('not1-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', 'not1')
    });

    document.getElementById('not2-button').addEventListener('click', function () {
        applyFilter('arithmeticOperation', 'not2')
    });

    document.getElementById('add-constant-button').addEventListener('click', function () {
        applyFilter('arithmeticConstantOperation', '+');
    });

    document.getElementById('subtract-constant-button').addEventListener('click', function () {
        applyFilter('arithmeticConstantOperation', '-');
    });

    document.getElementById('multiply-constant-button').addEventListener('click', function () {
        applyFilter('arithmeticConstantOperation', '*');
    });

    document.getElementById('divide-constant-button').addEventListener('click', function () {
        applyFilter('arithmeticConstantOperation', '/');
    });

    document.getElementById('concatenate-button').addEventListener('click', function () {
        applyFilter('concatenate');
    });


    //DROPDOWNS

    document.getElementById('drop-recover').addEventListener('click', function (event) {
        const recoverMatrix = getVar('recoverMatrix');

        setVar('workingMatrix', recoverMatrix);
        document.getElementById('originalImage').src = matrixToDataURL(recoverMatrix);
        document.getElementById('modifiedImage').src = matrixToDataURL(recoverMatrix);
        setVar('appliedFilter', 'Imagem sem edição');
        document.getElementById('h2-modified-image').innerText = getVar('appliedFilter');
    });

    document.getElementById('drop-negative').addEventListener('click', function () {
        applyFilter('negative');
    });

    document.getElementById('drop-gray').addEventListener('click', function () {
        applyFilter('gray');
    });

    document.getElementById('drop-imgs-operation').addEventListener('click', function () {
        openSecondaryImage();
    });

    document.getElementById('drop-flip-horizontal').addEventListener('click', function () {
        applyFilter('flip', 'horizontal');
    });

    document.getElementById('drop-flip-vertical').addEventListener('click', function () {
        applyFilter('flip', 'vertical');
    });

    document.getElementById('drop-rotate-clockwise').addEventListener('click', function () {
        applyFilter('rotate', 'horário');
    });

    document.getElementById('drop-rotate-counterclockwise').addEventListener('click', function () {
        applyFilter('rotate', 'anti-horário');
    });

    document.getElementById('popup-crop-ok').addEventListener('click', function () {
        document.getElementById('image-crop').src = matrixToDataURL(getVar('workingMatrix'));
        applyFilter('crop');
    });

    document.getElementById('drop-crop').addEventListener('click', function () {
        applyFilter('cropSelection');
    });

    document.getElementById('drop-histogram').addEventListener('click', function () {
        applyFilter('histogram');
    });

    
    // TESTE
    document.getElementById('testButton').addEventListener('click', function () {
        if (cropper) console.log('crop');
    });


}