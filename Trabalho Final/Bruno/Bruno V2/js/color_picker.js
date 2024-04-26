const background = document.querySelector(".select-img")

function normalizeRgb(rgb) {
    return rgb.map(function(value) {
      return value / 255.0;
    });
  }
  
  
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
  }
  
  document.getElementById('hexInput').addEventListener('input', function() {
  var hex = this.value.trim();
  

  
 // Aqui definimos o valor de cor do background
  var rgb = hexToRgb(hex);
  
 
  const background = document.querySelector(".select-img"); 
  background.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
});
  

  function rgbToCmyk(rgb) {
    var r = normalizeRgb(rgb)[0];
    var g = normalizeRgb(rgb)[1];
    var b = normalizeRgb(rgb)[2];
  
    var k = Math.min(1 - r, 1 - g, 1 - b);
    var c = (1 - r - k) / (1 - k);
    var m = (1 - g - k) / (1 - k);
    var y = (1 - b - k) / (1 - k);
  
    return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
  }
  
 
  function rgbToHsv(rgb) {
    var r = normalizeRgb(rgb)[0];
    var g = normalizeRgb(rgb)[1];
    var b = normalizeRgb(rgb)[2];
  
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;
  
    var h, s, v;
    if (delta === 0) {
      h = 0;
    } else if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * (((b - r) / delta) + 2);
    } else {
      h = 60 * (((r - g) / delta) + 4);
    }
  
    if (max === 0) {
      s = 0;
    } else {
      s = delta / max;
    }
  
    v = max;
  
    return [Math.round(h), Math.round(s * 100), Math.round(v * 100)];
  }
  
  
  function rgbToHsl(rgb) {
    var r = normalizeRgb(rgb)[0];
    var g = normalizeRgb(rgb)[1];
    var b = normalizeRgb(rgb)[2];
  
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;
  
    var h, s, l;
    if (delta === 0) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  
    h = Math.round(h * 60);
    if (h < 0) {
      h += 360;
    }
  
    l = (max + min) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
    return [h, Math.round(s * 100), Math.round(l * 100)];
  }
  
 
  function rgbToGray(rgb) {
    var gray = Math.round((rgb[0] + rgb[1] + rgb[2]) / 3);
    return [gray, gray, gray];
  }
  
  
  function updateInputs() {
    var hex = document.getElementById('hexInput').value.trim();
    if (hex.charAt(0) !== '#') {
      hex = '#' + hex; 
      document.getElementById('hexInput').value = hex; 
    }
  
   
    var rgb = hexToRgb(hex);
    document.getElementById('rgbInput').value = rgb.join(', ');
  
    
    var cmyk = rgbToCmyk(rgb);
    document.getElementById('cmykInput').value = cmyk.join(', ');
  
    
    var hsv = rgbToHsv(rgb);
    document.getElementById('hsvInput').value = `(${hsv[0]}°, ${hsv[1]}%, ${hsv[2]}%)`;
  
    
    var hsl = rgbToHsl(rgb);
    document.getElementById('hslInput').value = `(${hsl[0]}°, ${hsl[1]}%, ${hsl[2]}%)`;
  
    var gray = rgbToGray(rgb);
    document.getElementById('grayInput').value = gray[0];
  }
  
  
  var inputs = document.querySelectorAll('.inputs input');
  inputs.forEach(function(input) {
    input.addEventListener('input', updateInputs);
  });