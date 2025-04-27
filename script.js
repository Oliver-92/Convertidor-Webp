const imageInput = document.getElementById("image-input");
const previewContainer = document.getElementById("preview");
const fileCountDisplay = document.getElementById("file-count");
const convertedImagesContainer = document.getElementById("converted-images");
const form = document.getElementById("image-form");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const loadingIndicator = document.createElement("div");


// Configurar el indicador de carga
loadingIndicator.id = "loading-indicator";
loadingIndicator.classList.add("loading-spinner");
loadingIndicator.style.display = "none";
loadingIndicator.innerHTML = `
  <div class="spinner"></div>
  <p>Convirtiendo imágenes...</p>
`;
document.body.appendChild(loadingIndicator);

let selectedFiles = [];

// Gestión del tema oscuro
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
}

function setTheme(themeName) {
  if (themeName === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  } else {
    document.body.removeAttribute('data-theme');
  }
  localStorage.setItem('theme', themeName);
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

// Inicializar el tema al cargar la página
initTheme();

// Limitar la cantidad de imágenes a 10
imageInput.addEventListener("change", () => {
  const files = Array.from(imageInput.files);

  // Limitar a 10 archivos seleccionados
  if (files.length + selectedFiles.length > 10) {
    alert("No puedes seleccionar más de 10 imágenes.");
    imageInput.value = "";
    return;
  }

  // Agregar archivos a la selección
  selectedFiles = [...selectedFiles, ...files.slice(0, 10 - selectedFiles.length)];

  previewContainer.innerHTML = "";
  updateFileCountDisplay();

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

// Función para actualizar el contador de archivos
function updateFileCountDisplay() {
  if (selectedFiles.length === 0) {
    fileCountDisplay.textContent = "Sin archivos seleccionados";
  } else {
    fileCountDisplay.textContent = `${selectedFiles.length} archivo(s) seleccionado(s)`;
  }
}

// Función para eliminar una imagen de la selección
function removeImage(index) {
  // Eliminar imagen del array seleccionado
  selectedFiles.splice(index, 1);

  // Actualizar la vista previa
  updateFileCountDisplay();
  previewContainer.innerHTML = "";

  // Volver a cargar las imágenes restantes
  selectedFiles.forEach((file, idx) => {
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
      closeButton.onclick = () => removeImage(idx);

      imageContainer.appendChild(img);
      imageContainer.appendChild(closeButton);
      previewContainer.appendChild(imageContainer);
    };
    reader.readAsDataURL(file);
  });
}

// Función para resetear la selección de archivos
function resetSelection() {
  selectedFiles = [];
  previewContainer.innerHTML = "";
  updateFileCountDisplay();
  imageInput.value = ""; // Limpiar el input de archivos
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

  // Verificar que hay archivos seleccionados
  if (selectedFiles.length === 0) {
    alert("Por favor, selecciona al menos una imagen para convertir.");
    return;
  }

  // Mostrar el indicador de carga
  loadingIndicator.style.display = "flex";

  const zip = new JSZip(); // Crear un nuevo archivo ZIP
  let zipFilename = "imagenes_convertidas.zip"; // Nombre del archivo ZIP
  let processedFiles = 0;

  // Crear el elemento para el mensaje de éxito si no existe
  let successMessage = document.getElementById("success-message");
  if (!successMessage) {
    successMessage = document.createElement("div");
    successMessage.id = "success-message";
    successMessage.className = "success-message";
    successMessage.textContent = "¡Descarga exitosa!";
    document.body.appendChild(successMessage);
  }

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
      processedFiles++;

      // Una vez que se hayan agregado todas las imágenes al ZIP, permitir la descarga
      if (processedFiles === selectedFiles.length) {
        zip.generateAsync({ type: "blob" }).then((content) => {
          // Ocultar el indicador de carga
          loadingIndicator.style.display = "none";

          const link = document.createElement("a");
          link.href = URL.createObjectURL(content);
          link.download = zipFilename; // Nombre del archivo ZIP
          link.click(); // Simula un clic para descargar el archivo

          // Mostrar el mensaje de éxito
          successMessage.style.display = "flex";

          // Ocultar el mensaje después de 3 segundos
          setTimeout(() => {
            successMessage.style.display = "none";
          }, 3000);

          // Resetear la selección después de la descarga
          resetSelection();
        });
      }
    });
  });
});