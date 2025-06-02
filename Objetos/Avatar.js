class Avatar {
    
    static timeAnima = [1.73, 0.61, 0.85]; // pies, cabeza, tool
    static mensajeW = 200; // anchura del texto
    static radio = 16; // para colisiones
    // parametros de movimiento
    static velocidad = 100;
    static probContinuarMove = 0.7;
    static probContinuarQuieto = 0.8;
    static medArcoCambioDir = 0.4 * Math.PI;
    static relojErrarMinSeg = 0.5;
    static relojErrarMaxSeg = 3;

    constructor(id, nombre, genero, piel, emocion, pelo, tinte,
            torso, color, cadera, tela, rol, mensaje, descripcion,
            link, posicion) {
        // configuracion del avatar como tal
        this.id = id;
        this.pos = posicion;
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
        this.mensaje = "";
        this.setMensaje(mensaje);
        this.descripcion = descripcion;
        this.link = link;
        // configuracion para funcionamiento
        this.pis = [...this.pos]; // interpolacion
        this.relojErrar = Math.random() * (Avatar.relojErrarMinSeg +
            Avatar.relojErrarMaxSeg);
        this.isMove = Math.random() < 0.5;
        this.moveDir = Math.random() * 2 * Math.PI;
        this.isWalk = false;
        // configuracion para animaciones
        this.anima = []; // pies, cabeza, tool
        this.relojAnima = [];
        Avatar.timeAnima.forEach(e => {
            this.relojAnima.push(Math.random());
            this.anima.push(0);
        });
    }

    // set de atributos

    setMensaje(mensaje) {
        this.mensaje = Sprites.prepareTextMsj(mensaje,
            Avatar.mensajeW, 1000, Sprites.getMsjFont(), 20, 40);
    }

    actualizar(nombre, genero, piel, emocion, pelo, tinte, torso,
            color, cadera, tela, rol, mensaje, descripcion, link) {
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
        this.descripcion = descripcion;
        this.link = link;
        this.setMensaje(mensaje);
    }

    // loop de logica

    step(dlt, estado, usuario) {
        this.stepAnima(dlt);
        this.stepRelojErrar(dlt);
        if (Math.random() < 0.5) {
            this.colisionar(dlt);
        }
        switch (estado) {
            case 0: // Mundo
                this.moverseDir(this.moveDir,
                    (this.isMove ? Avatar.velocidad * dlt : 0));
                break;
            case 1: // Explore

                break;
            case 2: // Guerra

                break;
            case 3: // Social

                break;
        }
        this.limites();
        this.interpola(dlt);
    }

    stepRelojErrar(dlt) {
        // reloj para cambio de movimiento
		this.relojErrar -= dlt;
		if (this.relojErrar <= 0) {
		    this.relojErrar = Avatar.relojErrarMinSeg +
                Math.random() * Avatar.relojErrarMaxSeg;
			if (this.isMove) {
				this.isMove = Math.random() < Avatar.probContinuarMove;
				let arc = Avatar.medArcoCambioDir;
				this.moveDir += -arc + Math.random() * 2 * arc;
			}
			else {
				this.isMove = Math.random() > Avatar.probContinuarQuieto;
				this.moveDir = Math.random() * 2 * Math.PI;
			}
		}
    }

    colisionar(dlt) {
        let coli = [0, 0];
        // hallar colision con mobiliarios
        for (let i = 0; i < objetos.length; i++) {
            if (!(objetos[i] instanceof Avatar)) {
                if (pointInCircle(this.pos, objetos[i].pos,
                        Avatar.radio + Mobiliario.radio)) {
                    coli[0] += this.pos[0] - objetos[i].pos[0];
                    coli[1] += this.pos[1] - objetos[i].pos[1];
                }
            }
        }
        // hallar colision con avatares
        if (coli[0] == 0 && coli[1] == 0) {
            for (let i = 0; i < objetos.length; i++) {
                if (objetos[i] instanceof Avatar) {
                    if (objetos[i].id == this.id) {
                        continue;
                    }
                    if (pointInCircle(this.pos, objetos[i].pos,
                            Avatar.radio * 2)) {
                        coli[0] += this.pos[0] - objetos[i].pos[0];
                        coli[1] += this.pos[1] - objetos[i].pos[1];
                    }
                }
            }
        }
		// ejecutar movimiento de colision
		if (coli[0] != 0 || coli[1] != 0) {
			let mag = Math.sqrt(
                Math.pow(coli[0], 2) + Math.pow(coli[1], 2)
            );
			this.pos[0] += (coli[0] / mag) * Avatar.velocidad * 2 * dlt;
			this.pos[1] += (coli[1] / mag) * Avatar.velocidad * 2 * dlt;
		}
    }

    moverseDir(direccion, velocidad) {
        if (velocidad != 0) {
			this.pos[0] += velocidad * Math.cos(direccion);
            this.pos[1] += velocidad * Math.sin(direccion);
		}
    }

    limites() {
        let ant = [...this.pos];
        this.pos[0] = Math.max(Avatar.mensajeW * 0.7,
            Math.min(this.pos[0], worldW - Avatar.mensajeW * 0.7));
        this.pos[1] = Math.max(250,
            Math.min(this.pos[1], worldH - 16));
        if (this.pos[0] != ant[0] || this.pos[1] != ant[1]) {
            this.moveDir = Math.random() * 2 * Math.PI;
        }
    }

    interpola(dlt) {
        let dif = [
            this.pos[0] - this.pis[0],
            this.pos[1] - this.pis[1]
        ];
        this.pis[0] += dif[0] * dlt * 2;
        this.pis[1] += dif[1] * dlt * 2;
        this.isWalk = Math.pow(dif[0], 2) + Math.pow(dif[1], 2) > 10;
    }

    // animaciones

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

    // dibujado

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

    drawMensaje(ctx, conNombre, texto="") {
        let posMsj = [this.pis[0], this.pis[1] - 120];
        if (conNombre) {
            Sprites.drawMensaje(
                ctx, this.nombre, posMsj,
                Sprites.getMsjFont(true), 18, 3);
            posMsj[1] -= 26;
        }
        if (texto != "") {
            Sprites.drawMensaje(
                ctx, texto, posMsj, Sprites.getMsjFont(), 20, 5);
        }
    }

    drawSombra(ctx, sprites) {
        sprites.drawSombra(ctx, this.pis);
    }

    draw(ctx, sprites, estado) {
        this.drawAvatar(ctx, sprites, this.isWalk);
        this.drawMensaje(ctx, true, this.mensaje);
    }
}
