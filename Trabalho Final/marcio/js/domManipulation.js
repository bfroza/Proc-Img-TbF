function openPopup(id) {
    document.getElementById('popup-container').style.display = 'flex';
    document.getElementById(id).style.display = 'block';

    document.querySelectorAll('.popup-image').forEach(image => {
        image.src =  document.getElementById("modifiedImage").src;
    });}

function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
    
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
    
    document.querySelectorAll('.label-reset').forEach(label => {
        label.innerText = 0;
    });

    document.querySelectorAll('.range-reset').forEach(range => {
        range.value = 0;
    });

    
}