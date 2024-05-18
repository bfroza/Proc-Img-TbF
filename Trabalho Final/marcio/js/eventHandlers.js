import { imageToMatrix, okFunction, matrixToDataURL } from './imageProcessing.js';
import { downloadImage, setVar, getVar, openSecondaryImage } from './utils.js';
import { applyFilter } from './filters.js';


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
            img.onload = function() {
                document.getElementById('originalImage').src = img.src;
                document.getElementById('modifiedImage').src = img.src;
                const matrix = imageToMatrix(img);
                setVar("workingMatrix", matrix);
                setVar("sumMatrix1", matrix);
                setVar("recoverMatrix", matrix);
                setVar('appliedFilter', 'Imagem sem edição');
                document.getElementById('h2-modified-image').innerText = getVar('appliedFilter');
            };
        }
    });

    document.getElementById('fileInput_2').addEventListener('change', function (event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const img = new Image();            
            img.src = URL.createObjectURL(imageFile);
            img.onload = function() {
                document.getElementById('originalImage2').src = img.src;
                const matrix = imageToMatrix(img);
                setVar("sumMatrix2", matrix);
            };
        }
    });
    
    
    // RANGES

    document.getElementById('range_brightness').addEventListener('change', function () {
        document.getElementById('brightness_label').innerText = document.getElementById('range_brightness').value;
        applyFilter('brightness');
    });

    document.getElementById('range_binarize').addEventListener('change', function () {        
        document.getElementById('binarize_label').innerText = document.getElementById('range_binarize').value;
        applyFilter('binarize');
    });



    //BUTTONS
    
    document.getElementById('downloadButton').addEventListener('click', downloadImage);

    

    document.querySelectorAll('.popup-ok').forEach(button => {
        button.addEventListener('click', function() {
            const popupId = this.getAttribute('data-popup-id');
            document.getElementById('popup-container').style.display = 'none';
            document.getElementById(popupId).style.display = 'none';
            if (getVar('filterMatrix') != "") okFunction();
        });
    });

    document.getElementById('popup-ok').addEventListener('click', okFunction);
    

    //DROPDOWNS

    document.getElementById('drop-recover').addEventListener('click', function (event) {
        const recoverMatrix = getVar('recoverMatrix');
        const recoverWidth = recoverMatrix[0].length;
        const recoverHeight = recoverMatrix.length;
    
        setVar('workingMatrix', recoverMatrix);
        document.getElementById('originalImage').src = matrixToDataURL(recoverMatrix, recoverWidth, recoverHeight);
        document.getElementById('modifiedImage').src = matrixToDataURL(recoverMatrix, recoverWidth, recoverHeight);
        setVar('appliedFilter', 'Imagem sem edição');
        document.getElementById('h2-modified-image').innerText = getVar('appliedFilter');
    });


    document.getElementById('drop-negative').addEventListener('click', function() {
        applyFilter('negative');
    });

    document.getElementById('drop-gray').addEventListener('click', function() {
        applyFilter('gray');
    });
    

    


    // TESTE
    document.getElementById('testButton').addEventListener('click', function () {
        openSecondaryImage();
    });


}