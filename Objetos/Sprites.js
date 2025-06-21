class Sprites {

    constructor() {
        this.osciCabeza = 5;
        // inicializa el cargado de imagenes
        this.cargas = 0;
        // cargar imagenes sin color
        this.sprite = [
            this.loadImg("d_monigotin1"), // 0
            this.loadImg("d_monigotin2"), // 1
            this.loadImg("d_monigotin3"), // 2
            this.loadImg("d_monigotin4"), // 3
            this.loadImg("d_monigotin5"), // 4
            this.loadImg("d_monigotin_emo"), // 5
            this.loadImg("d_monigotin_select"), // 6
            this.loadImg("d_monigotin_scroll"), // 7
            this.loadImg("d_suelo"), // 8
            this.loadImg("d_monigotin_rol"), // 9
            this.loadImg("d_monigotin_sombra"), // 10
            this.loadImg("d_monigotin_aro"), // 11
            this.loadImg("d_monigotin_fanta"), // 12
            this.loadImg("d_monigotin_idea1"), // 13
            this.loadImg("d_monigotin_idea2"), // 14
            this.loadImg("d_monigotin_clase"), // 15
            this.loadImg("d_monigotin_hit") // 16
        ];
        // cargar imagenes con color
        this.colorPelo = [
            "rgb(60, 60, 60)",
            "rgb(130, 100, 70)",
            "rgb(180, 140, 60)",
            "rgb(170, 160, 70)",
            "rgb(230, 220, 120)",
            "rgb(200, 200, 200)",
            "rgb(190, 90, 50)",
            "rgb(230, 140, 80)",
            "rgb(220, 120, 230)",
            "rgb(100, 200, 80)",
            "rgb(30, 190, 240)",
            "rgb(110, 130, 210)"
        ];
        this.colorRopa = [
            "rgb(50, 50, 50)",
            "rgb(120, 120, 120)",
            "rgb(210, 210, 210)",
            "rgb(220, 70, 50)",
            "rgb(240, 140, 70)",
            "rgb(220, 230, 50)",
            "rgb(110, 210, 40)",
            "rgb(60, 210, 220)",
            "rgb(90, 130, 220)",
            "rgb(200, 80, 230)",
            "rgb(140, 110, 90)",
            "rgb(180, 140, 40)"
        ];
        this.colorPiel = [
            "rgb(255, 210, 200)",
            "rgb(255, 190, 190)",
            "rgb(240, 170, 140)",
            "rgb(210, 140, 110)",
            "rgb(190, 130, 80)"
        ];
        this.dataImgCol = [
            // el ind 2 es donde inician esas imagenes en sprite[]
            ["d_monigotin_pelof", this.colorPelo, -1], // 0
            ["d_monigotin_pelom", this.colorPelo, -1], // 1
            ["d_monigotin_caderasf", this.colorRopa, -1], // 2
            ["d_monigotin_caderasm", this.colorRopa, -1], // 3
            ["d_monigotin_torsof", this.colorRopa, -1], // 4
            ["d_monigotin_torsom", this.colorRopa, -1], // 5
            ["d_monigotin_color", this.colorPelo, -1], // 6
            ["d_monigotin_color", this.colorRopa, -1], // 7
            ["d_monigotin_color", this.colorPiel, -1] // 8
        ];
        for (let i = 0; i < this.dataImgCol.length; i++) {
            this.dataImgCol[i][2] = this.sprite.length;
            for (let c = 0; c < this.dataImgCol[i][1].length; c++) {
                this.loadImgCol(
                    this.dataImgCol[i][0],
                    this.dataImgCol[i][1][c]
                );
            }
        }
    }

    loadImg(filename) {
        let img = new Image();
        img.src = "../Sprites/" + filename + ".png";
        img.onload = () => {
            this.cargas += 1;
        };
        return img;
    }

    loadImgCol(filename, color) {
        this.sprite.push(null);
        let indSpr = this.sprite.length - 1;
        let img = new Image();
        img.src = "../Sprites/" + filename + ".png";
        img.onload = () => {
            let imgc = this.pintaImagen(img, color);
            imgc.onload = () => {
                this.sprite[indSpr] = imgc;
                this.cargas += 1;
            };
        };
    }

    pintaImagen(imgOrigen, color) {
        let cnvs = document.createElement('canvas');
        cnvs.width = imgOrigen.width;
        cnvs.height = imgOrigen.height;
        let ctxx = cnvs.getContext('2d');
        // dibujo original
        ctxx.drawImage(imgOrigen, 0, 0);
        // pinta todo con el color, incluso el fondo
        ctxx.globalCompositeOperation = 'multiply';
        ctxx.fillStyle = color;
        ctxx.fillRect(0, 0, cnvs.width, cnvs.height);
        // elimina el fondo tinturado
        ctxx.globalCompositeOperation = 'destination-in';
        ctxx.drawImage(imgOrigen, 0, 0);
        // crear la nueva imagen desde el canvas
        let imgFinal = new Image();
        imgFinal.src = cnvs.toDataURL();
        return imgFinal;
    }

    getReady() {
        return this.cargas == this.sprite.length;
    }

    // dibujado general de sprites

    drawSprite(ctx, posicion, sprite, subimg) {
        ctx.drawImage(sprite, subimg * 128, 0, 128, 192,
            posicion.x - 62, posicion.y - 186, 128, 192);
    }

    drawSpriteEsc(ctx, posicion, sprite, subimg, escala) {
        ctx.drawImage(sprite, subimg * 128, 0, 128, 192,
            posicion.x - 62 * escala, posicion.y - 186 * escala,
            128 * escala, 192 * escala);
    }

    drawSombra(ctx, posicion) {
        ctx.drawImage(this.sprite[10], posicion.x - 41, posicion.y - 23);
    }

    drawAro(ctx, posicion) {
        ctx.drawImage(this.sprite[11], posicion.x - 41, posicion.y - 23);
    }

    drawCircle(ctx, posicion, radio) {
        ctx.beginPath();
        ctx.arc(posicion.x, posicion.y, radio, 0, 2 * Math.PI);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // dibujado de piezas de avatar

    drawFantasma(ctx, posicion, anima) {
        // anima: -1 quieto, 0 a 1 paso
        let sub = Math.max(0, Math.min(3, Math.floor(anima * 4)));
        this.drawSprite(ctx, posicion, this.sprite[12], sub);
    }

    drawCabeza(ctx, posicion, piel, genero, anima) {
        // anima: -1 quieto, 0 a 1 paso
        let spr = this.sprite[piel];
        let sub = genero == 0 ? 0 : 6;
        if (anima != -1) {
            posicion = {x: posicion.x,
                y: posicion.y - anima * this.osciCabeza};
        }
        this.drawSprite(ctx, posicion, spr, sub);
    }

    drawCuerpo(ctx, posicion, piel, genero, anima, nude) {
        // anima: -1 quieto, 0 a 1 paso
        let spr = this.sprite[piel];
        let sub = 1 + 6 * genero;
        if (anima != -1) {
            sub += 1 + Math.min(3, Math.floor(anima * 4));
        }
        this.drawSprite(ctx, posicion, spr, sub);
        if (nude && genero != 0) {
            this.drawSprite(ctx, posicion, spr, 12);
        }
    }

    drawEmocion(ctx, posicion, emocion, anima, isHit=false) {
        // anima: -1 quieto, 0 a 1 paso
        if (anima != -1) {
            posicion = {x: posicion.x,
                y: posicion.y - anima * this.osciCabeza};
        }
        if (isHit) {
            this.drawSprite(ctx, posicion, this.sprite[16], 0);
        }
        else {
            this.drawSprite(ctx, posicion, this.sprite[5], emocion);
        }
    }

    drawPelo(ctx, posicion, genero, pelo, tinte, anima) {
        // anima: -1 quieto, 0 a 1 paso
        let indSpr = (genero == 0 ? this.dataImgCol[0][2] :
            this.dataImgCol[1][2]) + tinte;
        if (anima != -1) {
            posicion = {x: posicion.x,
                y: posicion.y - anima * this.osciCabeza};
        }
        this.drawSprite(ctx, posicion, this.sprite[indSpr], pelo);
    }

    drawTorso(ctx, posicion, genero, torso, color) {
        let indSpr = (genero == 0 ? this.dataImgCol[4][2] :
            this.dataImgCol[5][2]) + color;
        this.drawSprite(ctx, posicion, this.sprite[indSpr], torso);
    }

    drawCadera(ctx, posicion, genero, cadera, tela) {
        let indSpr = (genero == 0 ? this.dataImgCol[2][2] :
            this.dataImgCol[3][2]) + tela;
        this.drawSprite(ctx, posicion, this.sprite[indSpr], cadera);
    }

    drawRol(ctx, posicion, rol, anima) {
        // anima: -1 quieto, 0 a 1 paso
        if (anima != -1) {
            posicion = {x: posicion.x,
                y: posicion.y - anima * this.osciCabeza * 2};
        }
        this.drawSprite(ctx, posicion, this.sprite[9], rol);
    }

    drawClase(ctx, posicion, clase, anima) {
        // anima: -1 quieto, 0 a 1 paso
        if (anima != -1) {
            posicion = {x: posicion.x,
                y: posicion.y - anima * this.osciCabeza * 2};
        }
        this.drawSprite(ctx, posicion, this.sprite[15], clase);
    }

    drawIdea(ctx, posicion, genero, indIdea, indPostura) {
        let spr = null;
        if (indPostura == -1) {
            spr = this.sprite[13];
        }
        else if (indPostura == 1) {
            spr = this.sprite[14];
        }
        else {
            return null;
        }
        let subImg = 2 * indIdea + genero;
        this.drawSprite(ctx, posicion, spr, subImg);
    }

    // dibujado de cosas de la GUI

    drawSelect(ctx, posicion, subInd, isOk) {
        let plusOk = isOk ? 0 : 1;
        let subImg = subInd * 2 + plusOk;
        ctx.drawImage(this.sprite[6], subImg * 32, 0, 32, 32,
            posicion.x - 16, posicion.y - 16, 32, 32);
    }

    drawColor(ctx, posicion, isPelo, color) {
        let indSpr = (isPelo ? this.dataImgCol[6][2] :
            this.dataImgCol[7][2]) + color;
        ctx.drawImage(this.sprite[indSpr],
            posicion.x - 8, posicion.y - 8);
    }

    drawPiel(ctx, posicion, piel) {
        let indSpr = this.dataImgCol[8][2] + piel;
        ctx.drawImage(this.sprite[indSpr],
            posicion.x - 8, posicion.y - 8);
    }

    drawScroll(ctx, posicion, isUp) {
        let subImg = isUp ? 0 : 64;
        ctx.drawImage(this.sprite[7], subImg, 0, 64, 16,
            posicion.x - 32, posicion.y - 8, 64, 16);
    }

    // dibujado de mini avatares piezas

    drawPelambre(ctx, posicion, genero, pelo, tinte, escala) {
        let spr = this.sprite[piel];
        let sub = genero == 0 ? 0 : 6;
        this.drawSpriteEsc(ctx, posicion, spr, sub, escala);
        let indSpr = (genero == 0 ? this.dataImgCol[0][2] :
            this.dataImgCol[1][2]) + tinte;
        this.drawSpriteEsc(ctx, posicion, this.sprite[indSpr],
            pelo, escala);
    }

    drawCarita(ctx, posicion, genero, piel, emocion, escala) {
        let spr = this.sprite[piel];
        let sub = genero == 0 ? 0 : 6;
        this.drawSpriteEsc(ctx, posicion, spr, sub, escala);
        this.drawSpriteEsc(ctx, posicion, this.sprite[5],
            emocion, escala);
    }

    drawTorsito(ctx, posicion, genero, torso, color, escala) {
        let indSpr = (genero == 0 ? this.dataImgCol[4][2] :
            this.dataImgCol[5][2]) + color;
        this.drawSpriteEsc(ctx, posicion, this.sprite[indSpr],
            torso, escala);
    }

    drawCaderita(ctx, posicion, genero, cadera, tela, escala) {
        let indSpr = (genero == 0 ? this.dataImgCol[2][2] :
            this.dataImgCol[3][2]) + tela;
        this.drawSpriteEsc(ctx, posicion, this.sprite[indSpr],
            cadera, escala);
    }

    drawRolsito(ctx, posicion, rol, escala) {
        this.drawSpriteEsc(ctx, posicion, this.sprite[9],
            rol, escala);
    }

    drawClasesita(ctx, posicion, clase, escala) {
        this.drawSpriteEsc(ctx, posicion, this.sprite[15],
            clase, escala);
    }

    // dibujado de cosas del fondo del mundo

    drawSuelo(ctx, ancho, alto) {
        let sw = this.sprite[8].width;
        let sh = this.sprite[8].height;
        let rw = Math.ceil(ancho / sw);
        let rh = Math.ceil(alto / sh);
        for (let w = 0; w < rw; w++) {
            for (let h = 0; h < rh; h++) {
                ctx.drawImage(this.sprite[8], w * sw, h * sh);
            }
        }
    }

    // obtencion de valores maximos posibles

    totEmocion() {
        return this.sprite[5].width / 128;
    }

    totPelo() {
        let sprInd = this.dataImgCol[0][2];
        return this.sprite[sprInd].width / 128;
    }

    totTorso() {
        let sprInd = this.dataImgCol[4][2];
        return this.sprite[sprInd].width / 128;
    }

    totCadera() {
        let sprInd = this.dataImgCol[2][2];
        return this.sprite[sprInd].width / 128;
    }

    totRol() {
        return this.sprite[9].width / 128;
    }

    totClase() {
        return this.sprite[15].width / 128;
    }

    totIdeas() {
        return this.sprite[13].width / 128;
    }

    // manipulacion de texto

    static getMsjFont(isTitle=false) {
        return (isTitle ? "17" : "14") +
            "px Georgia,'Times New Roman',Times, serif";
    }

    static drawMensaje(ctx, texto, posicion, font, lineY, borde) {
        // configurar las cosas
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        let lineas = texto.split("\n");
        // obtener informacion general
        let ancho = ctx.measureText("Hola").width;
        lineas.forEach(li => {
            ancho = Math.max(ancho, ctx.measureText(li).width);
        });
        let alto = posicion.y - (lineas.length - 1) * lineY;
        // dibujar fondo
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillRect(
            posicion.x - ancho / 2 - borde,
            alto - lineY - borde,
            ancho + 2 * borde,
            lineas.length * lineY + 2 * borde
        );
        // dibujar texto
        ctx.fillStyle = "black";
        lineas.forEach(li => {
            ctx.fillText(li, posicion.x, alto);
            alto += lineY;
        });
    }

    static drawDescripcion(ctx, texto, posicion, font, lineY, borde, ancho) {
        // configurar las cosas
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        let lineas = texto.split("\n");
        // obtener informacion general
        let alto = posicion.y - (lineas.length - 1) * lineY - borde;
        // dibujar fondo
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillRect(
            posicion.x,
            alto - lineY - borde,
            posicion.x + ancho + 2 * borde,
            lineas.length * lineY + 2 * borde
        );
        // dibujar texto
        ctx.fillStyle = "black";
        lineas.forEach(li => {
            ctx.fillText(li, posicion.x + borde + ancho / 2, alto);
            alto += lineY;
        });
    }

    static prepareTextMsj(texto, anchoPx, altoPx, font, lineY, bordeX) {
        // el texto cabra en el rectangulo anchoPx x altoPx
        // font: "16px Arial"
        // lineY: espacio vertical entre lineas
        // bordeX: espacio px maximo vacio a la derecha, romper palabras
        let myCanva = document.createElement('canvas');
        let myCtx = myCanva.getContext('2d');
        myCtx.font = font;
        let result = "";
        // preparar el texto quitando espacios o saltos duplicados
        texto = Sprites.prepareTextJump(texto);
        // comenzar el ciclo que analiza cada palabra para ver si cabe
        let palabras = texto.split(" ");
        let antLine = "";
        let cursorY = 0;
        while (palabras.length != 0) {
            // obtiene la palabra y calcula la talla del texto acumulado
            let pal = palabras.shift();
            let newLine = antLine + pal + " ";
            let newAncho = myCtx.measureText(newLine).width;
            // cupo perfectamente
            if (newAncho <= anchoPx) {
                result += pal + " ";
                antLine = newLine;
            }
            else {
                // obtener informacion de longitud de palabra y espacio
                let palAncho = myCtx.measureText(pal).width;
                let libre = anchoPx - (newAncho - palAncho);
                // devolver la palabra para procesarla en linea nueva
                if (libre <= bordeX) {
                    palabras.unshift(pal);
                }
                // partir la palabra
                else {
                    // primero hallar la particion optima
                    let opc1 = Sprites.getTextTramo(
                        myCtx, pal, libre - bordeX);
                    let min1 = Math.min(opc1[1], palAncho - opc1[1]);
                    let opc2 = Sprites.getTextTramo(
                        myCtx, Sprites.getTextReverse(pal), newAncho - anchoPx);
                    let min2 = Math.min(opc2[1], palAncho - opc2[1]);
                    let prts = min1 > min2 ?
                        [opc1[0], opc1[2]] :
                        [Sprites.getTextReverse(opc2[2]),
                        Sprites.getTextReverse(opc2[0])];
                    // agregar el tramo y devolver el otro a la lista
                    result += prts[0] + "-";
                    palabras.unshift(prts[1]);
                }
                // verificar si ha llegado al limite vertical
                cursorY += lineY;
                if (cursorY > altoPx - lineY) {
                    return result.trimEnd();
                }
                else {
                    result += "\n";
                    antLine = "";
                }
            }
        }
        return result.trimEnd();
    }

    static prepareTextJump(texto) {
        let antTexto = texto;
        texto = texto.replaceAll("  ", " ").replaceAll("\n\n", "\n");
        while (texto != antTexto) {
            antTexto = texto;
            texto = texto.replaceAll("  ", " ").replaceAll("\n\n", "\n");
        }
        texto = texto.replaceAll(" \n", "\n");
        texto = texto.replaceAll("\n ", "\n");
        texto = texto.replaceAll("\n", " ");
        return texto;
    }

    static getTextTramo(myCtx, texto, anchoObj) {
        // dado un contexto, aumenta gradualmente a texto hasta anchoObj
        // return: [tramo_de_texto, talla_del_tramo, segunda_parte_del_texto]
        let subTxt = "";
        let palAncho = 0;
        for (let c = 0; c < texto.length; c++) {
            subTxt += texto.charAt(c);
            palAncho = myCtx.measureText(subTxt).width;
            if (palAncho >= anchoObj) {
                return [subTxt, palAncho, texto.substring(subTxt.length)];
            }
        }
        return [subTxt, palAncho, ""];
    }

    static getTextReverse(texto) {
        return texto.split("").reverse().join("");
    }
}
