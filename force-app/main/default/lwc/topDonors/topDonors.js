import { LightningElement, wire } from 'lwc';
import getTopAccounts from '@salesforce/apex/topAccounts.getTopAccounts';
import logosalesforce from '@salesforce/resourceUrl/logosalesforce';

export default class TopDonors extends LightningElement {

@wire(getTopAccounts) accounts;
salesforce = logosalesforce;





}