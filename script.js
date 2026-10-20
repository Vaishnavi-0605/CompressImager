const dropArea = document.getElementById('dropArea');
const compressBtn = document.getElementById('compressImagebtn');
const compressionInfo = document.getElementById('compressionInfo');
const inputImage = document.getElementById('imgInput');
const outputImage = document.getElementById('outputImage');
const downlaodbtn = document.getElementById('downloadbtn');
const previewbox = document.getElementById('previewBox');
const prevImage = document.getElementById('showSelectedImage');

let currentFile = null;
let quality = 0;

var compressRatio = document.getElementById('compressRatio');
var output = document.getElementById('slider');

output.textContent = compressRatio.value;

compressRatio.oninput = function() {
  output.textContent = this.value;
  quality = Number(compressRatio.value) / 100;
//   console.log(quality);
};

//DRAG HANDLERS

dropArea.addEventListener('dragover', (e)=>{
    e.preventDefault();
    dropArea.classList.add('drag-over');
})
dropArea.addEventListener('dragleave', ()=>{
    dropArea.classList.remove('drag-over');
})
dropArea.addEventListener('drop', (e)=>{
    e.preventDefault();
    dropArea.classList.remove('drag-over');

   const file = e.dataTransfer.files[0];

    if(file && file.type.startsWith('image/')){
        processImage(file);
    }
})
dropArea.addEventListener('click', ()=>{
    inputImage.click();
})
dropArea.addEventListener('change', (e)=>{
    e.preventDefault();
    
    const file = e.target.files[0];
    
    if(file && file.type.startsWith('image/')){
        processImage(file);
    }
})



//PROCESS

function processImage(file){
    currentFile = file;
    
    prevImage.src = URL.createObjectURL(file);

    dropArea.classList.add('image-selected');

    compressionInfo.textContent = 'Image ready to compress';
    downlaodbtn.style.display = 'none';
}



//COMPRESS FUNCTION
function compressImage(file, quality){
    const img = new Image();
    const imageURL = URL.createObjectURL(file);
    
    img.onload = () => {
        const canvas = document.createElement('canvas');

        canvas.height = img.height;
        canvas.width = img.width;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
            URL.revokeObjectURL(imageURL);
            
            if (!blob) {
                alert('Compression failed. Please try another image.');
                return;
            }
            
            const compressedURL = URL.createObjectURL(blob);
            
            outputImage.src = compressedURL;
            previewbox.style.display = 'block'; 
            downlaodbtn.style.display = 'inline-block';
            outputImage.style.opacity = 1;
            
            const compressionRatio = ((1- (blob.size/file.size))*100).toFixed(1);
            compressionInfo.textContent = `${compressionRatio}% compressed`;
            
            downlaodbtn.onclick = () =>{
                const a = document.createElement('a');
                a.href = outputImage.src;
                a.download = `compressed_${file.name}`;
                a.click();
            }
        }, 'image/jpeg', quality);
        
    };
    img.onerror = () => {
        URL.revokeObjectURL(imageURL);
        alert('Could not load this image.');
    };
    
    img.src = imageURL;
}


//Download Button
compressBtn.addEventListener('click', () => {
    if (!currentFile) {
        alert('Please select an image first!');
        return;
    }

    quality = Number(compressRatio.value) / 100;

    compressImage(currentFile, quality);
});