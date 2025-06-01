class Avatar extends Movil {
    static timeAnima = [1.2, 0.6, 0.85]; // pies, cabeza, tool

    constructor(id, nombre, genero, piel, emocion, pelo, tinte,
            torso, color, cadera, tela, rol, mensaje, descripcion,
            link, posicion) {
        // configuracion del avatar como tal
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
        this.mensaje = ""; this.setMensaje(mensaje);
        this.descripcion = descripcion;
        this.link = link;
        // configuracion para animaciones
        this.anima = []; // pies, cabeza, tool
        this.relojAnima = [];
        Avatar.timeAnima.forEach(e => {
            this.relojAnima.push(Math.random());
            this.anima.push(0);
        });
    }

    setMensaje(mensaje) {
        this.mensaje = Sprites.prepareTextMsj(mensaje,
            200, 1000, Sprites.getMsjFont(), 20, 40);
    }

    stepAnima(dlt) {
        for (let i = 0; i < this.relojAnima.length; i++) {
            this.relojAnima[i] += dlt * Avatar.timeAnima[i];
            while (this.relojAnima[i] > 1) {
                this.relojAnima[i] -= 1;
            }
            if (this.relojAnima[i] < 0.5) {
                this.anima[i] = this.relojAnima[i] * 2;
            }
            else {
                this.anima[i] = 2 * (1 - this.relojAnima[i]);
            }
        }
    }

    drawAvatar(ctx, sprites, isWalk) {
        let wlk = isWalk ? this.relojAnima[0] : -1;
        sprites.drawCuerpo(ctx, this.pis, this.piel,
            this.genero, wlk, this.cadera == 0);
        sprites.drawCadera(ctx, this.pis, this.genero,
            this.cadera, this.tela);
        sprites.drawTorso(ctx, this.pis, this.genero,
            this.torso, this.color);
        let ani = this.anima[1];
        sprites.drawCabeza(ctx, this.pis, this.piel,
            this.genero, ani);
        sprites.drawEmocion(ctx, this.pis, this.emocion, ani);
        sprites.drawPelo(ctx, this.pis, this.genero, this.pelo,
            this.tinte, ani);
        sprites.drawRol(ctx, this.pis, this.rol, this.anima[2]);
    }

    drawMensaje(ctx) {
        let posMsj = [this.pis[0], this.pis[1] - 130];
        Sprites.drawMensaje(
            ctx, this.mensaje, posMsj,
            Sprites.getMsjFont(), 20, 5
        );
    }

    draw(ctx, sprites) {
        this.drawAvatar(ctx, sprites, true);
    }
}
