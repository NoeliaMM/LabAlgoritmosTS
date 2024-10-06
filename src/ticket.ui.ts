import {TicketFinal} from './model';

export const imprimirTicket = (ticket: TicketFinal): void => {

  const contenedorTicket = document.getElementById('ticket');

  if (contenedorTicket !== undefined && contenedorTicket !== null && contenedorTicket instanceof HTMLElement ) {
     
        const lineasHtml = ticket.lineas.map(linea => `
            <tr>
                <td>${linea.nombre}</td>
                <td class='derecha'>${linea.cantidad}</td>
                <td>${linea.tipoIva}</td>
                <td class='derecha'>${(linea.precioSinIva/linea.cantidad).toFixed(2)} €</td>
                <td class='derecha'>${(linea.precioConIva/linea.cantidad).toFixed(2)} €</td>
                <td class='derecha'>${(linea.precioSinIva).toFixed(2)} €</td>         
                <td class='derecha'>${(linea.precioConIva).toFixed(2)} €</td>
            </tr>
        `).join('');

        const desgloseIvaHtml = ticket.desgloseIva.map(iva => `
            <tr>
                <td>${iva.tipoIva}</td>
                <td>${iva.cuantia.toFixed(2)} €</td>
            </tr>
        `).join('');

        const ticketHtml = `  
            <table border="1">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Tipo IVA</th>
                        <th>Precio sin IVA</th>
                        <th>Precio con IVA</th>     
                        <th>Total linea sin IVA</th>            
                        <th>Total linea con IVA</th>
                    </tr>              
                </thead>
                <tbody>
                    ${lineasHtml}
                <tr class='bold'>
                <td>Totales</td>
                <td class='derecha'></td>
                <td></td>
                <td class='derecha'></td>          
                <td class='derecha'></td>
                <td class='derecha'>${ticket.total.totalSinIva.toFixed(2)} €</td>
                <td class='derecha'> ${ticket.total.totalConIva.toFixed(2)} €</td>
            </tr>
                </tbody>
            </table>
            
        
            
            <h3>Desglose por IVA</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Tipo de IVA</th>
                        <th>Cuantía</th>
                    </tr>
                </thead>
                <tbody>
                    ${desgloseIvaHtml}
                </tbody>
            </table>
        `;

        contenedorTicket.innerHTML = ticketHtml;
    }
}



  

