function openPopup(id) {
    document.querySelectorAll('.label-reset').forEach(label => {
        label.innerText = 0;
    });

    document.querySelectorAll('.range-reset').forEach(range => {
        range.value = 0;
    });

    document.querySelectorAll('.input-reset').forEach(input => {
        input.value = 0;
    });

    document.getElementById('popup-container').style.display = 'flex';
    document.getElementById(id).style.display = 'block';

    document.querySelectorAll('.popup-image').forEach(image => {
        image.src = document.getElementById("modifiedImage").src;
    });

    resizeImage();
}

    
function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
    
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
}


function imageDimensions() {
    const img = document.getElementById('modifiedImage');
    width = img.naturalWidth;
    height = img.naturalHeight;
    document.getElementById('image-dimensions').textContent = `Dimensões: ${width} x ${height} px`
}

function resizeImage() {
    const images = document.querySelectorAll('.resizable-image-popup');
    images.forEach(img => {
        img.onload = function () {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            if (width > height) {
                img.classList.add('resize-width-popup');
                img.classList.remove('resize-height-popup');
            } else {
                img.classList.add('resize-height-popup');
                img.classList.remove('resize-width-popup');
            }
        };
    });
}

function setValue(control, value, label) {
    control.value = value;
    if (label) label.innerText = value;
}

function resetSelect(select) {
    select.selectedIndex = 0;
}


function changeLabelAndStep() {
    var filterSelect = document.getElementById("filter-select");
    var label = document.getElementById('filter-label');
    var inputFilter = document.getElementById("filter-input");

    if (filterSelect.value === "gaussian") {
        label.textContent = "Sigma:";
        inputFilter.step = "0.1";
        inputFilter.value = 1;
        inputFilter.disabled = false;
    } else if (filterSelect.value === "order") {
        label.textContent = "Order:";
        inputFilter.step = "1";
        inputFilter.value = 1;
        inputFilter.disabled = false;
    } else {
        label.textContent = "Filtro:";
        inputFilter.step = "1";
        inputFilter.value = null;
        inputFilter.disabled = true;
    }
}