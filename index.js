var bandera = false;
var temp;
var periodoVal;
var voltaje;
var tempAct =10;
var arrayTemps = [];
var arrayPeridos = [];
var tamañoArrayTemps;
var tamañoArrayPeriodos;
var periodoAcum = 0;
var finalizar;


function apagar() {
    console.log("owowowapagar")
    document.getElementById("voltaje").value = 0;
    clearInterval(finalizar);
    init();
    bandera=false;
    guardarArchivo();   
}


function onIniciarPro() {
    temp = document.getElementById("temp").value;
    periodoVal = document.getElementById("periodo").value;
    voltaje = document.getElementById("voltaje").value;

    if(temp != '' && periodoVal != '' && voltaje != '') {
        document.getElementById("grafica").style.display = "block";
        iniciarlizarVars();
        graficar();

    }else {
        alert('Debe ingresar una Temp Referencia, Periodo y un Voltaje para realizar la Preparación.');

    }
}

function iniciarlizarVars() {
    temp = document.getElementById("temp").value;
    periodoVal = document.getElementById("periodo").value;
    voltaje = document.getElementById("voltaje").value;
    finalizar = setInterval(calcularTempActual,periodoVal*1000);
    console.log(tempAct+""+temp);

}

function calcularTempActual() {
    tamañoArrayTemps = arrayTemps.length;
    tamañoArrayPeriodos = arrayPeridos.length;
    voltaje = document.getElementById("voltaje").value;
    if (bandera == false) {
        console.log("estoy en el if"+ tempAct);
        arrayPeridos.push(periodoVal);
        arrayTemps.push(tempAct);
        arrayPeridos.push(periodoVal);
        document.getElementById("tempActual").value = tempAct;
        console.log("estoy en el if"+ tempAct);
        var num = arrayPeridos[tamañoArrayPeriodos - 1];
        periodoAcum = Number(periodoVal) + Number(num);
        bandera = true;
        
    }
    else {
        for (var i = 0; i < arrayTemps.length; i++) {
            
            console.log("en el for la temp"+tempAct);
            console.log("tam array"+ arrayTemps.length);
            console.log('voltaje:' + voltaje);
            tempAct = (voltaje * periodoVal) + arrayTemps[tamañoArrayTemps - 1];
            var num = 0;
            num = arrayPeridos[tamañoArrayPeriodos - 1];
            console.log("num"+ num + "  "+periodoVal)
            periodoAcum = Number(periodoVal) + Number(num);
            
            document.getElementById("tempActual").value = tempAct;
           
            console.log("estoy en el for: " + tempAct);
        }
        arrayTemps.push(tempAct);
        arrayPeridos.push(periodoAcum);
    }
}
function guardarArchivo(){
        var temperaturas = "    Inicial: "+10 +"\n";
    for(var i=0; i < arrayTemps.length; i++){
        if(i>0){
            temperaturas = temperaturas +" [tiempo:" +arrayPeridos[i]+" temp: " + arrayTemps[i]+"]\n"; 
        }
        else{
            temperaturas = temperaturas +" [tiempo:" + 0 + " temp: " + arrayTemps[i]+"]\n"; 
        } 
    }
    WriteFile(temperaturas);
}
  
function graficar() {
    var random = new TimeSeries();
    var line1 = new TimeSeries();
    setInterval(function () {
        line1.append(Date.now(), temp);
        random.append(Date.now(), arrayTemps[tamañoArrayTemps - 1]);
    }, periodoVal*1000);

    var chart = new SmoothieChart({grid: { strokeStyle:'dark', fillStyle:'White' }, labels: { fillStyle:'rgb(60, 0, 0)' }, responsive: true });
    chart.addTimeSeries(line1, { strokeStyle: 'yellow', fillStyle: 'rgba(255,255,0,0.3)', lineWidth: 6});
    chart.addTimeSeries(random, { strokeStyle: 'blue', fillStyle: 'rgba(0,0,255,0.3)', lineWidth: 6 });
    chart.streamTo(document.getElementById("chart-responsive"), periodoVal*1000);
}


function WriteFile(contenido) {
    var file = new File([contenido], "temperaturas.txt", { type: "text/plain;charset=utf-8" });

    // obtienes una URL para el fichero que acabas de crear
    var url = window.URL.createObjectURL(file);

    // creas un enlace y lo añades al documento
    var a = document.createElement("a");
    document.body.appendChild(a);

    // actualizas los parámetros del enlace para descargar el fichero creado
    a.href = url;
    a.innerHTML = "Descargar información del proceso.";
    a.download = file.name;

}


