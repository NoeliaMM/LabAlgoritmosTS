import { LineaTicket, Producto, productos, ResultadoLineaTicket, ResultadoTotalTicket, TicketFinal, TipoIva, TotalPorTipoIva } from './model';

export const mapearTipoIva = (tipoIva: TipoIva): number=> {
        switch (tipoIva) {
          case "general":
            return 21; 
          case "reducido":
            return 10;
          case "superreducidoA":
            return 5;
          case "superreducidoB":
            return 4;
          case "superreducidoC":
            return 0;
          case "sinIva":
            return 0;
    }
}
export const calcularPrecioConIva = (precio:number,valorIva:number): number =>{
    const iva = precio*valorIva /100;
    return (precio + iva);
}
export const precioPorCantidad =(precio:number, cantidad:number): number =>{
    return precio*cantidad; 
}


export const calculaLineaTicket =(producto:Producto,cantidad:number) : ResultadoLineaTicket =>{
    const valorIva = mapearTipoIva(producto.tipoIva);
    const preciosSinIvaXCantidad = precioPorCantidad(producto.precio,cantidad); 

    const precioConIva = calcularPrecioConIva(producto.precio,valorIva); 
    const precioConIvaXCantidad = precioPorCantidad(precioConIva,cantidad);

    return {
      nombre: producto.nombre,
      cantidad: cantidad,
      precioSinIva: parseFloat(preciosSinIvaXCantidad.toFixed(2)),//(Precio unitario *cantidad)
      tipoIva: producto.tipoIva,
      precioConIva: parseFloat(precioConIvaXCantidad.toFixed(2)) //(Precio unitario+iva *cantidad)
    };   
}

const calcularResultadoTotalTicket = (totalSinIva:number,totalConIva:number):ResultadoTotalTicket =>{
    return {
        totalSinIva: totalSinIva,
        totalConIva:totalConIva,
        totalIva: totalConIva - totalSinIva
    }
}

const calcularDesgloseIva = (resultadoLineas: ResultadoLineaTicket[]):TotalPorTipoIva[]=>{

  let totalesPorIva: TotalPorTipoIva[] = [];

    resultadoLineas.forEach(linea => {
        const totalIva = linea.precioConIva - linea.precioSinIva;
        const tipoExiste = totalesPorIva.find(tipo => tipo.tipoIva === linea.tipoIva);

        if (tipoExiste) {          
            tipoExiste.cuantia += totalIva;
        } else {        
            totalesPorIva.push({ tipoIva: linea.tipoIva, cuantia: totalIva });
        }
    });

    return ordenarTipoIva(totalesPorIva);
}

const ordenarTipoIva = (totales:TotalPorTipoIva[]): TotalPorTipoIva[]=>{

  const ordenTipoIva: TipoIva[] = ["general", "reducido", "superreducidoA", "superreducidoB", "superreducidoC", "sinIva"];

  totales.sort((a, b) => {
    return ordenTipoIva.indexOf(a.tipoIva) - ordenTipoIva.indexOf(b.tipoIva);
  });
  
  return totales;
}

export const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const { totalResultadoLineas, totalLineaConIva, totalLineaSinIva} = lineasTicket.reduce((total, linea) => {
          const calculoLinea = calculaLineaTicket(linea.producto, linea.cantidad);

          total.totalResultadoLineas.push(calculoLinea);
          total.totalLineaConIva += calculoLinea.precioConIva;
          total.totalLineaSinIva += calculoLinea.precioSinIva;  
   
          return total;
      },
      {
          totalResultadoLineas: [] as ResultadoLineaTicket[],
          totalLineaConIva: 0,
          totalLineaSinIva: 0         
      }
  );
  return {
      lineas: totalResultadoLineas,
      total: calcularResultadoTotalTicket(totalLineaSinIva, totalLineaConIva),
      desgloseIva: calcularDesgloseIva(totalResultadoLineas),
  };
};


const imprimirTicket = (ticket: TicketFinal): void => {

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

imprimirTicket(calculaTicket(productos));

  

