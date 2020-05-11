
import { LightningElement, track, api} from 'lwc';
import createContactRecord from '@salesforce/apex/ContactController.createContactRecord';
import mxn_eq from '@salesforce/label/c.MXN_meal';
import usd_eq from '@salesforce/label/c.USD_meal';
export default class Donors extends LightningElement {

    //Incorporamos las variables de las etiquetas con la equivalencia en dolar y pesos de cada comida
    label = {
        mxn_eq,
        usd_eq,
    };
@track anonimato = false;
@track value = [''];
@track cantidadComidas; // aqui estaba definido = ''
@track money = '';
@track openmodel = false;
@track nombre;
@track apellido;
@track apellidoMaterno;
@track correo;
@track urlimage = "";
@track textpayment = "";
@track orgName = null;
@track condicion = false;
selecciónCuenta;
@track valorPesos;
@track fullUrl;


    

   actualizaNombre(event){
        this.nombre = event.target.value;
    }
    actualizaApellido(event){
        this.apellido = event.target.value;
    }
    actualizaApellidoMaterno(event){
        this.apellidoMaterno = event.target.value;
    }
    actualizaCorreo(event){
        this.correo = event.target.value;
    }
    actualizaOrgName(event){
        this.orgName = event.target.value;
    }
    
    //Cambia el estado del anónimato cuando se realiza un click
    mantenerAnonimato(){
        this.anonimato = !this.anonimato;
    }



    ejecute(){
        if(this.nombre != null && this.apellido != null && 
         this.correo != null  &&  (this.cantidadComidas != null || this.cantidadComidas != '')){
            this.condicion = true;
 

        }else{
            this.condicion = false;

        }
    }



/* nuevo metodo para validar campos funciona con el required del html*/

darClick(evt) {
    console.log('Valor de la entrada: ' + evt.target.value);

    const todoValido = [...this.template.querySelectorAll('lightning-input')].reduce((validado, entradasFaltantes) => {
                    entradasFaltantes.reportValidity();
                    return validado && entradasFaltantes.checkValidity();
        }, true);
    if (todoValido) {
        
        //Método de inserción de contacto
        this.insertarContacto(); 
        
        //Reedirecciona a página de agradecimiento

        window.location.replace("https://donor-uady.cs41.force.com/donaciones/s/thank-you-page");
        

    } else {
        alert('Reintenta de nuevo..');
    }
}
    
         renderedCallback()
         {  
             
             var segundoA;

             
             
            if(this.apellidoMaterno == null || this.apellidoMaterno == ''){
                segundoA = 'null';
            }else{
                segundoA = this.apellidoMaterno;
            }

            
            



            this.valorPesos = (this.cantidadComidas*mxn_eq);

     

            if(this.condicion == true){
          
            this.fullUrl=`https://donor-metodopaypal.cs41.force.com/metodoPaypal?data=${this.correo}/${this.valorPesos}/${this.nombre}/${this.apellido}/${segundoA}/${this.orgName}/${this.anonimato}`;
           
         
        
        
        
        
        }
            this.ejecute();
        
        }




//Seccion de inserción de objetos en APEX
   
    insertarContacto(){
        this.valorPesos = (this.cantidadComidas*mxn_eq);

        let cont = { 'sobjectType': 'Contact' };
        cont.FirstName = this.nombre;
        cont.LastName = this.apellido;
        cont.Apellido_Materno__c = this.apellidoMaterno;
        cont.Email = this.correo;

        let opp = { 'sobjectType': 'Opportunity'};
        
        opp.StageName = 'Pledged';
        opp.Amount = (this.cantidadComidas*mxn_eq);
        opp.banderaTipoPago__c = 'oxxo'; 
        

        //orgName es el nombre de la compañía

        createContactRecord({newContact: cont, newOpportunity: opp, orgName: this.orgName, accountAnonimaty: this.anonimato})
        .then(result => {
            this.recordId = result;
            console.log(result);
        })
        .catch(error => {
            console.log(error);
            this.error = error;
        });  
    }
    
   




//Finaliza Sección

    get selectedValues() {
        return this.value.join(',');
    }

    handleChange(e) {
        this.value = e.detail.value;
    }


    insertarComidasManual(event){

        this.cantidadComidas = event.target.value;

    }


       comidasSeleccionadas(event) {
       
        this.cantidadComidas = event.target.value;
        this.money = 0;
    }

    equivalenciaDolar(event) {
      
    this.money = usd_eq * this.cantidadComidas;

    }

    equivalenciaPeso(event) {
      
    this.money = mxn_eq * this.cantidadComidas;

    }




    


 icono = {
        picture: 'direccion de logo'
    };

    /* Empieza combobox  payment */

    get paymentoptions() {
        return [
            { label: 'Oxxo', value: 'oxxo' },
            { label: 'PayPal', value: 'paypal' },
        ];
    }


    pagoOxxo = false;
    pagoPaypal = false;

    changePayment(event) {
        this.value = event.detail.value;
        if(this.value == 'oxxo'){

            this.pagoOxxo = true;
            this.pagoPaypal = false;
        }
            if(this.value == 'paypal'){
            this.pagoPaypal = true;
            this.pagoOxxo = false;
            }
        }

    /* Empieza combobox type donor */

  
    


}