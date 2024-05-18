// Função para abrir o popup
export function openPopup(id) {
    const popupContainer = document.getElementById('popup-container');
    const popupElement = document.getElementById(id);

    if (popupContainer && popupElement) {
        popupContainer.style.display = 'flex';
        popupElement.style.display = 'block';
    } else {
        console.error('Elemento ou container não encontrado.');
    }
}

// Função para fechar o popup
export function closePopup(id) {
    const popupContainer = document.getElementById('popup-container');
    const popupElement = document.getElementById(id);

    if (popupContainer && popupElement) {
        popupContainer.style.display = 'none';
        popupElement.style.display = 'none';
    } else {
        console.error('Elemento ou container não encontrado.');
    }
}