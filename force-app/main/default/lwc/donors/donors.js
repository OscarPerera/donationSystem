
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

@track value = [''];
@track cantidadComidas= 0;
@track money = 0;
@track openmodel = false;
@track nombre;
@track apellido;
@track email;
@track urlimage = "";
@track textpayment = "";
@track prueba ="hola";




    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 
    saveMethod() {
        alert('Guardado');
        this.closeModal();
    }

   actualizaNombre(event){
        this.nombre = event.target.value;
    }
    actualizaApellido(event){
        this.apellido = event.target.value;
    }
    actualizaCorreo(event){
        this.correo = event.target.value;
    }
    



/* nuevo metodo para validar campos funciona con el required del html*/

darClick(evt) {
    console.log('Valor de la entrada: ' + evt.target.value);

    const todoValido = [...this.template.querySelectorAll('lightning-input')].reduce((validado, entradasFaltantes) => {
                    entradasFaltantes.reportValidity();
                    return validado && entradasFaltantes.checkValidity();
        }, true);
    if (todoValido) {
        alert('Todo esta correcto');
        this.openmodel = true
       
        //Método de inserción de contacto
        this.insertarContacto(); 
        
       
    } else {
        alert('Reintenta de nuevo..');
    }
}



//Seccion de inserción de objetos en APEX
   
    insertarContacto(){
    
        let cont = { 'sobjectType': 'Contact' };
        cont.FirstName = this.nombre;
        cont.LastName = this.apellido;
        cont.Email = this.correo;

        let opp = { 'sobjectType': 'Opportunity'};
        opp.Name = 'nueva oportunidad';
        opp.CloseDate = this.FECHA_FINAL_SEMESTRE;
        opp.StageName = 'Prospecting';
        opp.Amount = (this.cantidadComidas*mxn_eq);
        opp.CloseDate = '10/14/2017'

        createContactRecord({newRecord: cont, newOpportunity: opp})
        .then(result => {
            this.recordId = result;
            console.log(result);
        })
        .catch(error => {
            console.log(error);
            this.error = error;
        });  
    }
    //Comienzo de creación de oportunity
   




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
       
        const buttonNumber = event.target.dataset.buttonNumber;
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

    changePayment(event) {
        this.value = event.detail.value;
        if(this.value == 'oxxo'){
            this.textpayment = "Al dar click en el botón 'DONAR', se generará una ficha de pago para que realice su donación en OXXO más cercano.";
        }
            if(this.value == 'paypal'){
            this.textpayment = "Al dar click en el botón 'DONAR', se le redireccionará a una ventana de pago PayPal.";
            }
        }

    /* Empieza combobox type donor */

    get donortype(){
        return[
            {label:'Usuario único', value: 'usuario'},
            {label:'Empresa', value:'empresa'},
        ];
    }

    chooseDonor(event){
        this.value = event.detail.value;
        if(this.value == 'usuario'){
            return this.insertarContacto();
        }
        if(this.value == 'empresa'){
            return this.prueba ;
        }
    }

}