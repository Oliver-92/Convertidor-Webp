// script.js

const imageInput = document.getElementById("image-input");
const previewContainer = document.getElementById("preview");
const fileCountDisplay = document.getElementById("file-count");
const convertedImagesContainer = document.getElementById("converted-images");
const form = document.getElementById("image-form");

let selectedFiles = [];

// Limitar la cantidad de imágenes a 10
imageInput.addEventListener("change", () => {
  const files = Array.from(imageInput.files);
  
  // Limitar a 10 archivos seleccionados
  if (files.length + selectedFiles.length > 10) {
    alert("No puedes seleccionar más de 10 imágenes.");
    return;
  }

  // Agregar archivos a la selección
  selectedFiles = [...selectedFiles, ...files.slice(0, 10 - selectedFiles.length)];

  previewContainer.innerHTML = "";
  fileCountDisplay.textContent = `${selectedFiles.length} archivo(s) seleccionado(s)`;

  // Mostrar vista previa de las imágenes seleccionadas
  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-image");

      const closeButton = document.createElement("button");
      closeButton.textContent = "X";
      closeButton.classList.add("close-btn");
      closeButton.onclick = () => removeImage(index);

      imageContainer.appendChild(img);
      imageContainer.appendChild(closeButton);
      previewContainer.appendChild(imageContainer);
    };
    reader.readAsDataURL(file);
  });
});

// Función para eliminar una imagen de la selección
function removeImage(index) {
  // Eliminar imagen del array seleccionado
  selectedFiles.splice(index, 1);

  // Actualizar la vista previa
  fileCountDisplay.textContent = `${selectedFiles.length} archivo(s) seleccionado(s)`;
  previewContainer.innerHTML = "";

  // Volver a cargar las imágenes restantes
  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-image");

      const closeButton = document.createElement("button");
      closeButton.textContent = "X";
      closeButton.classList.add("close-btn");
      closeButton.onclick = () => removeImage(index);

      imageContainer.appendChild(img);
      imageContainer.appendChild(closeButton);
      previewContainer.appendChild(imageContainer);
    };
    reader.readAsDataURL(file);
  });
}

// Función para convertir las imágenes a WebP
function convertToWebP(file, callback) {
  const img = new Image();
  const reader = new FileReader();

  reader.onload = function (e) {
    img.src = e.target.result;
    img.onload = function () {
      // Crear un canvas para dibujar la imagen y convertirla
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Ajustar las dimensiones del canvas
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar la imagen en el canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Convertir la imagen a WebP y llamamos al callback con la imagen
      const webpDataUrl = canvas.toDataURL("image/webp");
      callback(webpDataUrl);
    };
  };

  reader.readAsDataURL(file);
}

// Capturar el evento de submit del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();  // Prevenir que el formulario se envíe

  const zip = new JSZip(); // Crear un nuevo archivo ZIP
  let zipFilename = "imagenes_convertidas.zip"; // Nombre del archivo ZIP

  selectedFiles.forEach((file, index) => {
    // Llamamos a la función de conversión
    convertToWebP(file, (webpDataUrl) => {
      // Convertir la Data URL a Blob para agregar al ZIP
      const byteString = atob(webpDataUrl.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      // Crear el archivo en el ZIP con el nombre original + .webp
      zip.file(`${file.name.replace(/\.[^/.]+$/, "")}.webp`, uint8Array);

      // Una vez que se hayan agregado todas las imágenes al ZIP, permitir la descarga
      if (index === selectedFiles.length - 1) {
        zip.generateAsync({ type: "blob" }).then((content) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(content);
          link.download = zipFilename; // Nombre del archivo ZIP
          link.click(); // Simula un clic para descargar el archivo
        });
      }
    });
  });
});


