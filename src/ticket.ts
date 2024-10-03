import { LineaTicket, Producto, ResultadoLineaTicket, ResultadoTotalTicket, TicketFinal, TipoIva, TotalPorTipoIva } from './model';

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
    return precio + iva;
}

export const calculaLineaTicket =(producto:Producto,cantidad:number) : ResultadoLineaTicket =>{

const valorIva = mapearTipoIva(producto.tipoIva);
const precioConIva = calcularPrecioConIva(producto.precio,valorIva);  
    return {
      nombre: producto.nombre,
      cantidad: cantidad,
      precioSinIva: producto.precio, 
      tipoIva: producto.tipoIva,
      precioConIva: parseFloat(precioConIva.toFixed(2)) 
    };   
}

// devolverá un ticket que contendrá la siguiente información:
//Por cada producto queremos el nombre, la cantidad, el precio sin IVA, el tipo de IVA y el precio con IVA.
const calcularResultadoTotalTicket = (totalSinIva:number,totalConIva:number):ResultadoTotalTicket =>{
 return {
  totalSinIva: totalSinIva,
  totalConIva:totalConIva,
  totalIva: totalConIva - totalSinIva
 }
}

const calcularDesgloseIva = (resultadoLineas: ResultadoLineaTicket[]):TotalPorTipoIva[]=>{

  let totalesPorIva:TotalPorTipoIva[]=[];
 const totalGeneral = resultadoLineas.filter(item => item.tipoIva === 'general')
                                    .reduce((total, item) => total + (item.precioConIva - item.precioSinIva), 0);
  totalesPorIva = [...totalesPorIva, { tipoIva: 'general', cuantia: totalGeneral }];

//  "general"
//   | "reducido"
//   | "superreducidoA"
//   | "superreducidoB"
//   | "superreducidoC"
//   | "sinIva";


 return totalesPorIva;
}

const calculaTicket = (lineasTicket: LineaTicket[]):TicketFinal => {

  const totalResultadoLineas =[];
  let totalLineaSinIva = 0;
  let totalLineaConIva = 0;
  for(let i = 0; i< lineasTicket.length; i++){
    const lineaConIva = calculaLineaTicket(lineasTicket[i].producto,lineasTicket[i].cantidad);
    totalResultadoLineas.push(lineaConIva);
    totalLineaConIva =+ lineaConIva.precioConIva;
    totalLineaSinIva =+ lineaConIva.precioSinIva;
  }

  return {
            lineas: totalResultadoLineas,
            total: calcularResultadoTotalTicket(totalLineaConIva,totalLineaSinIva), 
            desgloseIva:calcularDesgloseIva(totalResultadoLineas)
          };   
    
};

  

