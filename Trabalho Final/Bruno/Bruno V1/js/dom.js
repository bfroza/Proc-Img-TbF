let workingMatrix1 = [];
let workingMatrix2 = [];
let workingMatrix = [];
let brightness_last_value = 0;
let teste = false;

document.addEventListener("DOMContentLoaded", function () {  
    async function firstload () {        
        workingMatrix = await imageToMatrix();
        workingMatrix1 = await imageToMatrix();
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

    document.getElementById('fileInput_2').addEventListener('change', async function (event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            document.getElementById('originalImage2').src = URL.createObjectURL(imageFile);
            document.getElementById('modifiedImage').src = URL.createObjectURL(imageFile);
            workingMatrix2 = await imageToMatrix();
        }
    });

    document.getElementById('range_brightness').addEventListener('change', function () {
        document.getElementById('brightness_label').innerText = document.getElementById('range_brightness').value;
        applyFilter('brightness');
    });

    
    document.getElementById('pop-up-button-ok').addEventListener('click', function () {
        applyFilter('brightness');
        closePopup();
    });

    document.getElementById('range_binarize').addEventListener('change', function () {
        document.getElementById('binarize_label').innerText = document.getElementById('range_binarize').value;
    });

    document.getElementById('binarizeButton').addEventListener('click', function () {
        applyFilter('binarize');
    });

    document.getElementById('negativeButton').addEventListener('click', function () {
        applyFilter('negative');
    });

    document.getElementById('grayButton').addEventListener('click', function () {
        applyFilter('gray');
    });
    
    document.getElementById('normalButton').addEventListener('click', function () {
        applyFilter('normal');
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

    document.getElementById('secundaryButton').addEventListener('click', function () {        
        document.getElementById("display").classList.toggle("hidden");
        teste = true;
    });

    document.getElementById('sumButton').addEventListener('click', function () {
        if(teste){
            applyFilter('sum');
        } else {
            Swal.fire("", "Adicione uma imagem para a soma", "warning");
        }
    });
    

    document.getElementById('pop-up-button-cancel').addEventListener('click', function () {
        applyFilter('normal');
    });
});

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

function openPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
}

function closePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
}
