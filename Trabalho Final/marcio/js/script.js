import { setVar } from './utils.js';
import { setupEventListeners } from './eventHandlers.js';
import { imageToMatrix } from './imageProcessing.js';

document.addEventListener("DOMContentLoaded", function () {    
    const matrix = imageToMatrix(document.getElementById('originalImage'));
    setVar('workingMatrix', matrix);
    setVar('recoverMatrix', matrix);
    setVar('appliedFilter', 'Sem modificações');
    setupEventListeners();
});
