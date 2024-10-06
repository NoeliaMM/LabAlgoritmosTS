import { productos } from './model';
import { calculaTicket } from './ticket';
import { imprimirTicket } from './ticket.ui';

document.addEventListener("DOMContentLoaded",function(){
    imprimirTicket(calculaTicket(productos));
});

  

