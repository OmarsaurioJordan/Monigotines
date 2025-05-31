class Cargador {

    constructor(apiFile) {
        // apiFile: "../Backend/get_avatares.php"
        this.apiFile = apiFile;
        this.consultas = [];
        this.resultados = [];
        this.limite = 30; // bloques de datos
        this.segMiniespera = 2; // entre bloques
        this.segMacroespera = 9; // actualizaciones
        this.segReintento = 4; // volver a hacer peticion
        this.milisegTimeout = 7000; // esperar al servidor
    }

    newConsulta(tabla, atributos) {
        // [tabla, atributos, cursor, antFreno, newFreno]
        // 0 tabla: "avatar"
        // 1 atributos: "id,nombre,genero" actualiza es automatico
        // 2 cursor: timestamp del ultimo dato del tramo
        // 3 antFreno: freno a poner en las consultas
        // 4 newFreno: freno cuando cursor -1, maximo timestamp
        //       de primer dato, al finalizar ant=new
        // 5 isFree: true si no esta descargando fetch
        // 6 segReloj: espera para volver a pedir datos
        this.consultas.push([
            tabla, atributos, -1, -1, -1, true, 0]);
        // array de arrays, se van almacenando los datos del fetch
        this.resultados.push([]);
        return this.consultas.length - 1;
    }

    doConsulta(ind) {
        let url = this.apiFile +
            "?limite=" + this.limite +
            "&tabla=" + this.consultas[ind][0] +
            "&atributos=" + this.consultas[ind][1];
        if (this.consultas[ind][2] != -1) {
            url += "&cursor=" + this.consultas[ind][2];
        }
        if (this.consultas[ind][3] != -1) {
            url += "&freno=" + this.consultas[ind][3];
        }
        this.consultas[ind][5] = false;
        this.fetchTimeout(url, this.milisegTimeout).
        then(res => {
            if (!res.ok) {
                throw new Error("HTTP");
            }
            return res.json();
        }).
        then(data => {
            if (data.length == 0) {
                this.consultas[ind][2] = -1; // reiniciar cursor
                this.consultas[ind][3] = this.consultas[ind][4];
                this.consultas[ind][4] = -1; // para nuevo freno
                this.consultas[ind][6] = this.segMacroespera;
            }
            else {
                this.resultados[ind].push(...data);
                if (this.consultas[ind][2] == -1) {
                    this.consultas[ind][4] =
                        data[0].actualiza;
                }
                this.consultas[ind][2] =
                    data[data.length - 1].actualiza;
                this.consultas[ind][6] = this.segMiniespera;
            }
            this.consultas[ind][5] = true;
            return true;
        }).
        catch(err => {
            this.consultas[ind][5] = true;
            this.consultas[ind][6] = this.segReintento;
            return false;
        });
    }

    step(dlt) {
        for (let i = 0; i < this.consultas.length; i++) {
            if (this.consultas[i][5]) {
                this.consultas[i][6] -= dlt;
                if (this.consultas[i][6] <= 0) {
                    this.doConsulta(i);
                }
            }
        }
    }

    totData(ind) {
        return this.resultados[ind].length;
    }

    popData(ind) {
        if (this.totData(ind) != 0) {
            return this.resultados[ind].pop();
        }
        return null;
    }

    fetchTimeout(url, timeout) {
        // codigo robado de Internet
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        return fetch(url, { signal: controller.signal }).
            finally(() => clearTimeout(id));
    }
}
