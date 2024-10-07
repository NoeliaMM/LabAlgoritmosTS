import { LineaTicket, TicketFinal, TipoIva } from './model';
import {calcularPrecioConIva, calculaTicket, mapearTipoIva} from './ticket';


describe("mapearTipoIva", () => {
  
  it.each([
    ["general", 21],  
    ["reducido", 10],  
    ["superreducidoA", 5],  
    ["superreducidoB", 4],  
    ["superreducidoC", 0],  
    ["sinIva", 0]    
  ] as const)("El iva %s es: %s", (tipo:TipoIva, resultadoEsperado:number) => {

    // Act
    const resultado = mapearTipoIva(tipo);

    // Assert
    expect(resultado).toBe(resultadoEsperado);
  });
});

describe("calcularPrecioConIva", () => {
    it.each([
      [10,10,11],  
      [2,21,2.42], 
      [2,0,2]
  
    ])("Para un precio de %s con iva %s el valor es %s", (precio:number,iva:number,resultadoEsperado:number) => {
  
      // Act
      const resultado = calcularPrecioConIva(precio,iva);
  
      // Assert
      expect(resultado).toBe(resultadoEsperado);
    });

});

describe("calculaTicket", () => {
  it('Debe devolver un total con IVA de', () => {

   const lineasTicket :LineaTicket[] =
   [{ 
        producto:  { nombre: 'pan',  
        precio: 1,
        tipoIva: 'reducido'},
        cantidad: 1
      }
    ];

    const resultado : TicketFinal = calculaTicket(lineasTicket);

    expect(resultado.total.totalConIva).toBe(1.1);
    expect(resultado.total.totalSinIva).toBe(1);
    expect(resultado.total.totalIva).toBe(0.1);
  });
});