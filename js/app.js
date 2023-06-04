//variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//Eventos

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}


//Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0); //itera y suma los valores del [];
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}
class UI {
    insertarPresupuesto(cantidad) {
        //extrayendo los valores
        const { presupuesto, restante } = cantidad;
        //agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    impimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        //insertar en HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //quitar el HTML
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML(); //elimina el html previo

        //iterar sobre los gastos    
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; //Claslist te reporta que clases hay y classname te reporta solamente las que hay

            nuevoGasto.dataset.id = id;

            console.log(nuevoGasto);

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> ${cantidad} </span>`

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times'; //entidad de html la "X"
            btnBorrar.onclick = () => {
                  eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);


            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%
        if( (presupuesto / 4 ) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante ) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total  es 0 o <
        if(restante <= 0) {
            ui.impimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//Instanciar
const ui = new UI();//instanciado de forma global 
let presupuesto;

//funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');


    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    // leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    //validar
    if (nombre === '' || cantidad === '') {
        ui.impimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.impimirAlerta('Cantidad no valida', 'error');
        return;
    }

    //Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }; //lo contrario a un destructuring une cantidad + gasto OBJECT LITERAL

    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //mensaje de todo bien
    ui.impimirAlerta('Gasto Agregado');

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reiniciando formulario
    formulario.reset()
}
function eliminarGasto(id) {
    //Elimina de la clase
    presupuesto.eliminarGasto(id);
    //elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

}