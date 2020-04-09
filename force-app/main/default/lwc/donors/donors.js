
import { LightningElement, track, api} from 'lwc';
import createContactRecord from '@salesforce/apex/ContactController.createContactRecord';
import hacerEnvio from '@salesforce/apex/EnvioControlador.hacerEnvio';
import GenerarPdf from '@salesforce/apex/ReporteController.GenerarPdf';

export default class Donors extends LightningElement {

 VALOR_COMIDA_PESOS = 50;
 FECHA_FINAL_SEMESTRE = '07/04/2020';
@track value = [''];
@track cantidadComidas= 0;
@track money = 0;
@track openmodel = false;
@track buttonStatefulState = false;
@track buttonIconStatefulState = false;
@track nombre;
@track apellido;
@track email;




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
        /*Este es el metodo de oscar, lo llame en esta parte si no funciona.. copiar todo lo que esta dentro
        de insertarContacto arriba de this.openmodel = true */
        this.insertarContacto(); 
        GenerarPdf({direccion:this.correo})
        .then(result => {
            console.log('Funciono el envio')

        })
        .catch(error => {
            console.log('No funciono el envio')

        });
      

        hacerEnvio({correo:this.correo,nombre:this.nombre,cantidad:this.cantidadComidas})
        .then(result => {
            console.log('Funciono correcto')

        })
        .catch(error => {
            console.log('No funciono el envio')

        });
        
       
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
        opp.Amount = (this.cantidadComidas*this.VALOR_COMIDA_PESOS);

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

   get options() {
        return [
            { label: 'Facebook', value: 'option1' },
            { label: 'Twitter', value: 'option2' },
        ];
    }

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
      
    this.money = event.target.value*this.cantidadComidas;

    }

    equivalenciaPeso(event) {
      
    this.money = event.target.value*this.cantidadComidas;

    }




    


 icono = {
        picture: 'direccion de logo'
    };

/*
    handleButtonStatefulClick() {
        this.buttonStatefulState = !this.buttonStatefulState;
    }
    handleButtonIconStatefulClick() {
        this.buttonIconStatefulState = !this.buttonIconStatefulState;
    }
*/
}