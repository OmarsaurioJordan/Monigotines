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

    drawAvatar(ctx, sprites) {
        sprites.drawCuerpo(ctx, this.pis, this.piel,
            this.genero, -1, this.cadera == 0);
        sprites.drawCadera(ctx, this.pis, this.genero,
            this.cadera, this.tela);
        sprites.drawTorso(ctx, this.pis, this.genero,
            this.torso, this.color);
        sprites.drawCabeza(ctx, this.pis, this.piel,
            this.genero, -1);
        sprites.drawEmocion(ctx, this.pis, this.emocion, -1);
        sprites.drawPelo(ctx, this.pis, this.genero, this.pelo,
            this.tinte, -1);
        sprites.drawRol(ctx, this.pis, this.rol, -1);
    }
}
