import { TipoIva } from './model';
import {calcularPrecioConIva, mapearTipoIva} from './ticket';

// describe("calculaTicket", () => {
//   it("should pass spec", () => {
//     // Arrange

//     const producto ={
//       producto: {
//       nombre: "Legumbres",
//       precio: 2,
//       tipoIva: "general",
//       },
//       cantidad: 2,
//   }
//     // Act
//     calculaLineaTicket(producto);

//     // Assert
//     expect(true).toBeTruthy();
//   });
// });


describe("mapearTipoIva", () => {
  it.each([
    ["general", 21],  
    ["reducido", 10],  
    ["superreducidoA", 5],  
    ["superreducidoB", 4],  
    ["superreducidoC", 0],  
    ["sinIva", 0],    
  ] as const)("El iva %s es: %s", (tipo:TipoIva, resultadoEsperado:number) => {

    // Act
    const resultado = mapearTipoIva(tipo);

    // Assert
    expect(resultado).toBe(resultadoEsperado);
  });
})

  describe("calcularPrecioConIva", () => {
    it.each([
      [10,10,11],  
      [2,21,2.42], 
      [2,0,2], 
  
    ] as const)("Para un precio de %s con iva %s el valor es %s", (precio:number,iva:number, resultadoEsperado:number) => {
  
      // Act
      const resultado = calcularPrecioConIva(precio,iva);
  
      // Assert
      expect(resultado).toBe(resultadoEsperado);
    });

})