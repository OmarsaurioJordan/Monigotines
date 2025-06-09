class Avatar {
    // parametros basicos
    static TIME_ANIMA = [1.73, 0.61, 0.85]; // pies, cabeza, tool
    static MENSAJE_W = 200; // anchura del texto
    static DESCRIPCION_W = 200; // anchura texto en GUI
    static RADIO = 16; // para colisiones
    static ALT_MSJ = 120; // altura a la que esta el nombre y mensaje
    // parametros de movimiento
    static VELOCIDAD = 100;
    static PROB_CONTI_MOVE = 0.7;
    static PROB_CONTI_QUIETO = 0.8;
    static MED_ARCO_CAMB_DIR = 0.4 * Math.PI;
    static RELOJ_ERRAR_MIN_SEG = 0.5;
    static RELOJ_ERRAR_MAX_SEG = 3;
    // parametros modo guerra
    static VIDA = 100;
    static VISION = 200; // radio de alcance visual
    static BLOQUEO_PORC = 0.1; // porcentaje de evadir ataque
    static BLOQUEO_ESCUDO_PORC = 2; // sera multiplicado al bloqueo base
    static DAMAGE = 4.5; // damage base, se le sumara 1 aleatorio
    static DAMAGE_ESPADA_EXT = 2; // extra aleatorio para la espada
    static GAIN_MAZO_PORC = 0.15; // porcentaje vida ganada al matar
    static CLS_NORMAL = 0;
    static CLS_ESPADA = 1;
    static CLS_ESCUDO = 2;
    static CLS_PALO = 3;
    static CLS_ARCO = 4;
    static CLS_MAZO = 5;
    static CLS_TAMBOR = 6;
    static CLS_BACULO = 7;
    static CLS_MEDICINA = 8;

    constructor(id, nombre, genero, piel, emocion, pelo, tinte,
            torso, color, cadera, tela, rol, clase, mensaje, descripcion,
            link, musica, isNew, posicion) {
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
        this.clase = clase;
        this.mensaje = "";
        this.setMensaje(mensaje);
        this.descripcion = "";
        this.setDescripcion(descripcion);
        this.link = link;
        this.musica = musica;
        // configuracion para funcionamiento
        this.pis = [...this.pos]; // para interpolacion
        this.relojErrar = Math.random() * (Avatar.RELOJ_ERRAR_MIN_SEG +
            Avatar.RELOJ_ERRAR_MAX_SEG);
        this.isMove = Math.random() < 0.5;
        this.moveDir = Math.random() * 2 * Math.PI;
        this.isWalk = false;
        // configuracion para modo guerra
        this.ideas = [(genero == 0 ? -1 : 1)]; // 0: genero
        for (let i = 0; i < 12; i++) {
            this.ideas.push(0);
        }
        this.vida = Avatar.VIDA;
        this.zodiaco = 0;
        this.elemento = 0;
        // configuracion para animaciones
        this.isNew = isNew; // true dibuja fantasma
        this.anima = []; // pies, cabeza, tool
        this.relojAnima = [];
        Avatar.TIME_ANIMA.forEach(e => {
            this.relojAnima.push(Math.random());
            this.anima.push(0);
        });
    }

    // set de atributos

    setMensaje(mensaje) {
        this.mensaje = Sprites.prepareTextMsj(mensaje,
            Avatar.MENSAJE_W, 10000, Sprites.getMsjFont(), 20, 40);
    }

    setDescripcion(descripcion) {
        this.descripcion = Sprites.prepareTextMsj(descripcion,
            Avatar.DESCRIPCION_W, 10000, Sprites.getMsjFont(), 20, 40);
    }

    actualizar(nombre, genero, piel, emocion, pelo, tinte, torso,
            color, cadera, tela, rol, clase, mensaje, descripcion,
            link, musica, isNew) {
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
        this.clase = clase;
        this.link = link;
        this.musica = musica;
        this.isNew = isNew;
        this.setMensaje(mensaje);
        this.setDescripcion(descripcion);
        // para guerra
        this.ideas[0] = genero == 0 ? -1 : 1;
    }

    setIdeas(zodiaco, elemento, ideologys) {
        this.zodiaco = zodiaco;
        this.elemento = elemento;
        for (let i = 0; i < ideologys.length; i++) {
            this.ideas[i + 1] = ideologys[i];
        }
    }

    getWarVivo(mundoIdea) {
        // true si no esta como fantasma
        return this.ideas[mundoIdea] != 0 && !this.isNew && this.vida > 0;
    }

    // loop de logica

    step(dlt, estado, usuario, mundoIdea) {
        this.stepAnima(dlt);
        this.stepRelojErrar(dlt);
        if (Math.random() < 0.5) {
            this.colisionar(dlt);
        }
        switch (estado) {
            case 0: // Mundo
                this.moverseDir(this.moveDir,
                    (this.isMove ? Avatar.VELOCIDAD * dlt : 0));
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
		    this.relojErrar = Avatar.RELOJ_ERRAR_MIN_SEG +
                Math.random() * Avatar.RELOJ_ERRAR_MAX_SEG;
			if (this.isMove) {
				this.isMove = Math.random() < Avatar.PROB_CONTI_MOVE;
				let arc = Avatar.MED_ARCO_CAMB_DIR;
				this.moveDir += -arc + Math.random() * 2 * arc;
			}
			else {
				this.isMove = Math.random() > Avatar.PROB_CONTI_QUIETO;
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
                        Avatar.RADIO + Mobiliario.radio)) {
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
                            Avatar.RADIO * 2)) {
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
			this.pos[0] += (coli[0] / mag) * Avatar.VELOCIDAD * 2 * dlt;
			this.pos[1] += (coli[1] / mag) * Avatar.VELOCIDAD * 2 * dlt;
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
        this.pos[0] = Math.max(Avatar.MENSAJE_W * 0.7,
            Math.min(this.pos[0], worldW - Avatar.MENSAJE_W * 0.7));
        this.pos[1] = Math.max(250,
            Math.min(this.pos[1], worldH - 16));
        if (this.pos[0] != ant[0] || this.pos[1] != ant[1]) {
            this.moveDir = Math.random() * 2 * Math.PI;
        }
    }

    interpola(dlt) {
        if (pointDistance(this.pos, this.pis) > 30) {
            this.pis[0] = this.pos[0];
            this.pis[1] = this.pos[1];
            this.isWalk = false;
            return null;
        }
        let dif = [
            this.pos[0] - this.pis[0],
            this.pos[1] - this.pis[1]
        ];
        this.pis[0] += dif[0] * dlt * 6;
        this.pis[1] += dif[1] * dlt * 6;
        this.isWalk = Math.pow(dif[0], 2) + Math.pow(dif[1], 2) > 10;
    }

    getDamage() {
        let dmg = Avatar.DAMAGE + Math.random();
        if (Avatar.CLS_ESPADA) {
            dmg += Math.random() * Avatar.DAMAGE_ESPADA_EXT;
        }
        return dmg;
    }

    doDamage(quien) {
        let dmg = this.getDamage();
        let res = quien.receiveDamage(dmg);
        if (res && this.clase == Avatar.CLS_MAZO) {
            this.vida = Math.min(Avatar.VIDA,
                this.vida + Avatar.VIDA * Avatar.GAIN_MAZO_PORC);
        }
        return res;
    }

    getBloqueo() {
        let blq = Avatar.BLOQUEO_PORC;
        if (this.clase == Avatar.CLS_ESCUDO) {
            blq *= Avatar.BLOQUEO_ESCUDO_PORC;
        }
        return blq;
    }

    receiveDamage(damage) {
        if (this.vida > 0) {
            let blq = this.getBloqueo();
            if (Math.random() < blq) {
                return false;
            }
            this.vida = Math.max(0, this.vida - damage);
            return this.vida == 0;
        }
        return false;
    }

    // animaciones

    stepAnima(dlt) {
        for (let i = 0; i < this.relojAnima.length; i++) {
            this.relojAnima[i] += dlt * Avatar.TIME_ANIMA[i];
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

    drawFantasma(ctx, sprites, conNombre) {
        sprites.drawFantasma(ctx, this.pis, this.relojAnima[0]);
        if (conNombre) {
            let posMsj = [this.pis[0], this.pis[1] - Avatar.ALT_MSJ];
            Sprites.drawMensaje(
                ctx, this.nombre, posMsj,
                Sprites.getMsjFont(true), 18, 3);
        }
    }

    drawAvatar(ctx, sprites, isWalk, isClase=false) {
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
        if (isClase) {
            sprites.drawClase(ctx, this.pis, this.clase, this.anima[2]);
        }
        else {
            sprites.drawRol(ctx, this.pis, this.rol, this.anima[2]);
        }
    }

    drawWar(ctx, sprites, isWalk, mundoIdea) {
        if (!this.getWarVivo(mundoIdea)) {
            this.drawFantasma(ctx, sprites, false);
        }
        else {
            let wlk = isWalk ? this.relojAnima[0] : -1;
            sprites.drawCuerpo(ctx, this.pis, this.piel,
                this.genero, wlk, false);
            sprites.drawIdea(ctx, this.pis, this.genero,
                mundoIdea, this.ideas[mundoIdea]);
            let ani = this.anima[1];
            sprites.drawCabeza(ctx, this.pis, this.piel,
                this.genero, ani);
            sprites.drawEmocion(ctx, this.pis, this.emocion, ani);
            sprites.drawPelo(ctx, this.pis, this.genero, this.pelo,
                this.tinte, ani);
            sprites.drawClase(ctx, this.pis, this.clase, this.anima[2]);
        }
    }

    drawMensaje(ctx, conNombre, texto="") {
        let posMsj = [this.pis[0], this.pis[1] - Avatar.ALT_MSJ];
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
        // debug para ver donde esta el punto real
        //ctx.fillRect(this.pos[0] - 2, this.pos[1] - 2, 4, 4);
    }

    draw(ctx, sprites, estado, mundoIdea) {
        switch (estado) {
            case 0: // Mundo
            case 1: // Explore
                if (this.isNew) {
                    this.drawFantasma(ctx, sprites, true);
                }
                else {
                    this.drawAvatar(ctx, sprites, this.isWalk);
                    this.drawMensaje(ctx, true, this.mensaje);
                }
                break;
            case 2: // Guerra
                this.drawWar(ctx, sprites, this.isWalk, mundoIdea);
                this.drawMensaje(ctx, true, "");
                break;
            case 3: // Social

                break;
        }
    }
}
