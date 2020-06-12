import { LightningElement, track, api } from 'lwc';
import saveFile from '@salesforce/apex/subirController.saveFile';
import releatedFiles from '@salesforce/apex/subirController.releatedFiles';
import validar from '@salesforce/apex/subirController.validar';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

/*Este es el javascript correcto de la clase subirLWC, en todo caso que se hagan futuras modificaciones a los diferentes archivos*/

const columns = [
    {label: 'Title', fieldName: 'Title'}
];


export default class subirLWC extends LightningElement {
    @api recordId;
    @track columns = columns;
    @track codigo;
    @track data;
    @track fileName = '';
    @track UploadFile = 'Upload File';
    @track showLoadingSpinner = false;
    @track isTrue = false;

    selectedRecords;
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;
    MAX_FILE_SIZE = 1500000;
 
    


  

    /*Con este metodo va a retornar todo lo que este despues del .com considerando el id como un parametro */

    getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }
  

  
 /*Metodo que carga todo lo que este dentro una sola vez cuando se carga la pagina en un primer tiempo */
    connectedCallback() {
    
        this.getRelatedFiles();
        const param = 'id';
        this.codigo = this.getUrlParamValue(window.location.href, param);
        
    }

     /*Con este metodo cada vez que se realice un cambio este se ira modificando */
    renderedCallback(){
        this.validarCambio()(this.codigo);
    }
  
     /*Con este metodo va a retornar los formatos permitidos para subirlos */
    get acceptedFormats() {
        
        return ['.pdf', '.png','.jpeg','.jpg'];
      
    }


    /*Con este metodo verificara si ya se ha subido el comprobante, en todo caso que si, me redirigira a la pagina principal de donadores, en toco caso que no, este se quedara 
    en el apartado de subir comprobante */
     validarCambio(){
        validar({code:this.codigo})
        .then(result=>{
           
            if(result == false){
                
           
            }else{
          
                window.location.href="https://uady.force.com/donaciones/s/";
            }
        })
        .catch(error =>{

        })
        
    }




  /*Con este metodo se obtiene el archivo a subir */
    handleFilesChange(event) {
       
    
        if(event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
            this.fileName = event.target.files[0].name;
        }else{
    
            
        }
    }



     /*Este metodo verifica que ya se haya cargado un archivo antes de subirlo, en todo caso marcara un error -> select file to upload */

    handleSave() {
        if(this.filesUploaded.length > 0) {

            this.uploadHelper();
        }
        else {
            this.fileName = 'Select a file to upload';
        }
    }


    /*Este metodo verifica que el archivo no sea demasiado grande, en todo caso me saldra el siguiente anuncio */
    uploadHelper() {
        this.file = this.filesUploaded[0];
       if (this.file.size > this.MAX_FILE_SIZE) {
            alert('The file is too bigger');
            return ;
        }
        this.showLoadingSpinner = true;
        // create a FileReader object 
        this.fileReader= new FileReader();
        // set onload function of FileReader object  
        this.fileReader.onloadend = (() => {
            this.fileContents = this.fileReader.result;
            let base64 = 'base64,';
            this.content = this.fileContents.indexOf(base64) + base64.length;
            this.fileContents = this.fileContents.substring(this.content);

            // call the uploadProcess method 
            this.saveToFile();
        });
    
        this.fileReader.readAsDataURL(this.file);
    }

    // Calling apex class to insert the file
    /*Aqui, una vez verificado que todo este correcto se llama a la apex class para insertar el archivo antes cargado, en todo caso
    que hubera algun problema seria por el token introducido ya que los tokens ya estan definidos para cada usuario*/
    saveToFile() {
        
     
       
        saveFile({ strFileName: this.file.name, codigo:this.codigo,base64Data: encodeURIComponent(this.fileContents)})
        .then(result => {
            window.console.log('resultado ====> ' +result);
            // refreshing the datatable

         
            this.getRelatedFiles();

            this.fileName = this.fileName + ' - Success';
            this.UploadFile = 'Success';
            this.isTrue = true;
            this.showLoadingSpinner = false;

            // Showing Success message after file insert
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: this.file.name + ' - Success!!!',
                    variant: 'success',
                }),
            );

        })
        .catch(error => {
            // Showing errors if any while inserting the files
            window.console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error, incorrect token',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }



       // Getting releated files of the current record
       /*Codigo para encontrar archivos relacionados lo cual evitaria la doble inserccion de los archivos */
       
       getRelatedFiles() {
        releatedFiles({idParent: this.recordId})
        .then(data => {
            this.data = data;
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    
                }),
            );
        });
    }


    /*Este metodo se creo con la finalidad de que se pudieran mostrar los archivos cargados, sin embargo este no se implemento pero este metodo si es necesario para el funcionamiento
    del LWC */

    // Getting selected rows to perform any action
    getSelectedRecords(event) {
        let conDocIds;
        const selectedRows = event.detail.selectedRows;
        conDocIds = new Set();
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            conDocIds.add(selectedRows[i].ContentDocumentId);
        }

        this.selectedRecords = Array.from(conDocIds).join(',');

        window.console.log('Registros seleccionados =====> '+this.selectedRecords);
    }

 

}