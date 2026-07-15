# Manual de Usuario
## Generador de Etiquetas y Códigos QR desde Excel

---

## 1. Introducción

Esta aplicación permite crear etiquetas personalizadas con códigos QR a partir de un archivo Excel (`.xls` o `.xlsx`). Cada fila del Excel se convierte en una etiqueta individual que puedes previsualizar y descargar en formato JPG (dentro de un ZIP) o PDF.

**Características principales:**
- Carga de datos desde Excel
- Generación automática de códigos QR
- Diseño personalizable de etiquetas (tamaño, colores, posición)
- Título opcional con texto o logo
- Alineación independiente del título y del contenido
- Descarga masiva en ZIP (JPG) o PDF

**Requisitos:**
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (para cargar algunas librerías externas)
- Archivo Excel con encabezados en la primera fila
- Archivo `js/qrcode.min.js` presente en la carpeta del proyecto (necesario para generar los códigos QR)

---

## 2. Cómo iniciar la aplicación

1. Abre la carpeta del proyecto en tu computadora.
2. Haz doble clic en el archivo `index.html`, o ábrelo con tu navegador preferido.
3. Se mostrará la pantalla principal con el título **"Generador de Etiquetas y Códigos QR desde Excel"**.

> **Nota:** No es necesario instalar nada. La aplicación funciona directamente en el navegador.

---

## 3. Preparar el archivo Excel

Antes de usar la aplicación, organiza tu archivo Excel de la siguiente manera:

| Código | Nombre del producto | Precio | URL |
|--------|---------------------|--------|-----|
| ABC001 | Producto A          | $100   | https://ejemplo.com/abc001 |
| ABC002 | Producto B          | $200   | https://ejemplo.com/abc002 |

**Recomendaciones:**
- La **primera fila** debe contener los nombres de las columnas (encabezados).
- Cada **fila siguiente** representará una etiqueta.
- Evita filas vacías al inicio o en medio de los datos.
- El archivo puede ser `.xls` o `.xlsx`.

---

## 4. Flujo de trabajo paso a paso

El proceso completo consta de **4 pasos**:

```
1. Cargar Excel  →  2. Seleccionar columnas  →  3. Diseñar formato  →  4. Descargar
```

---

### Paso 1: Cargar el archivo Excel

1. En la sección **"Selecciona un archivo Excel"**, haz clic en el botón de selección de archivo.
2. Elige tu archivo `.xls` o `.xlsx`.
3. Si el archivo es válido y contiene datos, aparecerán automáticamente las secciones:
   - **Selecciona los datos de tu Excel**
   - **Diseña el Formato de tu Etiqueta**

Si el archivo está vacío, verás un mensaje de alerta indicándolo.

---

### Paso 2: Seleccionar los datos del Excel

En la sección **"Selecciona los datos de tu Excel"** configura qué columnas usar:

#### Dato para Código QR
- Selecciona la columna cuyo valor se codificará en el código QR.
- Ejemplo: columna `URL`, `Código` o `SKU`.

#### Contenido de la Etiqueta
- **Dato 1:** Primera columna que aparecerá como texto en la etiqueta.
- Puedes agregar más campos con el botón **"Añadir otro campo a la etiqueta"**.
- Para quitar un campo adicional, usa el botón **"Eliminar"** junto a él.

**Ejemplo de configuración:**

| Campo | Columna seleccionada |
|-------|----------------------|
| Dato QR | `URL` |
| Dato 1 | `Nombre del producto` |
| Dato 2 | `Precio` |

---

### Paso 3: Diseñar el formato de la etiqueta

En la sección **"Diseña el Formato de tu Etiqueta"** personaliza la apariencia.

#### 3.1 Tamaño de la etiqueta

| Opción | Descripción | Valor por defecto |
|--------|-------------|-------------------|
| **Ancho (cm)** | Ancho físico de la etiqueta | 5 cm |
| **Alto (cm)** | Alto físico de la etiqueta | 3 cm |

#### 3.2 Código QR

| Opción | Descripción | Valor por defecto |
|--------|-------------|-------------------|
| **Incluir Código QR** | Activa o desactiva el QR en la etiqueta | Activado |
| **Posición del QR** | Ubicación del QR dentro de la etiqueta | Abajo Derecha |
| **Tamaño del QR (cm)** | Tamaño del código QR | 2 cm |
| **Color del QR** | Color de los módulos del QR | Negro |
| **Fondo QR** | Color de fondo del QR | Blanco |

**Posiciones disponibles del QR:**
- Arriba Izquierda
- Arriba Central
- Arriba Derecha
- Abajo Izquierda
- Abajo Central
- Abajo Derecha
- Centro

> **Importante:** El tamaño del QR no puede ser mayor que el ancho o alto de la etiqueta. Si excede el límite, la aplicación mostrará una alerta.

#### 3.3 Contenido de texto

| Opción | Descripción | Valor por defecto |
|--------|-------------|-------------------|
| **Mostrar Títulos de Columna** | Muestra el nombre de la columna junto al dato (ej: `Precio: $100`) | Desactivado |
| **Alineación del Texto** | Alineación horizontal del contenido de la etiqueta | Centro |

**Opciones de alineación del texto:**
- Centro
- Izquierda
- Derecha

#### 3.4 Título de la etiqueta (opcional)

Puedes agregar un título fijo en la parte superior de todas las etiquetas.

1. Marca la casilla **"Incluir título"**.
2. Elige el **tipo de título**:

**Opción A: Texto**
- Escribe el texto en **"Texto del título"**.
- Ajusta el **"Tamaño del texto (px)"** (entre 8 y 72 px; por defecto 14 px).

**Opción B: Logo / Imagen**
- Haz clic en **"Selecciona una imagen"** y elige tu logo (PNG, JPG, etc.).
- Define el **"Alto de la imagen (cm)"** (mínimo 0.3 cm; por defecto 1 cm).
- Verás una previsualización de la imagen seleccionada.

3. Configura la **"Alineación del título"**:
   - Centro
   - Izquierda
   - Derecha

> **Nota:** La alineación del título es independiente de la alineación del texto del contenido.

#### 3.5 Generar las etiquetas

Cuando hayas terminado de configurar todo:

1. Haz clic en el botón **"Aplicar Formato y Generar Etiquetas"**.
2. Si falta algún dato obligatorio, verás un mensaje de alerta.
3. Si todo es correcto, aparecerá la sección **"Vista Previa de Etiquetas"**.

---

### Paso 4: Vista previa y descarga

#### Vista previa
- Se muestra una etiqueta por cada fila del Excel.
- Revisa que el diseño, el QR, el título y los textos se vean correctamente.
- Si necesitas cambios, ajusta las opciones y vuelve a hacer clic en **"Aplicar Formato y Generar Etiquetas"**.

#### Descargar etiquetas

**Para descargar en ZIP (JPG):**
1. En **"Usar como nombre de archivo"**, selecciona la columna que servirá como nombre de cada imagen.
2. Haz clic en **"Descargar Todas como ZIP (JPG)"**.
3. Se descargará el archivo `etiquetas_descargadas.zip` con una imagen JPG por etiqueta.

**Para descargar en PDF:**
1. Haz clic en **"Descargar Todas (PDF)"**.
2. Se descargará el archivo `etiquetas_generadas.pdf` con todas las etiquetas distribuidas en páginas tamaño A4.

---

## 5. Ejemplo completo

Supongamos que tienes este Excel:

| SKU | Producto | Precio | Enlace |
|-----|----------|--------|--------|
| P001 | Camiseta | $250 | https://tienda.com/p001 |
| P002 | Pantalón | $450 | https://tienda.com/p002 |

**Configuración sugerida:**

1. **Columna QR:** `Enlace`
2. **Contenido etiqueta:** `Producto` y `Precio`
3. **Tamaño etiqueta:** 6 cm × 4 cm
4. **QR:** Abajo Derecha, 2 cm, negro sobre blanco
5. **Mostrar títulos de columna:** Activado
6. **Alineación del texto:** Izquierda
7. **Título:** Texto "Mi Tienda", centrado, 16 px
8. **Nombre de archivo ZIP:** Columna `SKU`

**Resultado:** Dos etiquetas con el título "Mi Tienda" arriba, el producto y precio alineados a la izquierda, y el QR en la esquina inferior derecha. Los archivos JPG se llamarán `P001.jpg` y `P002.jpg`.

---

## 6. Mensajes de error comunes

| Mensaje | Causa | Solución |
|---------|-------|----------|
| *"El archivo Excel está vacío o no contiene datos"* | El Excel no tiene filas de datos | Verifica que haya datos debajo de los encabezados |
| *"Selecciona al menos una columna para el dato del código QR..."* | No se eligieron columnas obligatorias | Selecciona columna para QR y al menos una para el texto |
| *"El tamaño del código QR es demasiado grande..."* | El QR excede el tamaño de la etiqueta | Reduce el tamaño del QR o aumenta el tamaño de la etiqueta |
| *"Escribe el texto del título o desactiva la opción de título"* | Título activado sin texto | Escribe un título o desmarca "Incluir título" |
| *"Selecciona una imagen para el logo..."* | Título tipo logo sin imagen | Sube una imagen o cambia a tipo texto |
| *"La librería de generación de QR no está disponible"* | Falta el archivo `js/qrcode.min.js` | Asegúrate de que exista la carpeta `js` con el archivo QR |
| *"Selecciona una columna para los nombres de archivo"* | Descarga ZIP sin columna de nombres | Elige una columna en "Usar como nombre de archivo" |

---

## 7. Consejos y buenas prácticas

### Para mejores etiquetas impresas
- Usa tamaños en centímetros que coincidan con tus etiquetas físicas reales.
- Mantén el QR con buen contraste (oscuro sobre fondo claro).
- No hagas el QR demasiado pequeño; 1.5–2 cm suele ser un buen mínimo.
- Usa imágenes de logo con fondo transparente (PNG) para mejor resultado.

### Para el archivo Excel
- Usa nombres de columna claros y sin caracteres especiales.
- Si usas la columna de nombres para el ZIP, asegúrate de que los valores sean únicos.
- Evita celdas vacías en las columnas que vas a usar.

### Para la descarga
- El ZIP es ideal cuando necesitas archivos individuales por producto.
- El PDF es ideal para imprimir varias etiquetas en hojas A4.
- Si cambias el diseño, vuelve a generar las etiquetas antes de descargar.

---

## 8. Estructura de archivos del proyecto

```
qr version 2/
├── index.html          ← Abre este archivo para usar la aplicación
├── script.js           ← Lógica de la aplicación
├── style.css           ← Estilos visuales
├── js/
│   └── qrcode.min.js   ← Librería para generar códigos QR (requerida)
└── MANUAL_USUARIO.md   ← Este manual
```

---

## 9. Preguntas frecuentes (FAQ)

**¿Se suben mis datos a internet?**
No. El Excel se procesa completamente en tu navegador. Los datos no se envían a ningún servidor.

**¿Puedo usar la aplicación sin internet?**
Parcialmente. Necesitas internet la primera vez para cargar algunas librerías (Excel, PDF, ZIP). La librería QR debe estar en la carpeta `js/` de forma local.

**¿Cuántas etiquetas puedo generar?**
No hay un límite fijo, pero con muchas filas (cientos o miles) el navegador puede volverse lento. Para lotes muy grandes, considera dividir el Excel en partes.

**¿Puedo generar etiquetas sin código QR?**
Sí. Desmarca la casilla **"Incluir Código QR"**. Aún así, deberás seleccionar una columna para QR en la configuración actual.

**¿El título es igual en todas las etiquetas?**
Sí. El título (texto o logo) es fijo para todo el lote. Los datos variables vienen del Excel.

**¿Puedo cambiar el diseño después de generar?**
Sí. Modifica las opciones y haz clic nuevamente en **"Aplicar Formato y Generar Etiquetas"**.

---

## 10. Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | Cargar archivo Excel |
| 2 | Elegir columna para QR y columnas para el texto |
| 3 | Configurar tamaño, QR, título y alineaciones |
| 4 | Clic en **"Aplicar Formato y Generar Etiquetas"** |
| 5 | Revisar vista previa |
| 6 | Descargar como ZIP (JPG) o PDF |

---

*Manual de usuario — Generador de Etiquetas y Códigos QR desde Excel*
