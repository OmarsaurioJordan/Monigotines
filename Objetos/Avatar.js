class Avatar extends Movil {

    constructor(id, nombre, genero, piel, emocion, pelo, tinte,
            torso, color, cadera, tela, rol, mensaje, descripcion,
            link, posicion) {
        super(posicion);
        this.id = id;
        this.nombre = nombre;
        this.genero = genero;
        this.piel = piel;
        this.emocion = emocion;
        this.pelo = pelo;
        this.tinte = tinte;
        this.torso = torso;
        this.color = color;
        this.cadera = cadera;
        this.tela = tela;
        this.rol = rol;
        this.mensaje = mensaje;
        this.descripcion = descripcion;
        this.link = link;
    }

    draw(ctx, sprites) {
        sprites.drawCuerpo(ctx, this.pis, this.piel,
            this.genero, -1, true);
        sprites.drawCabeza(ctx, this.pis, this.piel,
            this.genero, -1);
        sprites.drawEmocion(ctx, this.pis, this.emocion, -1);
    }
}
