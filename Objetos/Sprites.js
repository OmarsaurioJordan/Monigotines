class Sprites {

    constructor() {
        this.osciCabeza = 5;
        // inicializa el cargado de imagenes
        this.cargas = 0;
        // cargar imagenes sin color
        this.sprite = [
            this.loadImg("d_monigotin1_strip13"), // 0
            this.loadImg("d_monigotin2_strip13"), // 1
            this.loadImg("d_monigotin3_strip13"), // 2
            this.loadImg("d_monigotin4_strip13"), // 3
            this.loadImg("d_monigotin5_strip13"), // 4
            this.loadImg("d_monigotin_emo_strip33"), // 5
            this.loadImg("d_monigotin_select_strip12") // 6
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
        this.dataImgCol = [
            // el ind 2 es donde inician esas imagenes en sprite[]
            ["d_monigotin_pelof_strip16", this.colorPelo, -1], // 0
            ["d_monigotin_pelom_strip16", this.colorPelo, -1], // 1
            ["d_monigotin_caderasf_strip16", this.colorRopa, -1], // 2
            ["d_monigotin_caderasm_strip16", this.colorRopa, -1], // 3
            ["d_monigotin_torsof_strip16", this.colorRopa, -1], // 4
            ["d_monigotin_torsom_strip16", this.colorRopa, -1], // 5
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

    totPiel() {
        return 5;
    }

    totEmocion() {
        return this.sprite[5].width / 128;
    }

    totPelo() {
        let sprInd = this.dataImgCol[0][2];
        return this.sprite[sprInd].width / 128;
    }

    totTinte() {
        return this.colorPelo.length;
    }

    totTorso() {
        let sprInd = this.dataImgCol[4][2];
        return this.sprite[sprInd].width / 128;
    }

    totColor() {
        return this.colorRopa.length;
    }

    totCadera() {
        let sprInd = this.dataImgCol[2][2];
        return this.sprite[sprInd].width / 128;
    }

    totTela() {
        return this.colorRopa.length;
    }

    drawSprite(ctx, posicion, sprite, subimg) {
        ctx.drawImage(sprite, subimg * 128, 0, 128, 192,
            posicion[0] - 62, posicion[1] - 186, 128, 192);
    }

    drawCabeza(ctx, posicion, piel, genero, anima) {
        // anima: -1 quieto, 0 a 1 paso
        let spr = this.sprite[piel];
        let sub = genero == 0 ? 0 : 6;
        if (anima != -1) {
            posicion[1] -= anima * this.osciCabeza;
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

    drawEmocion(ctx, posicion, emocion, anima) {
        // anima: -1 quieto, 0 a 1 paso
        if (anima != -1) {
            posicion[1] -= anima * this.osciCabeza;
        }
        this.drawSprite(ctx, posicion, this.sprite[5], emocion);
    }

    drawPelo(ctx, posicion, genero, pelo, tinte, anima) {
        // anima: -1 quieto, 0 a 1 paso
        let indSpr = (genero == 0 ? this.dataImgCol[0][2] :
            this.dataImgCol[1][2]) + tinte;
        if (anima != -1) {
            posicion[1] -= anima * this.osciCabeza;
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
}
