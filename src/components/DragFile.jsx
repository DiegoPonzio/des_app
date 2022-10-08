import { useState } from 'react'
import { useEffect } from 'react'
import '../Style/mystyle.css'
import CryptoJS from 'crypto-js'

export default function DragFile() {

    const [file, setFile] = useState();
    const [text, setText] = useState()

    function val() {
        const dropArea = document.querySelector('.drag-area')
        const dragText = dropArea.querySelector('h2')
        const button = dropArea.querySelector('button')
        const input = dropArea.querySelector('#input-file')

        button.onclick = e => {
            input.click()
        }

        input.oninput = e => {
            const { 0: File } = e.target.files
            setFile(File)
            dropArea.classList.add('active')
            leer(e.target.files)
            dropArea.classList.remove('active')
        }

        dropArea.ondragover = e => {
            e.preventDefault()
            dropArea.classList.add('active')
            dragText.textContent = "Suelta para subir los archivos"
        }

        dropArea.ondragleave = e => {
            e.preventDefault()
            dropArea.classList.remove('active')
            dragText.textContent = "Arrastra y suelta tu archivo txt"
        }

        dropArea.ondrop = e => {
            e.preventDefault()
            const { 0: File } = e.dataTransfer.files
            setFile(File)
            leer(e.dataTransfer.files)
            dropArea.classList.remove('active')
            dragText.textContent = "Arrastra y suelta tu archivo txt"
        }

        function leer(file) {
            const { 0: File } = file
            let reader = new FileReader()
            reader.readAsText(File, "UTF-8")

            reader.onload = fileLoadedEvent => {
                let txt = fileLoadedEvent.target.result
                setText(txt)
            }
        }

    }

    function cifrar() {

        let txt = text
        let clave = "qwertyui"
        if (clave.length !== 8) {
            alert("La clave debe tener 8 caracteres");
            return false;
        }

        let cifra = CryptoJS.DES.encrypt(txt, clave);

        descargarArchivo(generarTexto(cifra), 'TextoCifrado' + Math.random() + '.txt');

        function descargarArchivo(contBlob, nombreArchivo) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var save = document.createElement('a');
                save.href = event.target.result;
                save.target = '_blank';
                save.download = nombreArchivo;
                var clicEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                save.dispatchEvent(clicEvent);

                (window.URL || window.webkitURL).revokeObjectURL(save.href);
            };
            reader.readAsDataURL(contBlob);
            alert("Se descargara el archivo, okay?");
        };
        function generarTexto(datos) {
            let texto = [];
            texto.push(datos);
            return new Blob(texto, {
                type: 'text/plain'
            })
        }
    }

    function decifrar() {

        let txt = text
        let clave = "qwertyui"
        if (clave.length !== 8) {
            alert("La clave debe tener 8 caracteres");
            return false;
        }

        let cifra = CryptoJS.DES.decrypt(txt, clave);
        let cifraf = cifra.toString(CryptoJS.enc.Utf8)

        descargarArchivo(generarTexto(cifraf), 'TextoCifrado' + Math.random() + '.txt');

        function descargarArchivo(contBlob, nombreArchivo) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var save = document.createElement('a');
                save.href = event.target.result;
                save.target = '_blank';
                save.download = nombreArchivo;
                var clicEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                save.dispatchEvent(clicEvent);

                (window.URL || window.webkitURL).revokeObjectURL(save.href);
            };
            reader.readAsDataURL(contBlob);
            alert("Se descargara el archivo, okay?");
        };
        function generarTexto(datos) {
            let texto = [];
            texto.push(datos);
            return new Blob(texto, {
                type: 'text/plain'
            })
        }
    }

    return (
        <>  
            <h1>Cifrador DES</h1>
            <h2>By: Ruiz Ponzio Diego</h2>
            <br />

            <div className="drag-area">
                <h2>Arrastra y suelta tu archivo txt</h2>
                <span>O</span>
                <button id='button'>Selecciona un archivo</button>
                <input type="file" id="input-file" hidden accept=".txt" />
            </div>
            <br />

            <br />
            <div id="preview">
                {!file && <h3>Cargando...</h3>}
                {file && file.type !== "text/plain" && <h3>Los archivos son en formato txt</h3>}
                {file && file.type === "text/plain" && <h3>Se ha cargado el archivo: {file.name}</h3>}
                {file && file.type === "text/plain" && <p>texto: {text}</p>}
                {file && file.type === "text/plain" && <button className='button' onClick={cifrar}>Cifrar</button>}
                {file && file.type === "text/plain" && <button className='button' onClick={decifrar}>Descifrar</button>}
            </div>
            {
                useEffect(() => {
                    val()
                }, [])
            }
        </>
    )
}