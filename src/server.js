const Hapi = require('@hapi/hapi');

// gunakan route configuration pada server
const routes = require('./routes');


const init = async() => {

    // mengaktifkan CORS diseluruh router yang ada diserver 
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);

    // gunakan route configuration pada server
    server.route(routes);
};

init();