"use strict";

export { URL_INFO };

/**
 * Script author = Hugo Moruno
 * URLs
 */

const IP_BASE = 
//IP of the dev_server
              // 'localhost'
//IP of the pro_server
              '172.18.0.6'
const SPRING_PORT = '8080'

//Port and protocol of connection to the info server
// const URL_INFO = `https://${ IP_BASE }:${ SPRING_PORT }/prueba-app/datos/`;
const URL_INFO = `https://tomcat.pruebafcthugocastelar.duckdns.org/prueba-app/datos/`;