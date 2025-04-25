# Convertidor de Imágenes a WebP

Este es un convertidor de imágenes a formato WebP que permite a los usuarios seleccionar varias imágenes, ver una vista previa de las imágenes seleccionadas, convertirlas a WebP y descargarlas en un archivo ZIP. Todo esto sin necesidad de un backend, utilizando solo tecnologías frontend como HTML, CSS y JavaScript.

## Funcionalidades

- Selecciona hasta un máximo de 10 imágenes para convertir a WebP.
- Vista previa de las imágenes seleccionadas.
- Opción para eliminar imágenes de la selección.
- Conversión de las imágenes seleccionadas a formato WebP.
- Las imágenes convertidas se descargan en un solo archivo ZIP.

## Requisitos

Para ejecutar este proyecto, solo necesitas un navegador moderno que soporte JavaScript. No se requiere ningún software adicional ni un servidor backend.

## Instrucciones

1. **Clona este repositorio** o descarga los archivos en tu máquina local.

    ```bash
    git clone https://github.com/tu-usuario/convertidor-webp.git
    ```

2. **Abre el archivo `index.html` en tu navegador.**

3. **Selecciona hasta 10 imágenes** en el campo de entrada de archivos.

4. **Haz clic en "Convertir a WebP"** para convertir las imágenes al formato WebP.

5. **Descarga las imágenes convertidas** en un archivo ZIP.

6. **Elimina imágenes de la selección** haciendo clic en la "X" sobre cada imagen de vista previa.

## Archivos del Proyecto

- `index.html`: El archivo HTML que contiene la estructura de la página.
- `styles.css`: El archivo CSS que contiene los estilos de la página.
- `script.js`: El archivo JavaScript que maneja la lógica de conversión y la gestión de imágenes.

## Estructura del Proyecto

```plaintext
convertidor-webp/ 
│   ├── index.html 
│   ├── styles.css 
│   └── script.js
```

## Tecnologías Utilizadas

- **HTML**: Estructura básica de la página web.
- **CSS**: Estilos para una interfaz limpia y moderna.
- **JavaScript**: Lógica para la conversión de imágenes y la gestión de la selección de archivos.
- **Canvas**: Se utiliza para convertir las imágenes cargadas a formato WebP mediante manipulación de imágenes en el canvas HTML.
- **JSZip**: Biblioteca para generar el archivo ZIP con las imágenes convertidas.

## Contribución

Si deseas contribuir a este proyecto, por favor haz un fork del repositorio, realiza los cambios y crea un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes ver los detalles de la licencia en el archivo [LICENSE](LICENSE).

## ¡Gracias por utilizar este Convertidor de Imágenes a WebP!