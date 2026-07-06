//=========================================================
// HIVEMQ CLOUD
//=========================================================

const broker = "wss://e999dc5e80ac4cefbf2e13e3e60d378c.s1.eu.hivemq.cloud:8884/mqtt";

const options = {

    username: "SG",

    password: "BRAYANSG22",

    clientId: "Panel_" + Math.random().toString(16).substring(2,10),

    clean: true,

    reconnectPeriod: 3000,

    keepalive: 60,

    connectTimeout: 30000,

    protocolVersion: 4

};

const client = mqtt.connect(broker, options);

//=========================================================
// OBJETOS HTML
//=========================================================

const estado = document.getElementById("estado");

const ledNorte = document.getElementById("ledNorte");
const ledSur = document.getElementById("ledSur");
const ledEste = document.getElementById("ledEste");
const ledOeste = document.getElementById("ledOeste");

const lblNorte = document.getElementById("lblNorte");
const lblSur = document.getElementById("lblSur");
const lblEste = document.getElementById("lblEste");
const lblOeste = document.getElementById("lblOeste");

const distNorte = document.getElementById("distNorte");
const distSur = document.getElementById("distSur");
const distEste = document.getElementById("distEste");
const distOeste = document.getElementById("distOeste");

const tablaNorte = document.getElementById("tablaNorte");
const tablaSur = document.getElementById("tablaSur");
const tablaEste = document.getElementById("tablaEste");
const tablaOeste = document.getElementById("tablaOeste");

//=========================================================
// CONEXIÓN
//=========================================================

client.on("connect", ()=>{

    console.clear();

    console.log("Conectado");

    estado.innerHTML="Conectado";

    estado.className="conectado";

    client.subscribe("NORTE");
    client.subscribe("SUR");
    client.subscribe("ESTE");
    client.subscribe("OESTE");

    client.subscribe("DIST_NORTE");
    client.subscribe("DIST_SUR");
    client.subscribe("DIST_ESTE");
    client.subscribe("DIST_OESTE");

});

//=========================================================

client.on("offline",()=>{

    estado.innerHTML="Desconectado";

    estado.className="desconectado";

});

//=========================================================

client.on("reconnect",()=>{

    estado.innerHTML="Reconectando...";

    estado.className="reconectando";

});

//=========================================================

client.on("error",(e)=>{

    console.log(e);

});

//=========================================================
// FUNCIONES
//=========================================================

function actualizarLed(led,activo){

    if(activo){

        led.classList.remove("inactivo");

        led.classList.add("activo");

    }

    else{

        led.classList.remove("activo");

        led.classList.add("inactivo");

    }

}

//=========================================================

function actualizarEstado(label,valor){

    if(valor==1){

        label.innerHTML="Detectado";

        label.style.color="#00ff55";

    }

    else{

        label.innerHTML="Libre";

        label.style.color="#ff4444";

    }

}

//=========================================================
// MENSAJES MQTT
//=========================================================

client.on("message",(topic,message)=>{

    let dato=message.toString();

    console.log(topic+" -> "+dato);

    switch(topic){

        //==========================
        // NORTE
        //==========================

        case "NORTE":

            actualizarLed(ledNorte,Number(dato));

            actualizarEstado(lblNorte,Number(dato));

        break;

        //==========================
        // SUR
        //==========================

        case "SUR":

            actualizarLed(ledSur,Number(dato));

            actualizarEstado(lblSur,Number(dato));

        break;

        //==========================
        // ESTE
        //==========================

        case "ESTE":

            actualizarLed(ledEste,Number(dato));

            actualizarEstado(lblEste,Number(dato));

        break;

        //==========================
        // OESTE
        //==========================

        case "OESTE":

            actualizarLed(ledOeste,Number(dato));

            actualizarEstado(lblOeste,Number(dato));

        break;

        //==========================
        // DISTANCIAS
        //==========================

        case "DIST_NORTE":

            distNorte.innerHTML=dato+" cm";

            tablaNorte.innerHTML=dato+" cm";

        break;

        case "DIST_SUR":

            distSur.innerHTML=dato+" cm";

            tablaSur.innerHTML=dato+" cm";

        break;

        case "DIST_ESTE":

            distEste.innerHTML=dato+" cm";

            tablaEste.innerHTML=dato+" cm";

        break;

        case "DIST_OESTE":

            distOeste.innerHTML=dato+" cm";

            tablaOeste.innerHTML=dato+" cm";

        break;

    }

});