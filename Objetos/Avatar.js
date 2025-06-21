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
    static RELOJ_PATH = 9;
    // parametros modo guerra
    static VIDA = 100;
    static VISION = 400; // radio de alcance visual
    static RAD_ATACK_MIN = 100; // distancia de ataque minima
    static BLOQUEO_PORC = 0.1; // porcentaje de evadir ataque
    static BLOQUEO_ESCUDO_PORC = 2; // sera multiplicado al bloqueo base
    static DAMAGE = 4.5; // damage base, se le sumara 1 aleatorio
    static DAMAGE_ESPADA_EXT = 2; // extra aleatorio para la espada
    static GAIN_MAZO_PORC = 0.15; // porcentaje vida ganada al matar
    static RELOJ_EST_ERRAR = 5; // tiempo minimo en modo errar
    static RELOJ_EST_EXPLORA = 60; // tiempo maximo en modo explora
    static RELOJ_EST_ALIADO = 20; // tiempo minimo en modo seguir aliado
    static RELOJ_DAMAGE = 3; // tiempo para golpear
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
        this.pis = {...this.pos}; // posicion para interpolacion
        this.relojErrar = Math.random() * (Avatar.RELOJ_ERRAR_MIN_SEG +
            Avatar.RELOJ_ERRAR_MAX_SEG); // cambio de dir y move
        this.isMove = Math.random() < 0.5; // movimiento errando
        this.moveDir = Math.random() * 2 * Math.PI; // dir errando
        this.isWalk = false; // para saber si debe animar pies
        this.path = null; // camino corto para recorrer
        this.relojPath = 0; // temporizador limite de path
        this.meta = {x:0, y:0}; // a donde desea ir con path
        this.relojBusqueda = 0; // para ver enemigos
        this.dirTambaleo = 0; // oscilacion aleatoria al moverse
        // configuracion para modo guerra
        this.ideas = [(genero == 0 ? -1 : 1)]; // 0: genero
        for (let i = 0; i < 12; i++) {
            this.ideas.push(0);
        }
        this.vida = Avatar.VIDA;
        this.zodiaco = 0;
        this.elemento = 0;
        this.subEstado = 0; // sub estado para modo guerra
        this.relojSubEst = 1; // duracion temporizada de subestados
        this.objetivo = null; // avatar para seguir
        this.ultimoVisto = {x:0, y:0}; // ultima vez visto objetivo
        this.relojDamage = 5; // para golpear
        // configuracion para animaciones
        this.relojHit = 0; // para mostrar cara golpeada
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

    restart() {
        this.vida = Avatar.VIDA;
        this.pos = {
            x: worldW * Math.random(),
            y: worldH * Math.random()
        }
        this.pis = {...this.pos};
        this.subEstado = 0;
        this.relojSubEst = 1;
        this.relojDamage = 5;
    }

    setIdeas(zodiaco, elemento, ideologys) {
        this.zodiaco = zodiaco;
        this.elemento = elemento;
        for (let i = 0; i < ideologys.length; i++) {
            this.ideas[i + 1] = ideologys[i];
        }
    }

    getWarVivo() {
        // true si no esta como fantasma
        return this.ideas[mundoIdea] != 0 && !this.isNew && this.vida > 0;
    }

    // loop de logica

    step(dlt, estado) {
        this.stepAnima(dlt);
        this.stepRelojErrar(dlt);
        if (Math.random() < 0.5) {
            this.colisionar(dlt);
        }
        switch (estado) {
            case 0: // Mundo
                this.pos = moveAngVel(this.pos, this.moveDir,
                    (this.isMove ? Avatar.VELOCIDAD * dlt : 0));
                break;
            case 1: // Explore

                break;
            case 2: // Guerra
                //this.nombreToDebug();
                this.relojHit = Math.max(0, this.relojHit - dlt);
                if (!this.getWarVivo()) {
                    break;
                }
                this.lucha(dlt);
                this.stepDamage(dlt);
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
            let arc = Avatar.MED_ARCO_CAMB_DIR;
            this.dirTambaleo = -arc + Math.random() * 2 * arc;
			if (this.isMove) {
				this.isMove = Math.random() < Avatar.PROB_CONTI_MOVE;
				this.moveDir += this.dirTambaleo;
			}
			else {
				this.isMove = Math.random() > Avatar.PROB_CONTI_QUIETO;
				this.moveDir = Math.random() * 2 * Math.PI;
			}
		}
    }

    colisionar(dlt) {
        let coli = {x: 0, y: 0};
        // hallar colision con mobiliarios
        for (let i = 0; i < objetos.length; i++) {
            if (objetos[i] instanceof Avatar) {
                continue;
            }
            if (pointInCircle(this.pos, objetos[i].pos,
                    Avatar.RADIO + Mobiliario.radio)) {
                coli.x += this.pos.x - objetos[i].pos.x;
                coli.y += this.pos.y - objetos[i].pos.y;
            }
        }
        // hallar colision con avatares
        if (coli.x == 0 && coli.y == 0) {
            for (let i = 0; i < objetos.length; i++) {
                if (objetos[i] instanceof Avatar) {
                    if (objetos[i] == this) {
                        continue;
                    }
                    if (pointInCircle(this.pos, objetos[i].pos,
                            Avatar.RADIO * 2)) {
                        coli.x += this.pos.x - objetos[i].pos.x;
                        coli.y += this.pos.y - objetos[i].pos.y;
                    }
                }
            }
        }
		// ejecutar movimiento de colision
		if (coli.x != 0 || coli.y != 0) {
			let mag = Math.sqrt(
                Math.pow(coli.x, 2) + Math.pow(coli.y, 2)
            );
			this.pos.x += (coli.x / mag) * Avatar.VELOCIDAD * 2 * dlt;
			this.pos.y += (coli.y / mag) * Avatar.VELOCIDAD * 2 * dlt;
		}
    }

    coliLinea(ini, fin, wihtSolid) {
        let utr = wihtSolid ? Mobiliario : Avatar;
        for (let i = 0; i < objetos.length; i++) {
            if (!(objetos[i] instanceof utr) || objetos[i] == this) {
                continue;
            }
            if (circleInLine(objetos[i].pos, ini, fin, utr.RADIO)) {
                return true;
            }
        }
        return false;
    }

    limites() {
        let ant = {...this.pos};
        this.pos.x = Math.max(Avatar.MENSAJE_W * 0.7,
            Math.min(this.pos.x, worldW - Avatar.MENSAJE_W * 0.7));
        this.pos.y = Math.max(250,
            Math.min(this.pos.y, worldH - 16));
        if (this.pos.x != ant.x || this.pos.y != ant.y) {
            this.moveDir = Math.random() * 2 * Math.PI;
        }
    }

    interpola(dlt) {
        if (pointDistance(this.pos, this.pis) > 30) {
            this.pis.x = this.pos.x;
            this.pis.y = this.pos.y;
            this.isWalk = false;
            return null;
        }
        let dif = {
            x: this.pos.x - this.pis.x,
            y: this.pos.y - this.pis.y
        };
        this.pis.x += dif.x * dlt * 6;
        this.pis.y += dif.y * dlt * 6;
        this.isWalk = Math.pow(dif.x, 2) + Math.pow(dif.y, 2) > 10;
    }

    // cosas de ataque y defensa

    getDamage() {
        let dmg = Avatar.DAMAGE + Math.random();
        if (this.clase == Avatar.CLS_ESPADA) {
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
            this.relojHit = 0.333;
            return this.vida == 0;
        }
        return false;
    }

    stepDamage(dlt) {
        this.relojDamage -= dlt;
        if (this.relojDamage <= 0) {
            this.relojDamage += Avatar.RELOJ_DAMAGE + Math.random();
            if (this.subEstado == 3 && this.objetivo !== null) {
                if (this.isObjetivoOk(this.objetivo, false) &&
                        this.isObjetivoEnlinea(this.objetivo)) {
                    this.doDamage(this.objetivo);
                }
            }
        }
    }

    // movimientos de lucha

    nombreToDebug() {
        if (this.getWarVivo()) {
            switch (this.subEstado) {
                case 0:
                    this.nombre = "errar";
                    break;
                case 1:
                    this.nombre = "explorar";
                    break;
                case 2:
                    this.nombre = "seguir";
                    break;
                case 3:
                    this.nombre = "luchar";
                    break;
            }
        }
        else {
            this.nombre = "...";
        }
    }

    lucha(dlt) {
        // buscar enemigos activamente
        this.relojBusqueda -= dlt;
        if (this.relojBusqueda <= 0) {
            this.relojBusqueda += 1 + Math.random();
            if ((this.objetivo === null || this.subEstado != 3) ||
                    Math.random() < 0.01) {
                if (this.buscaAvatar(false, false)) {
                    this.subEstado = 3; // enemigo
                    this.relojSubEst = Avatar.RELOJ_EST_EXPLORA;
                    // hacer que el otro tambien pelee
                    if (this.objetivo.objetivo === null ||
                            this.objetivo.subEstado != 3) {
                        this.objetivo.objetivo = this;
                        this.objetivo.subEstado = this.subEstado;
                        this.objetivo.relojSubEst = this.relojSubEst;
                    }
                }
            }
        }
        // disminuir contador para evitar clavarse en un estado
        this.relojSubEst -= dlt;
        if (this.relojSubEst <= 0) {
            this.luchaEstadoAzar();
        }
        // depurar segun estado
        switch (this.subEstado) {
            case 0: // errar
                this.pos = moveAngVel(this.pos, this.moveDir,
                    (this.isMove ? Avatar.VELOCIDAD * dlt : 0));
                break;
            case 1: // explorar
                if (this.camino(dlt, this.meta)) {
                    this.luchaEstadoAzar();
                }
                break;
            case 2: // aliado
                // actualizar donde lo ha visto
                if (Math.random() < 0.1) {
                    if (!this.isObjetivoOk(this.objetivo, true)) {
                        this.luchaEstadoAzar();
                        break;
                    }
                }
                let disa = pointDistance(this.pos, this.objetivo.pos);
                if (disa > Avatar.RAD_ATACK_MIN) {
                    this.camino(dlt, this.objetivo.pos);
                    this.moveDir = Math.random() * 2 * Math.PI;
                }
                else {
                    this.pos = moveAngVel(this.pos, this.moveDir,
                        (this.isMove ? Avatar.VELOCIDAD * dlt : 0));
                }
                break;
            case 3: // enemigo
                if (this.objetivo === null) {
                    // cuando lo pierde de vista y le sigue el rastro
                    this.pos = moveDirVel(this.pos,
                        pointDirection(this.pos, this.ultimoVisto),
                        Avatar.VELOCIDAD * dlt);
                    if (pointDistance(this.pos, this.ultimoVisto) <
                            Avatar.RADIO) {
                        this.luchaEstadoAzar();
                    }
                }
                else {
                    // actualizar donde lo ha visto
                    if (Math.random() < 0.1) {
                        if (!this.isObjetivoOk(this.objetivo, false)) {
                            this.luchaEstadoAzar();
                            break;
                        }
                        else if (this.isObjetivoEnlinea(this.objetivo)) {
                            this.ultimoVisto = {...this.objetivo.pos};
                            this.relojSubEst = Avatar.RELOJ_EST_EXPLORA;
                        }
                        else {
                            this.objetivo = null;
                            break;
                        }
                    }
                    // ir hacia donde lo ha visto
                    let dist = pointDistance(this.pos, this.ultimoVisto);
                    if (dist < Avatar.RAD_ATACK_MIN) {
                        // alejarse
                        this.pos = moveAngVel(this.pos,
                            pointAngle(this.ultimoVisto, this.pos) +
                            this.dirTambaleo, Avatar.VELOCIDAD * dlt);
                        this.moveDir = Math.random() * 2 * Math.PI;
                    }
                    else if (dist > Avatar.RAD_ATACK_MIN * 2) {
                        // acercarce
                        this.pos = moveAngVel(this.pos,
                            pointAngle(this.pos, this.ultimoVisto) +
                            this.dirTambaleo, Avatar.VELOCIDAD * dlt);
                        this.moveDir = Math.random() * 2 * Math.PI;
                    }
                    else {
                        // errar
                        this.pos = moveAngVel(this.pos, this.moveDir,
                            Avatar.VELOCIDAD * dlt);
                    }
                }
                break;
        }
    }

    luchaEstadoAzar() {
        let r = Math.random();
        if (r < 0.3) {
            this.subEstado = 0; // errar 30%
        }
        else if (r < 0.8) {
            this.subEstado = 2; // aliado 50%
        }
        else {
            this.subEstado = 1; // explora 20%
        }
        switch (this.subEstado) {
            case 0: // errar
                this.relojSubEst = Avatar.RELOJ_EST_ERRAR +
                    Math.random() * Avatar.RELOJ_EST_ERRAR;
                break;
            case 1: // explora
                this.relojSubEst = Avatar.RELOJ_EST_EXPLORA;
                this.meta = this.puntoMundoAzar();
                break;
            case 2: // aliado
                this.relojSubEst = Avatar.RELOJ_EST_ALIADO +
                    Math.random() * Avatar.RELOJ_EST_ALIADO;
                if (!this.buscaAvatar(true, true)) {
                    this.luchaEstadoAzar();
                }
                else if (this.objetivo.subEstado == 2 &&
                        this.objetivo.objetivo == this) {
                    this.subEstado = 1;
                    this.relojSubEst = Avatar.RELOJ_EST_EXPLORA;
                    this.meta = this.puntoMundoAzar();
                }
                break;
        }
    }

    puntoMundoAzar() {
        let res = {x: 0, y: 0};
        while (res.x == 0 && res.y == 0) {
            res = {
                x: worldW * Math.random(),
                y: worldH * Math.random()
            };
            res.x = Math.max(Avatar.MENSAJE_W * 0.7,
                Math.min(res.x, worldW - Avatar.MENSAJE_W * 0.7));
            res.y = Math.max(250,
                Math.min(res.y, worldH - 16));
            for (let i = 0; i < objetos.length; i++) {
                if (objetos[i] instanceof Avatar) {
                    continue;
                }
                if (pointInCircle(res, objetos[i].pos,
                        Mobiliario.radio)) {
                    res = {x: 0, y: 0};
                    break;
                }
            }
        }
        return res;
    }

    isObjetivoOk(obj, isAliado) {
        if (!obj.getWarVivo()) {
            return false;
        }
        let ok = this.ideas[mundoIdea] == obj.ideas[mundoIdea];
        if ((ok && isAliado) || (!ok && !isAliado)) {
            return true;
        }
        return false;
    }

    isObjetivoEnlinea(obj) {
        if (pointDistance(this.pos, obj.pos) <= Avatar.VISION) {
            return !this.coliLinea(this.pos, obj.pos, true);
        }
        return false;
    }

    buscaAvatar(isAliado, isExtBusq) {
        let obj = this.buscaAvatarId(isAliado, isExtBusq);
        if (obj === null) {
            return false;
        }
        this.objetivo = obj;
        if (isExtBusq) {
            this.ultimoVisto = {x: 0, y: 0};
        }
        else {
            this.ultimoVisto = {...obj.pos};
        }
        return true;
    }

    buscaAvatarId(isAliado, isExtBusq) {
        // asigna el avatar allado a las variables y devuelve true
        let ok = false;
        let dist = 0;
        let candis = []; // [avatar, distancia]
        for (let i = 0; i < objetos.length; i++) {
            if (objetos[i] instanceof Avatar && objetos[i] != this) {
                if (!objetos[i].getWarVivo()) {
                    continue;
                }
                ok = this.ideas[mundoIdea] == objetos[i].ideas[mundoIdea];
                if ((ok && isAliado) || (!ok && !isAliado)) {
                    // candidato potencial
                    dist = pointDistance(this.pos, objetos[i].pos);
                    if (isExtBusq) {
                        if (dist <= Avatar.VISION * 3) {
                            candis.push([objetos[i], dist]);
                        }
                    }
                    else if (dist <= Avatar.VISION) {
                        if (!this.coliLinea(this.pos, objetos[i].pos, true)) {
                            candis.push([objetos[i], dist]);
                        }
                    }
                }
            }
        }
        if (candis.length != 0) {
            candis.sort((a, b) => a[1] - b[1]);
            return candis[0][0];
        }
        return null;
    }

    // movimientos autonomos

    camino(dlt, fin) {
        if (pointDistance(this.pos, fin) < Avatar.RADIO) {
            return true;
        }
        if (this.path === null) {
            this.path = this.rutaAzar(this.pos, fin);
            this.relojPath = Avatar.RELOJ_PATH;
        }
        this.relojPath -= dlt;
        if (this.relojPath <= 0) {
            this.path = null;
            return false;
        }
        this.pos = moveDirVel(this.pos, pointDirection(this.pos, this.path[0]),
            Avatar.VELOCIDAD * dlt);
        if (pointDistance(this.pos, this.path[0]) < Avatar.RADIO) {
            this.path.shift();
            if (this.path.length == 0) {
                this.path = null;
            }
        }
        return false;
    }

    rutaAzar(ini, fin, intentos=2) {
        if (this.coliLinea(ini, fin, true)) {
            let opc = [];
            for (let i = 0; i < intentos; i++) {
                let rut = this.ruticaAzar(ini);
                opc.push([
                    rut,
                    pointDistance(fin, rut[rut.length - 1])
                ]);
            }
            opc.sort((a, b) => a[1] - b[1]);
            return opc[0][0];
        }
        return [{...fin}];
    }

    ruticaAzar(ini, tramos=3) {
        let ant = ini;
        let res = [];
        let pnt = {x: 0, y: 0};
        do {
            let f = 0;
            do {
                pnt = moveAngVel(ant, Math.random() * 2 * Math.PI,
                    Math.random() * Avatar.VISION / 2);
                f++;
            }
            while (this.coliLinea(ant, pnt, true) && f < 255);
            if (f >= 255) {
                pnt = {...ant};
            }
            res.push(pnt);
            ant = pnt;
        }
        while (res.length < tramos);
        return res;
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
            let posMsj = {x: this.pis.x, y: this.pis.y - Avatar.ALT_MSJ};
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

    drawWar(ctx, sprites, isWalk) {
        if (!this.getWarVivo()) {
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
            sprites.drawEmocion(ctx, this.pis, this.emocion, ani,
                this.relojHit != 0);
            sprites.drawPelo(ctx, this.pis, this.genero, this.pelo,
                this.tinte, ani);
            sprites.drawClase(ctx, this.pis, this.clase, this.anima[2]);
        }
    }

    drawMensaje(ctx, conNombre, texto="") {
        let posMsj = {x: this.pis.x, y: this.pis.y - Avatar.ALT_MSJ};
        if (conNombre) {
            Sprites.drawMensaje(
                ctx, this.nombre, posMsj,
                Sprites.getMsjFont(true), 18, 3);
            posMsj.y -= 26;
        }
        if (texto != "") {
            Sprites.drawMensaje(
                ctx, texto, posMsj, Sprites.getMsjFont(), 20, 5);
        }
    }

    drawSombra(ctx, sprites) {
        sprites.drawSombra(ctx, this.pis);
        // debug para ver donde esta el punto real
        //ctx.fillRect(this.pos.x - 2, this.pos.y - 2, 4, 4);
    }

    draw(ctx, sprites, estado) {
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
