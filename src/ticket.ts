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
        totalIva: parseFloat((totalConIva - totalSinIva).toFixed(2))
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
  

