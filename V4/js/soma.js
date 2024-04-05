function downloadImage() {
    const modifiedImg = document.getElementById('modifiedImage');
    const imageURL = modifiedImg.src;
    
    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = 'modified_image.png';
    downloadLink.style.display = 'none'; 
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

document.getElementById('downloadButton').addEventListener('click', downloadImage);

