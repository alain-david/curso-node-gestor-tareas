require('colors');

const { guardarDB, leerDB } = require('./helpers/guardar-file');
const { inquirerMenu, pausa, leerInput, listarTareasBorrar, confirmar, listadoCompletar } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

const main = async() => {
    
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ) {
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        
        opt = await inquirerMenu();
        switch (opt) {
            case '1':
                const desc = await leerInput('Descripcion: ');
                tareas.crearTarea(desc);
            break;

            case '2':
                tareas.listadoCompleto();
            break;
            case '3':
                tareas.listarCompletadasPendientes(true);
            break;
            case '4':
                tareas.listarCompletadasPendientes(false);
            break;
            case '5':
                const ids = await listadoCompletar( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;
            case '6':
                const id = await listarTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar('Estas seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
            break;
        }
        
        guardarDB(tareas.listadoArr);

        if(opt !== '0') await pausa();
    } while ( opt !== '0' );
    
}

main();