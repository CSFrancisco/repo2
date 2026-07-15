#!/usr/bin/env python3
"""Genera MANUAL_USUARIO.pdf a partir del contenido del manual."""

from fpdf import FPDF
from fpdf.enums import XPos, YPos


class ManualPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("DejaVu", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(
                0,
                8,
                "Manual de Usuario - Generador de Etiquetas y Codigos QR",
                align="C",
                new_x=XPos.LMARGIN,
                new_y=YPos.NEXT,
            )
            self.ln(2)

    def footer(self):
        self.set_y(-12)
        self.set_font("DejaVu", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Pagina {self.page_no()}", align="C")

    def section_title(self, number, title):
        self.ln(4)
        self.set_font("DejaVu", "B", 14)
        self.set_text_color(0, 86, 179)
        self.multi_cell(0, 8, f"{number}. {title}")
        self.set_text_color(0, 0, 0)
        self.ln(2)

    def subsection_title(self, title):
        self.ln(2)
        self.set_font("DejaVu", "B", 11)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 7, title)
        self.set_text_color(0, 0, 0)
        self.ln(1)

    def body_text(self, text):
        self.set_font("DejaVu", "", 10)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def bullet(self, text):
        self.set_font("DejaVu", "", 10)
        self.multi_cell(0, 5.5, f"  - {text}")

    def note_box(self, text):
        self.set_fill_color(240, 248, 255)
        self.set_font("DejaVu", "B", 9)
        self.multi_cell(0, 6, f"Nota: {text}", fill=True)
        self.ln(2)

    def important_box(self, text):
        self.set_fill_color(255, 243, 205)
        self.set_font("DejaVu", "B", 9)
        self.multi_cell(0, 6, f"Importante: {text}", fill=True)
        self.ln(2)

    def add_table(self, headers, rows, col_widths=None):
        if not col_widths:
            col_widths = [190 / len(headers)] * len(headers)

        self.set_font("DejaVu", "B", 9)
        self.set_fill_color(0, 86, 179)
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 8, header, border=1, fill=True)
        self.ln()

        self.set_font("DejaVu", "", 9)
        self.set_text_color(0, 0, 0)
        fill = False
        for row in rows:
            if self.get_y() > 270:
                self.add_page()
            self.set_fill_color(245, 245, 245) if fill else self.set_fill_color(255, 255, 255)
            line_height = 7
            x_start = self.get_x()
            y_start = self.get_y()
            max_height = line_height

            cell_lines = []
            for i, cell in enumerate(row):
                self.set_xy(x_start + sum(col_widths[:i]), y_start)
                self.multi_cell(col_widths[i], line_height, str(cell), border=0)
                cell_height = self.get_y() - y_start
                max_height = max(max_height, cell_height)
                cell_lines.append(cell)

            self.rect(x_start, y_start, sum(col_widths), max_height)
            x = x_start
            for i, cell in enumerate(cell_lines):
                self.set_xy(x, y_start)
                self.multi_cell(col_widths[i], line_height, str(cell), border=0)
                x += col_widths[i]

            self.set_xy(x_start, y_start + max_height)
            fill = not fill
        self.ln(3)


def build_pdf():
    pdf = ManualPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    font_dir = None
    pdf.add_font("DejaVu", "", "DejaVuSans.ttf")
    pdf.add_font("DejaVu", "B", "DejaVuSans-Bold.ttf")
    pdf.add_font("DejaVu", "I", "DejaVuSans-Oblique.ttf")

    # Portada
    pdf.ln(35)
    pdf.set_font("DejaVu", "B", 24)
    pdf.set_text_color(0, 86, 179)
    pdf.multi_cell(0, 12, "Manual de Usuario", align="C")
    pdf.ln(4)
    pdf.set_font("DejaVu", "B", 16)
    pdf.multi_cell(0, 10, "Generador de Etiquetas y\nCodigos QR desde Excel", align="C")
    pdf.ln(20)
    pdf.set_font("DejaVu", "", 11)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(
        0,
        7,
        "Guia completa para crear etiquetas personalizadas con codigos QR\n"
        "a partir de archivos Excel (.xls / .xlsx).",
        align="C",
    )
    pdf.ln(30)
    pdf.set_font("DejaVu", "I", 10)
    pdf.multi_cell(0, 6, "Version del manual: 2026", align="C")

    # Contenido
    pdf.add_page()
    pdf.section_title("1", "Introduccion")
    pdf.body_text(
        "Esta aplicacion permite crear etiquetas personalizadas con codigos QR a partir de un "
        "archivo Excel (.xls o .xlsx). Cada fila del Excel se convierte en una etiqueta "
        "individual que puedes previsualizar y descargar en formato JPG (dentro de un ZIP) o PDF."
    )
    pdf.subsection_title("Caracteristicas principales")
    for item in [
        "Carga de datos desde Excel",
        "Generacion automatica de codigos QR",
        "Diseno personalizable de etiquetas (tamano, colores, posicion)",
        "Titulo opcional con texto o logo",
        "Alineacion independiente del titulo y del contenido",
        "Descarga masiva en ZIP (JPG) o PDF",
    ]:
        pdf.bullet(item)
    pdf.ln(2)
    pdf.subsection_title("Requisitos")
    for item in [
        "Navegador web moderno (Chrome, Firefox, Edge, Safari)",
        "Conexion a internet (para cargar algunas librerias externas)",
        "Archivo Excel con encabezados en la primera fila",
        "Archivo js/qrcode.min.js presente en la carpeta del proyecto",
    ]:
        pdf.bullet(item)

    pdf.section_title("2", "Como iniciar la aplicacion")
    for i, step in enumerate(
        [
            "Abre la carpeta del proyecto en tu computadora.",
            'Haz doble clic en el archivo index.html, o abrelo con tu navegador preferido.',
            'Se mostrara la pantalla principal con el titulo "Generador de Etiquetas y Codigos QR desde Excel".',
        ],
        1,
    ):
        pdf.body_text(f"{i}. {step}")
    pdf.note_box("No es necesario instalar nada. La aplicacion funciona directamente en el navegador.")

    pdf.section_title("3", "Preparar el archivo Excel")
    pdf.body_text("Antes de usar la aplicacion, organiza tu archivo Excel de la siguiente manera:")
    pdf.add_table(
        ["Codigo", "Nombre del producto", "Precio", "URL"],
        [
            ["ABC001", "Producto A", "$100", "https://ejemplo.com/abc001"],
            ["ABC002", "Producto B", "$200", "https://ejemplo.com/abc002"],
        ],
        [30, 55, 25, 80],
    )
    pdf.subsection_title("Recomendaciones")
    for item in [
        "La primera fila debe contener los nombres de las columnas (encabezados).",
        "Cada fila siguiente representara una etiqueta.",
        "Evita filas vacias al inicio o en medio de los datos.",
        "El archivo puede ser .xls o .xlsx.",
    ]:
        pdf.bullet(item)

    pdf.section_title("4", "Flujo de trabajo paso a paso")
    pdf.body_text("El proceso completo consta de 4 pasos:")
    pdf.set_font("DejaVu", "B", 10)
    pdf.multi_cell(
        0,
        6,
        "1. Cargar Excel  ->  2. Seleccionar columnas  ->  3. Disenar formato  ->  4. Descargar",
        align="C",
    )
    pdf.ln(3)

    pdf.subsection_title("Paso 1: Cargar el archivo Excel")
    for i, step in enumerate(
        [
            'En la seccion "Selecciona un archivo Excel", haz clic en el boton de seleccion de archivo.',
            "Elige tu archivo .xls o .xlsx.",
            "Si el archivo es valido, apareceran las secciones de seleccion de datos y diseno de formato.",
        ],
        1,
    ):
        pdf.body_text(f"{i}. {step}")

    pdf.subsection_title("Paso 2: Seleccionar los datos del Excel")
    pdf.body_text("Dato para Codigo QR: selecciona la columna cuyo valor se codificara en el QR.")
    pdf.body_text("Contenido de la Etiqueta: elige las columnas que apareceran como texto.")
    pdf.body_text('Puedes agregar mas campos con "Anadir otro campo a la etiqueta".')
    pdf.add_table(
        ["Campo", "Columna seleccionada"],
        [
            ["Dato QR", "URL"],
            ["Dato 1", "Nombre del producto"],
            ["Dato 2", "Precio"],
        ],
        [60, 130],
    )

    pdf.add_page()
    pdf.subsection_title("Paso 3: Disenar el formato de la etiqueta")

    pdf.body_text("3.1 Tamano de la etiqueta")
    pdf.add_table(
        ["Opcion", "Descripcion", "Valor por defecto"],
        [
            ["Ancho (cm)", "Ancho fisico de la etiqueta", "5 cm"],
            ["Alto (cm)", "Alto fisico de la etiqueta", "3 cm"],
        ],
        [40, 90, 60],
    )

    pdf.body_text("3.2 Codigo QR")
    pdf.add_table(
        ["Opcion", "Descripcion", "Valor por defecto"],
        [
            ["Incluir Codigo QR", "Activa o desactiva el QR", "Activado"],
            ["Posicion del QR", "Ubicacion del QR", "Abajo Derecha"],
            ["Tamano del QR (cm)", "Tamano del codigo QR", "2 cm"],
            ["Color del QR", "Color de los modulos", "Negro"],
            ["Fondo QR", "Color de fondo del QR", "Blanco"],
        ],
        [45, 95, 50],
    )
    pdf.body_text(
        "Posiciones disponibles: Arriba Izquierda, Arriba Central, Arriba Derecha, "
        "Abajo Izquierda, Abajo Central, Abajo Derecha, Centro."
    )
    pdf.important_box(
        "El tamano del QR no puede ser mayor que el ancho o alto de la etiqueta."
    )

    pdf.body_text("3.3 Contenido de texto")
    pdf.add_table(
        ["Opcion", "Descripcion", "Valor por defecto"],
        [
            ["Mostrar Titulos de Columna", "Muestra nombre de columna + dato", "Desactivado"],
            ["Alineacion del Texto", "Alineacion horizontal del contenido", "Centro"],
        ],
        [55, 85, 50],
    )

    pdf.body_text("3.4 Titulo de la etiqueta (opcional)")
    pdf.body_text("1. Marca la casilla Incluir titulo.")
    pdf.body_text("2. Elige el tipo: Texto o Logo / Imagen.")
    pdf.body_text("Opcion Texto: escribe el titulo y ajusta el tamano en px (8-72).")
    pdf.body_text("Opcion Logo: sube una imagen y define el alto en cm.")
    pdf.body_text("3. Configura la alineacion del titulo: Centro, Izquierda o Derecha.")
    pdf.note_box(
        "La alineacion del titulo es independiente de la alineacion del texto del contenido."
    )

    pdf.body_text("3.5 Generar las etiquetas")
    for i, step in enumerate(
        [
            'Haz clic en "Aplicar Formato y Generar Etiquetas".',
            "Si falta algun dato obligatorio, veras un mensaje de alerta.",
            'Si todo es correcto, aparecera la seccion "Vista Previa de Etiquetas".',
        ],
        1,
    ):
        pdf.body_text(f"{i}. {step}")

    pdf.subsection_title("Paso 4: Vista previa y descarga")
    pdf.body_text("Vista previa: se muestra una etiqueta por cada fila del Excel.")
    pdf.body_text("Descargar ZIP (JPG):")
    for i, step in enumerate(
        [
            'Selecciona la columna en "Usar como nombre de archivo".',
            'Haz clic en "Descargar Todas como ZIP (JPG)".',
            "Se descargara etiquetas_descargadas.zip con una imagen JPG por etiqueta.",
        ],
        1,
    ):
        pdf.body_text(f"  {i}. {step}")
    pdf.body_text("Descargar PDF:")
    for i, step in enumerate(
        [
            'Haz clic en "Descargar Todas (PDF)".',
            "Se descargara etiquetas_generadas.pdf en paginas tamano A4.",
        ],
        1,
    ):
        pdf.body_text(f"  {i}. {step}")

    pdf.add_page()
    pdf.section_title("5", "Ejemplo completo")
    pdf.add_table(
        ["SKU", "Producto", "Precio", "Enlace"],
        [
            ["P001", "Camiseta", "$250", "https://tienda.com/p001"],
            ["P002", "Pantalon", "$450", "https://tienda.com/p002"],
        ],
        [25, 45, 30, 90],
    )
    pdf.subsection_title("Configuracion sugerida")
    for item in [
        "Columna QR: Enlace",
        "Contenido etiqueta: Producto y Precio",
        "Tamano etiqueta: 6 cm x 4 cm",
        "QR: Abajo Derecha, 2 cm, negro sobre blanco",
        "Mostrar titulos de columna: Activado",
        "Alineacion del texto: Izquierda",
        'Titulo: Texto "Mi Tienda", centrado, 16 px',
        "Nombre de archivo ZIP: Columna SKU",
    ]:
        pdf.bullet(item)
    pdf.ln(2)
    pdf.body_text(
        'Resultado: Dos etiquetas con el titulo "Mi Tienda" arriba, producto y precio '
        "alineados a la izquierda, y el QR en la esquina inferior derecha."
    )

    pdf.section_title("6", "Mensajes de error comunes")
    pdf.add_table(
        ["Mensaje", "Causa", "Solucion"],
        [
            ["Excel vacio o sin datos", "No hay filas de datos", "Verifica datos bajo encabezados"],
            ["Selecciona columna para QR...", "Faltan columnas", "Elige QR y al menos un texto"],
            ["QR demasiado grande", "QR excede tamano", "Reduce QR o aumenta etiqueta"],
            ["Escribe texto del titulo...", "Titulo sin texto", "Escribe titulo o desactiva opcion"],
            ["Selecciona imagen para logo...", "Logo sin imagen", "Sube imagen o usa texto"],
            ["Libreria QR no disponible", "Falta qrcode.min.js", "Verifica carpeta js/"],
            ["Selecciona columna nombres...", "ZIP sin columna", "Elige columna para nombres"],
        ],
        [55, 55, 80],
    )

    pdf.section_title("7", "Consejos y buenas practicas")
    pdf.subsection_title("Para mejores etiquetas impresas")
    for item in [
        "Usa tamanos en cm que coincidan con tus etiquetas fisicas reales.",
        "Manten el QR con buen contraste (oscuro sobre fondo claro).",
        "No hagas el QR demasiado pequeno; 1.5-2 cm suele ser un buen minimo.",
        "Usa logos PNG con fondo transparente para mejor resultado.",
    ]:
        pdf.bullet(item)
    pdf.ln(1)
    pdf.subsection_title("Para el archivo Excel")
    for item in [
        "Usa nombres de columna claros y sin caracteres especiales.",
        "Si usas nombres para el ZIP, asegurate de que los valores sean unicos.",
        "Evita celdas vacias en las columnas que vas a usar.",
    ]:
        pdf.bullet(item)
    pdf.ln(1)
    pdf.subsection_title("Para la descarga")
    for item in [
        "El ZIP es ideal para archivos individuales por producto.",
        "El PDF es ideal para imprimir varias etiquetas en hojas A4.",
        "Si cambias el diseno, vuelve a generar antes de descargar.",
    ]:
        pdf.bullet(item)

    pdf.section_title("8", "Estructura de archivos del proyecto")
    pdf.set_font("DejaVu", "", 9)
    structure = (
        "qr version 2/\n"
        "  index.html          <- Abre este archivo para usar la aplicacion\n"
        "  script.js           <- Logica de la aplicacion\n"
        "  style.css           <- Estilos visuales\n"
        "  js/qrcode.min.js    <- Libreria QR (requerida)\n"
        "  MANUAL_USUARIO.pdf  <- Este manual"
    )
    pdf.set_fill_color(245, 245, 245)
    pdf.multi_cell(0, 5.5, structure, fill=True)

    pdf.section_title("9", "Preguntas frecuentes (FAQ)")
    faqs = [
        (
            "Se suben mis datos a internet?",
            "No. El Excel se procesa completamente en tu navegador.",
        ),
        (
            "Puedo usar la aplicacion sin internet?",
            "Parcialmente. Necesitas internet para cargar algunas librerias la primera vez.",
        ),
        (
            "Cuantas etiquetas puedo generar?",
            "No hay limite fijo, pero con muchas filas el navegador puede volverse lento.",
        ),
        (
            "Puedo generar etiquetas sin codigo QR?",
            "Si. Desmarca Incluir Codigo QR (aun debes seleccionar columna QR actualmente).",
        ),
        (
            "El titulo es igual en todas las etiquetas?",
            "Si. El titulo es fijo; los datos variables vienen del Excel.",
        ),
        (
            "Puedo cambiar el diseno despues de generar?",
            'Si. Modifica las opciones y haz clic en "Aplicar Formato y Generar Etiquetas".',
        ),
    ]
    for question, answer in faqs:
        pdf.set_font("DejaVu", "B", 10)
        pdf.multi_cell(0, 5.5, question)
        pdf.set_font("DejaVu", "", 10)
        pdf.multi_cell(0, 5.5, answer)
        pdf.ln(1)

    pdf.section_title("10", "Resumen rapido")
    pdf.add_table(
        ["Paso", "Accion"],
        [
            ["1", "Cargar archivo Excel"],
            ["2", "Elegir columna para QR y columnas para el texto"],
            ["3", "Configurar tamano, QR, titulo y alineaciones"],
            ["4", 'Clic en "Aplicar Formato y Generar Etiquetas"'],
            ["5", "Revisar vista previa"],
            ["6", "Descargar como ZIP (JPG) o PDF"],
        ],
        [20, 170],
    )

    output = "MANUAL_USUARIO.pdf"
    pdf.output(output)
    print(f"PDF generado: {output}")


if __name__ == "__main__":
    build_pdf()
