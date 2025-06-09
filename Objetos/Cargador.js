class Cargador {
    static LIMITE = 30; // bloques de datos
    static SEG_MINIESPERA = 3; // entre bloques
    static SEG_MACROESPERA = 15; // actualizaciones
    static SEG_REINTENTO = 7; // volver a hacer peticion
    static MILISEG_TIMEOUT = 7000; // esperar al servidor

    constructor(apiFile) {
        // apiFile: "../Backend/get_avatares.php"
        this.apiFile = apiFile;
        this.consultas = [];
        this.resultados = [];
    }

    newConsulta(tabla, atributos) {
        this.consultas.push({
            tabla: tabla, // ej: "avatar"
            atributos: atributos, // "id,nombre,genero" actualiza es automatico
            cursor: "", // timestamp del ultimo dato del tramo
            antFreno: "", // freno a poner en las consultas
            newFreno: "", // freno cuando cursor -1, maximo timestamp
                            // de primer dato, al finalizar ant=new
            free: true, // true si no esta descargando fetch
            reloj: 0 // espera para volver a pedir datos
        });
        // array de arrays, se van almacenando los datos del fetch
        this.resultados.push([]);
        return this.consultas.length - 1;
    }

    doConsulta(ind) {
        let url = this.apiFile +
            "?limite=" + Cargador.LIMITE +
            "&tabla=" + this.consultas[ind].tabla +
            "&atributos=" + this.consultas[ind].atributos;
        if (this.consultas[ind].cursor != "") {
            url += "&cursor='" + this.consultas[ind].cursor + "'";
        }
        if (this.consultas[ind].antFreno != "") {
            url += "&freno='" + this.consultas[ind].antFreno + "'";
        }
        this.consultas[ind].free = false;
        this.fetchTimeout(url, Cargador.MILISEG_TIMEOUT).
        then(res => {
            if (!res.ok) {
                throw new Error("HTTP");
            }
            return res.json();
        }).
        then(data => {
            if (data.length == 0) {
                this.consultas[ind].cursor = ""; // reiniciar cursor
                this.consultas[ind].antFreno = this.consultas[ind].newFreno;
                this.consultas[ind].reloj = Cargador.SEG_MACROESPERA;
            }
            else {
                this.resultados[ind].push(...data);
                if (this.consultas[ind].cursor == "") {
                    this.consultas[ind].newFreno =
                        data[0].actualiza;
                }
                this.consultas[ind].cursor =
                    data[data.length - 1].actualiza;
                this.consultas[ind].reloj = Cargador.SEG_MINIESPERA;
            }
            this.consultas[ind].free = true;
            return true;
        }).
        catch(err => {
            this.consultas[ind].free = true;
            this.consultas[ind].reloj = Cargador.SEG_REINTENTO;
            return false;
        });
    }

    step(dlt, indCarga) {
        if (this.consultas[indCarga].free) {
            this.consultas[indCarga].reloj -= dlt;
            if (this.consultas[indCarga].reloj <= 0) {
                this.doConsulta(indCarga);
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
