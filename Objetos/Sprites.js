class Sprites {

    constructor() {
        this.osciCabeza = 5;
        this.cargas = 0;
        this.sprite = [
            this.loadImg("d_monigotin1_strip13"), // 0
            this.loadImg("d_monigotin2_strip13"), // 1
            this.loadImg("d_monigotin3_strip13"), // 2
            this.loadImg("d_monigotin4_strip13"), // 3
            this.loadImg("d_monigotin5_strip13"), // 4
            this.loadImg("d_monigotin_emo_strip33") // 5
        ];
        this.sprite.forEach(s => {
            s.onload = () => {
                this.cargas += 1;
            };
        });
    }

    loadImg(filename) {
        let img = new Image();
        img.src = "../Sprites/" + filename + ".png";
        return img;
    }

    getReady() {
        return this.cargas == this.sprite.length;
    }

    getSubimagenes(sprite) {
        if (!this.getReady()) {
            return parseInt(sprite.src.match(/_strip(\d+)/)[1]);
        }
        return sprite.width / 128;
    }

    getEmociones() {
        return this.getSubimagenes(this.sprite[5]);
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
            posicion[1] += (-0.5 + anima) * this.osciCabeza;
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
            posicion[1] += (-0.5 + anima) * this.osciCabeza;
        }
        this.drawSprite(ctx, posicion, this.sprite[5], emocion);
    }
}
