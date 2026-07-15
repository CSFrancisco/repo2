// --- Constantes de Conversión ---
// 96 DPI es una resolución común. 1 pulgada = 25.4 mm. 1 mm = 96/25.4 píxeles.
const PIXELS_PER_MM = 96 / 25.4; // Factor de conversión de mm a px
const MM_PER_CM = 10; // 1 cm = 10 mm
const HTML2CANVAS_SCALE = 2; // Escala para html2canvas (mayor = mejor calidad, mayor tamaño de imagen)

// --- Variables Globales ---
let excelData = [];
let selectedColumns = {};
let generatedLabels = [];
let currentLabelFormat = {}; // Objeto para almacenar las configuraciones de formato aplicadas
let headerImageDataUrl = null;
let labelFieldsConfig = {}; // Configuración por campo (alineación, negritas, mostrar título)

// --- Elementos del DOM ---
const fileInput = document.getElementById('excelFile');
const formatDesignDiv = document.getElementById('format-design');
const dataSelectionDiv = document.getElementById('data-selection');
const columnSelectorsDiv = document.getElementById('column-selectors');
const applyFormatBtn = document.getElementById('applyFormatBtn');
const labelPreviewDiv = document.getElementById('label-preview');
const labelsContainer = document.getElementById('labels-container');
const downloadAllJpgZipBtn = document.getElementById('downloadAllJpgZipBtn');
const downloadAllPdfBtn = document.getElementById('downloadAllPdfBtn');
const fileNameColumnSelect = document.getElementById('fileNameColumn');

// --- Elementos de Diseño ---
const labelWidthCmInput = document.getElementById('labelWidthCm');
const labelHeightCmInput = document.getElementById('labelHeightCm');
const includeQRCheckbox = document.getElementById('includeQR');
const qrPositionSelect = document.getElementById('qrPosition');
const qrSizeCmInput = document.getElementById('qrSizeCm');
const qrColorInput = document.getElementById('qrColor');
const qrBackgroundColorInput = document.getElementById('qrBackgroundColor');
const textAlignSelect = document.getElementById('textAlign');
const textBoldCheckbox = document.getElementById('textBold');
const includeTitleCheckbox = document.getElementById('includeTitle');
const titleOptionsDiv = document.getElementById('titleOptions');
const titleTypeSelect = document.getElementById('titleType');
const titleAlignSelect = document.getElementById('titleAlign');
const titleTextInput = document.getElementById('titleText');
const titleFontSizeInput = document.getElementById('titleFontSize');
const titleTextOptionsDiv = document.getElementById('titleTextOptions');
const titleLogoOptionsDiv = document.getElementById('titleLogoOptions');
const headerImageFileInput = document.getElementById('headerImageFile');
const headerImageHeightInput = document.getElementById('headerImageHeight');
const imagePreviewDiv = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');

// --- Event Listeners ---
fileInput.addEventListener('change', handleFileSelect);
applyFormatBtn.addEventListener('click', applyAndGenerateLabels);
downloadAllJpgZipBtn.addEventListener('click', downloadAllAsJpgZip);
downloadAllPdfBtn.addEventListener('click', downloadAllAsPdf);
includeTitleCheckbox.addEventListener('change', handleIncludeTitleChange);
titleTypeSelect.addEventListener('change', handleTitleTypeChange);
headerImageFileInput.addEventListener('change', handleHeaderImageSelect);

// --- Verificación Inicial de la Librería QR ---
console.log("Verificando QRCode globalmente:", typeof QRCode);


// --- Funciones de Utilidad ---
function cmToPx(cm) {
    return cm * MM_PER_CM * PIXELS_PER_MM;
}

function pxToCm(px) {
    return (px / PIXELS_PER_MM) / MM_PER_CM;
}

// Sanitizar nombres de archivo
function sanitizeFileName(fileName) {
    return fileName.replace(/[<>:"/\\|?*]/g, '_').substring(0, 255);
}

const alignItemsMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
};

function handleIncludeTitleChange() {
    titleOptionsDiv.classList.toggle('hidden', !includeTitleCheckbox.checked);
}

function handleTitleTypeChange() {
    const isLogo = titleTypeSelect.value === 'logo';
    titleTextOptionsDiv.classList.toggle('hidden', isLogo);
    titleLogoOptionsDiv.classList.toggle('hidden', !isLogo);
}

function handleHeaderImageSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        headerImageDataUrl = null;
        imagePreviewDiv.classList.add('hidden');
        previewImg.src = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        headerImageDataUrl = e.target.result;
        previewImg.src = headerImageDataUrl;
        imagePreviewDiv.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function createTitleElement(format) {
    if (!format.includeTitle) return null;

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('label-title');
    titleContainer.style.width = '100%';
    titleContainer.style.flexShrink = '0';
    titleContainer.style.display = 'flex';
    titleContainer.style.justifyContent = alignItemsMap[format.titleAlign] || 'center';
    titleContainer.style.marginBottom = '4px';
    titleContainer.style.paddingBottom = '4px';
    titleContainer.style.borderBottom = '1px solid #eee';

    if (format.titleType === 'logo' && format.titleImageDataUrl) {
        const img = document.createElement('img');
        img.src = format.titleImageDataUrl;
        img.classList.add('label-header-image');
        img.alt = 'Título';
        img.style.height = `${format.titleImageHeightPx}px`;
        img.style.width = 'auto';
        img.style.maxWidth = '100%';
        img.style.objectFit = 'contain';
        titleContainer.appendChild(img);
    } else if (format.titleType === 'text' && format.titleText) {
        const titleTextEl = document.createElement('div');
        titleTextEl.classList.add('label-title-text');
        titleTextEl.innerText = format.titleText;
        titleTextEl.style.fontWeight = 'bold';
        titleTextEl.style.fontSize = `${format.titleFontSizePx}px`;
        titleTextEl.style.textAlign = format.titleAlign;
        titleTextEl.style.width = '100%';
        titleContainer.appendChild(titleTextEl);
    } else {
        return null;
    }

    return titleContainer;
}

// --- Funciones Principales ---

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        excelData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Datos del Excel cargados:", excelData);

        if (excelData.length > 0) {
            displayColumnSelectors();
            formatDesignDiv.classList.remove('hidden');
            dataSelectionDiv.classList.remove('hidden');
            labelPreviewDiv.classList.add('hidden');
        } else {
            alert('El archivo Excel está vacío o no contiene datos.');
        }
    };
    reader.readAsBinaryString(file);
}

function displayColumnSelectors() {
    columnSelectorsDiv.innerHTML = '';
    if (excelData.length === 0) return;

    const headers = Object.keys(excelData[0]);

    // Selector para el dato del código QR
    const qrDataColumnDiv = document.createElement('div');
    qrDataColumnDiv.innerHTML = `
        <label for="qrDataColumn">Dato para Código QR (Columna Excel):</label>
        <select id="qrDataColumn">
            <option value="">-- Selecciona una columna --</option>
            ${headers.map(header => `<option value="${header}">${header}</option>`).join('')}
        </select>
    `;
    columnSelectorsDiv.appendChild(qrDataColumnDiv);

    // Selectores para el contenido de la etiqueta
    const labelContentDiv = document.createElement('div');
    labelContentDiv.innerHTML = `
        <h4>Contenido de la Etiqueta (Columnas Excel):</h4>
        <div id="label-fields">
            <div class="label-field">
                <label>Dato 1:</label>
                <select class="labelColumn">
                    <option value="">-- Selecciona una columna --</option>
                    ${headers.map(header => `<option value="${header}">${header}</option>`).join('')}
                </select>
                <div class="field-options">
                    <label><input type="checkbox" class="showColumnHeader" checked> Mostrar título</label>
                    <label><input type="checkbox" class="fieldBold"> Negritas</label>
                    <label>Posición:</label>
                    <select class="fieldAlign">
                        <option value="left">Izquierda</option>
                        <option value="center" selected>Centro</option>
                        <option value="right">Derecha</option>
                    </select>
                </div>
            </div>
        </div>
        <button type="button" onclick="addLabelField()">Añadir otro campo a la etiqueta</button>
    `;
    columnSelectorsDiv.appendChild(labelContentDiv);

    // Actualizar selector de nombres de archivo
    updateFileNameSelector(headers);
}

function updateFileNameSelector(headers) {
    fileNameColumnSelect.innerHTML = '<option value="">-- Selecciona una columna --</option>';
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        fileNameColumnSelect.appendChild(option);
    });
}

function addLabelField() {
    const labelFieldsDiv = document.getElementById('label-fields');
    const newFieldDiv = document.createElement('div');
    newFieldDiv.classList.add('label-field');
	const headers = excelData && excelData.length > 0 ? Object.keys(excelData[0]) : [];
    newFieldDiv.innerHTML = 
		`
        <label>Dato:</label>
        <select class="labelColumn">
            <option value="">-- Selecciona una columna --</option>
            ${headers.map(header => `<option value="${header}">${header}</option>`).join('')}
        </select>
        <div class="field-options">
            <label><input type="checkbox" class="showColumnHeader" checked> Mostrar título</label>
            <label><input type="checkbox" class="fieldBold"> Negritas</label>
            <label>Posición:</label>
            <select class="fieldAlign">
                <option value="left">Izquierda</option>
                <option value="center" selected>Centro</option>
                <option value="right">Derecha</option>
            </select>
        </div>
        <button type="button" onclick="this.parentNode.remove()">Eliminar</button>
    `;
    labelFieldsDiv.appendChild(newFieldDiv);
}

function applyAndGenerateLabels() {
    // 1. Capturar selecciones de columnas
    const qrDataColumnSelect = document.getElementById('qrDataColumn');
    const labelColumnInputs = document.querySelectorAll('.labelColumn');
    const labelFieldElements = document.querySelectorAll('.label-field');

    selectedColumns = {
        qrDataColumn: qrDataColumnSelect ? qrDataColumnSelect.value : null,
        labelDataColumns: Array.from(labelColumnInputs).map(input => input.value).filter(col => col !== '')
    };

    // 2. Capturar configuración por campo
    labelFieldsConfig = {};
    labelFieldElements.forEach((fieldEl, index) => {
        const columnSelect = fieldEl.querySelector('.labelColumn');
        const columnName = columnSelect.value;
        
        if (columnName) {
            const showHeader = fieldEl.querySelector('.showColumnHeader').checked;
            const isBold = fieldEl.querySelector('.fieldBold').checked;
            const align = fieldEl.querySelector('.fieldAlign').value;
            
            labelFieldsConfig[columnName] = {
                showHeader: showHeader,
                bold: isBold,
                align: align
            };
        }
    });

    console.log("Columnas seleccionadas:", selectedColumns);
    console.log("Configuración por campo:", labelFieldsConfig);

    if (!selectedColumns.qrDataColumn || selectedColumns.labelDataColumns.length === 0) {
        alert("Por favor, selecciona al menos una columna para el dato del código QR y una para el texto de la etiqueta.");
        return;
    }

    const includeTitle = includeTitleCheckbox.checked;
    const titleType = titleTypeSelect.value;
    const titleText = titleTextInput.value.trim();

    if (includeTitle) {
        if (titleType === 'text' && !titleText) {
            alert('Por favor, escribe el texto del título o desactiva la opción de título.');
            return;
        }
        if (titleType === 'logo' && !headerImageDataUrl) {
            alert('Por favor, selecciona una imagen para el logo o desactiva la opción de título.');
            return;
        }
    }

    // 2. Capturar configuraciones de formato y convertir a Píxeles
    currentLabelFormat = {
        widthPx: cmToPx(parseFloat(labelWidthCmInput.value) || 5),
        heightPx: cmToPx(parseFloat(labelHeightCmInput.value) || 3),
        includeQR: includeQRCheckbox.checked,
        qrPosition: qrPositionSelect.value,
        qrSizePx: cmToPx(parseFloat(qrSizeCmInput.value) || 2),
        qrColor: qrColorInput.value,
        qrBackgroundColor: qrBackgroundColorInput.value,
        textAlign: textAlignSelect.value,
        textBold: textBoldCheckbox.checked,
        includeTitle,
        titleType: includeTitle ? titleType : 'none',
        titleText,
        titleImageDataUrl: headerImageDataUrl,
        titleImageHeightPx: cmToPx(parseFloat(headerImageHeightInput.value) || 1),
        titleAlign: titleAlignSelect.value,
        titleFontSizePx: parseFloat(titleFontSizeInput.value) || 14,
    };

    console.log("Formato de etiqueta seleccionado (en PX):", {
        width: currentLabelFormat.widthPx,
        height: currentLabelFormat.heightPx,
        qrSize: currentLabelFormat.qrSizePx,
        textBold: currentLabelFormat.textBold
    });

    // 3. Validaciones: Asegurar que el QR no se solape
    const qrPadding = 5;
    if (currentLabelFormat.includeQR) {
        if (currentLabelFormat.qrSizePx > currentLabelFormat.widthPx - (2 * qrPadding)) {
            alert(`El tamaño del código QR (${pxToCm(currentLabelFormat.qrSizePx).toFixed(1)} cm) es demasiado grande para el ancho de la etiqueta (${pxToCm(currentLabelFormat.widthPx).toFixed([...]
            return;
        }
        if (currentLabelFormat.qrSizePx > currentLabelFormat.heightPx - (2 * qrPadding)) {
            alert(`El tamaño del código QR (${pxToCm(currentLabelFormat.qrSizePx).toFixed(1)} cm) es demasiado grande para el alto de la etiqueta (${pxToCm(currentLabelFormat.heightPx).toFixed([...]
            return;
        }
    }

    // 4. Generar las etiquetas
    generateLabels(currentLabelFormat);
}


function generateLabels(format) {
    if (!format) {
        console.error("No se proporcionó formato para generar etiquetas.");
        return;
    }

    labelsContainer.innerHTML = '';
    generatedLabels = [];

    excelData.forEach((row, index) => {
        const qrData = row[selectedColumns.qrDataColumn] || '';
        
        // Construir contenido con configuración por campo
        let labelContentParts = [];
        selectedColumns.labelDataColumns.forEach(col => {
            const config = labelFieldsConfig[col] || { showHeader: true, bold: false, align: 'center' };
            let text = '';
            
            if (config.showHeader) {
                text = `${col}: ${row[col] || ''}`;
            } else {
                text = row[col] || '';
            }
            
            labelContentParts.push({
                text: text,
                bold: config.bold,
                align: config.align
            });
        });

        // --- Crear elemento canvas para QR (si se incluye) ---
        let qrCanvas = null;
        if (format.includeQR) {
            qrCanvas = document.createElement('canvas');
            qrCanvas.id = `qr-canvas-${index}`;
            qrCanvas.width = format.qrSizePx;
            qrCanvas.height = format.qrSizePx;
            console.log(`QR requerido para fila ${index + 1}. Dato: "${qrData}"`);
        } else {
            console.log(`QR omitido por formato para fila ${index + 1}.`);
        }

        // --- Verificación de QRCode ---
        if (format.includeQR && typeof QRCode === 'undefined') {
            console.error("¡ERROR FATAL! QRCode no está definido. Librería no cargada.");
            alert("Error: La librería de generación de QR no está disponible. Revisa la consola del navegador.");
            return;
        }

        // --- Función para dibujar el QR y luego crear la etiqueta ---
        const drawQRAndCreateLabel = (callback) => {
            if (!format.includeQR || !qrCanvas) {
                createLabel(null, null, callback);
                return;
            }

            QRCode.toCanvas(qrCanvas, qrData, {
                width: format.qrSizePx,
                height: format.qrSizePx,
                colorDark: format.qrColor,
                colorLight: format.qrBackgroundColor,
                errorCorrectionLevel: 'H'
            }, function (error) {
                if (error) {
                    console.error(`Error al generar QR para fila ${index + 1}:`, error);
                } else {
                    console.log(`QR generado para fila ${index + 1}.`);
                }
                createLabel(qrCanvas, error, callback);
            });
        };

        // --- Función para crear la etiqueta HTML ---
        const createLabel = (qrCanvasElement, qrError, finalCallback) => {
            const labelElement = document.createElement('div');
            labelElement.classList.add('label');
            labelElement.id = `label-${index}`;
            labelElement.style.width = `${format.widthPx}px`;
            labelElement.style.height = `${format.heightPx}px`;
            labelElement.style.border = 'none';
            labelElement.style.padding = '10px';
            labelElement.style.margin = '10px';
            labelElement.style.display = 'flex';
            labelElement.style.position = 'relative';
            labelElement.style.boxSizing = 'border-box';
            labelElement.style.overflow = 'hidden';
            labelElement.style.alignItems = 'stretch';
            labelElement.style.backgroundColor = '#fff';
            labelElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

            // Posicionamiento del QR (vertical)
            let textFlexDirection = 'column';
            let textJustification = 'center';

            if (format.includeQR && qrCanvasElement) {
                const qrContainer = document.createElement('div');
                qrContainer.style.position = 'absolute';
                qrContainer.style.width = `${format.qrSizePx}px`;
                qrContainer.style.height = `${format.qrSizePx}px`;
                const qrMargin = 5;
                qrContainer.style.margin = `${qrMargin}px`;

                switch (format.qrPosition) {
                    case 'top-left':
                        qrContainer.style.top = `${qrMargin}px`;
                        qrContainer.style.left = `${qrMargin}px`;
                        textJustification = 'flex-start';
                        break;
                    case 'top-right':
                        qrContainer.style.top = `${qrMargin}px`;
                        qrContainer.style.right = `${qrMargin}px`;
                        textJustification = 'flex-start';
                        break;
                    case 'bottom-left':
                        qrContainer.style.bottom = `${qrMargin}px`;
                        qrContainer.style.left = `${qrMargin}px`;
                        textJustification = 'flex-end';
                        break;
                    case 'center':
                        qrContainer.style.top = '50%';
                        qrContainer.style.left = '50%';
                        qrContainer.style.transform = 'translate(-50%, -50%)';
                        textJustification = 'center';
                        break;
                    case 'top-center':
                        qrContainer.style.top = `${qrMargin}px`;
                        qrContainer.style.left = '50%';
                        qrContainer.style.transform = 'translateX(-50%)';
                        textJustification = 'flex-start';
                        break;
                    case 'bottom-center':
                        qrContainer.style.bottom = `${qrMargin}px`;
                        qrContainer.style.left = '50%';
                        qrContainer.style.transform = 'translateX(-50%)';
                        textJustification = 'flex-end';
                        break;
                    case 'bottom-right':
                    default:
                        qrContainer.style.bottom = `${qrMargin}px`;
                        qrContainer.style.right = `${qrMargin}px`;
                        textJustification = 'flex-end';
                        break;
                }
                qrContainer.appendChild(qrCanvasElement);
                labelElement.appendChild(qrContainer);
            } else if (!format.includeQR) {
                textJustification = 'center';
            }

            // Configurar estilos del contenedor principal de la etiqueta
            labelElement.style.flexDirection = textFlexDirection;
            labelElement.style.justifyContent = textJustification;

            const titleElement = createTitleElement(format);
            if (titleElement) {
                labelElement.appendChild(titleElement);
            }

            // Crear y configurar el div del texto con múltiples párrafos
            const textDiv = document.createElement('div');
            textDiv.style.display = 'flex';
            textDiv.style.flexDirection = 'column';
            textDiv.style.width = '100%';
            textDiv.style.justifyContent = 'center';
            textDiv.style.padding = '5px';
            textDiv.style.overflowY = 'auto';
            textDiv.style.fontSize = '0.85em';

            // Crear párrafos individuales para cada campo
            labelContentParts.forEach(part => {
                const paragraph = document.createElement('div');
                paragraph.style.textAlign = part.align;
                paragraph.style.whiteSpace = 'pre-wrap';
                paragraph.style.wordWrap = 'break-word';
                paragraph.style.margin = '2px 0';
                
                if (part.bold) {
                    paragraph.style.fontWeight = 'bold';
                }
                
                paragraph.innerText = part.text;
                textDiv.appendChild(paragraph);
            });

            labelElement.appendChild(textDiv);

            labelsContainer.appendChild(labelElement);
            generatedLabels.push(labelElement);
            console.log(`Etiqueta ${index + 1} creada. QR: ${format.includeQR && qrCanvasElement ? 'Sí' : 'No'}.`);

            if (finalCallback) finalCallback();
        };

        // Ejecutar la lógica: dibujar QR (si aplica) y luego crear la etiqueta
        drawQRAndCreateLabel(function() {
            // Este callback se ejecuta después de que la etiqueta se creó y añadió al DOM.
        });

    }); // Fin del forEach

    labelPreviewDiv.classList.remove('hidden');
}


// --- Funciones de Descarga ---

function downloadAllAsJpgZip() {
    if (generatedLabels.length === 0) {
        alert('No hay etiquetas generadas para descargar.');
        return;
    }
    
    const fileNameColumn = fileNameColumnSelect.value;
    
    if (!fileNameColumn) {
        alert('Por favor selecciona una columna para los nombres de archivo.');
        return;
    }
    
    const zip = new JSZip();
    let completedCount = 0;
    
    alert('Generando ZIP con todas las imágenes...');
    
    generatedLabels.forEach((labelElement, index) => {
        html2canvas(labelElement, { scale: HTML2CANVAS_SCALE }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg');
            
            // Obtener nombre del archivo desde la columna seleccionada
            const nameFromColumn = excelData[index]?.[fileNameColumn] || `etiqueta_${index + 1}`;
            const sanitizedName = sanitizeFileName(nameFromColumn.toString());
            
            // Agregar al ZIP (eliminar el data:image/jpeg;base64, del inicio)
            zip.file(`${sanitizedName}.jpg`, imgData.split(',')[1], { base64: true });
            completedCount++;
            
            // Cuando todas estén procesadas, descargar ZIP
            if (completedCount === generatedLabels.length) {
                zip.generateAsync({ type: 'blob' }).then(blob => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'etiquetas_descargadas.zip';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    alert('ZIP descargado correctamente.');
                }).catch(err => {
                    console.error('Error al generar ZIP:', err);
                    alert('Error al generar ZIP. Revisa la consola.');
                });
            }
        }).catch(err => {
            console.error(`Error al generar JPG para etiqueta ${index + 1}:`, err);
            completedCount++;
            if (completedCount === generatedLabels.length) {
                alert('Algunas imágenes no se pudieron procesar, pero el ZIP se generó con las que sí.');
            }
        });
    });
}

function downloadAllAsPdf() {
    if (generatedLabels.length === 0) {
        alert('No hay etiquetas generadas para descargar.');
        return;
    }
    alert('Generando PDF...');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const format = currentLabelFormat;

    const labelWidthMm = (format.widthPx / HTML2CANVAS_SCALE) / PIXELS_PER_MM;
    const labelHeightMm = (format.heightPx / HTML2CANVAS_SCALE) / PIXELS_PER_MM;

    const paddingMM = 5;
    let xPos = paddingMM;
    let yPos = paddingMM;
    const pageWidthMm = pdf.internal.pageSize.getWidth();
    const pageHeightMm = pdf.internal.pageSize.getHeight();

    const addLabelToPdf = async (labelElement, index) => {
        return new Promise((resolve) => {
            html2canvas(labelElement, { scale: HTML2CANVAS_SCALE }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');

                if (yPos + labelHeightMm > pageHeightMm - paddingMM) {
                    pdf.addPage();
                    yPos = paddingMM;
                    xPos = paddingMM;
                }
                if (xPos + labelWidthMm > pageWidthMm - paddingMM) {
                    yPos += labelHeightMm + paddingMM;
                    xPos = paddingMM;
                    if (yPos + labelHeightMm > pageHeightMm - paddingMM) {
                        pdf.addPage();
                        yPos = paddingMM;
                    }
                }

                pdf.addImage(imgData, 'PNG', xPos, yPos, labelWidthMm, labelHeightMm);
                yPos += labelHeightMm + paddingMM;

                resolve();
            }).catch(err => {
                console.error(`Error al convertir etiqueta ${index + 1} a imagen para PDF:`, err);
                resolve();
            });
        });
    };

    (async () => {
        for (let i = 0; i < generatedLabels.length; i++) {
            await addLabelToPdf(generatedLabels[i], i);
        }
        pdf.save('etiquetas_generadas.pdf');
        alert('PDF generado y descargado.');
    })();
}
