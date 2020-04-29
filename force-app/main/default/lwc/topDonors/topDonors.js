import { LightningElement, wire } from 'lwc';
import getCompanies from '@salesforce/apex/topAccounts.getCompanies';
import getUsers from '@salesforce/apex/topAccounts.getUsers';

export default class TopDonors extends LightningElement {

@wire(getCompanies) companies;
@wire(getUsers) users;



}