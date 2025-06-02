class Mobiliario {

    static radio = 24; // para colisiones

    constructor(id, creador, tipo, posicion) {
        this.id = id;
        this.creador = creador;
        this.tipo = tipo;
        this.pos = posicion;
        this.pis = this.pos; // para dibujado, evita error en mundo.js
    }

    step(dlt, estado, usuario) {} // vacio, evita error en mundo.js

    drawSombra(ctx, sprites) {} // vacio, evita error en mundo.js

    draw(ctx, sprites, estado) {

    }
}
