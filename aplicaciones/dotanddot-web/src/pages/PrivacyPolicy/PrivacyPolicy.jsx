import React from "react";
import "./PrivacyPolicy.css";
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
    const navigate = useNavigate();


    return (
        <div className="privacy-policy-container">
            <main className="privacy-main">
                <header>
                    <div className="privacy-title">
                        <h1>Política de Privacidad — Dot&amp;Dot</h1>
                        <button onClick={() => {navigate("/")}}>Volver</button>
                    </div>
                    <p className="privacy-updated">
                        Última actualización: 19 de noviembre de 2025
                    </p>
                </header>

                <section>
                    <h2>1. Introducción</h2>
                    <p>
                        En Dot&amp;Dot (en adelante, "Dot&amp;Dot", "nosotros" o "la Empresa") somos
                        conscientes de la importancia de proteger la privacidad y los datos personales
                        de las personas con las que interactuamos. La presente Política de Privacidad
                        describe cómo recopilamos, utilizamos, almacenamos, protegemos y divulgamos los
                        datos personales en cumplimiento de la normativa de protección de datos
                        aplicable en España (LOPD/GDPR) y otras leyes relevantes.
                    </p>
                </section>

                <section>
                    <h2>2. Responsable del tratamiento</h2>
                    <p>
                        Responsable: Dot&amp;Dot
                        <br />
                        Domicilio: Calle Ejemplo, 1 — 28000, Ciudad (España)
                        <br />
                        Email de contacto: privacidad@dotanddot.com
                    </p>
                </section>

                <section>
                    <h2>3. Ámbito de aplicación</h2>
                    <p>
                        Esta política se aplica a todos los datos personales que Dot&amp;Dot recopila a
                        través de su sitio web, servicios, aplicaciones móviles, comunicaciones por
                        correo electrónico, formularios, contratación de servicios, relaciones
                        comerciales y cualquier otro canal en que se proporcionen datos personales a
                        Dot&amp;Dot.
                    </p>
                </section>

                <section>
                    <h2>4. Tipos de datos que recopilamos</h2>
                    <p>
                        Podemos recopilar, según la relación y los servicios contratados, las
                        siguientes categorías de datos personales:
                    </p>
                    <ul>
                        <li>Identificativos: nombre, apellidos, NIF/CIF cuando proceda, fecha de nacimiento.</li>
                        <li>Contacto: dirección postal, dirección de correo electrónico, números de teléfono.</li>
                        <li>Datos de empleo y profesionales: empresa, cargo, datos del CV, referencias.</li>
                        <li>Datos de facturación y transacciones: datos bancarios, historial de pagos y facturas.</li>
                        <li>Datos técnicos: direcciones IP, datos de navegación, cookies y otros identificadores.</li>
                        <li>Otros datos: cualquier otra información que nos facilite voluntariamente por
                            motivos comerciales, de soporte o legales.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Finalidades del tratamiento</h2>
                    <p>Tratamos los datos personales para las siguientes finalidades:</p>
                    <ul>
                        <li>Prestar, gestionar y mejorar los servicios contratados.</li>
                        <li>Gestionar la relación contractual, incluida la comunicación comercial y administrativa.</li>
                        <li>Tramitar facturación, pagos, reclamaciones y obligaciones fiscales y contables.</li>
                        <li>Responder a consultas, solicitudes de soporte y gestionar incidencias.</li>
                        <li>Enviar comunicaciones comerciales y promocionales cuando se cuente con el consentimiento
                            o exista una relación contractual que lo permita.</li>
                        <li>Cumplir obligaciones legales, regulatorias y de seguridad.</li>
                        <li>Analizar y optimizar el uso de nuestros servicios mediante herramientas de análisis.</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Base jurídica del tratamiento</h2>
                    <p>
                        Dependiendo de la finalidad, las bases legales para el tratamiento de datos pueden ser:
                    </p>
                    <ul>
                        <li>Consentimiento del interesado: para comunicaciones comerciales, boletines y tratamientos
                            específicos que requieran autorización expresa.</li>
                        <li>Ejecución de un contrato: cuando el tratamiento sea necesario para prestar un servicio
                            o cumplir con un contrato suscrito con el interesado.</li>
                        <li>Obligación legal: cuando se trate de cumplir obligaciones legales o fiscales.</li>
                        <li>Interés legítimo: para prevención de fraude, seguridad del servicio, gestión administrativa
                            y mejora de productos, siempre que no prevalezcan los derechos y libertades del afectado.</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Conservación de los datos</h2>
                    <p>
                        Conservaremos los datos personales durante el tiempo necesario para cumplir con las finalidades
                        descritas y para atender obligaciones legales, resolver disputas y hacer cumplir nuestros acuerdos.
                        Cuando los datos ya no sean necesarios se suprimirán o anonimizarán, salvo que sea necesario conservarlos
                        por prescripciones legales.
                    </p>
                </section>

                <section>
                    <h2>8. Comunicaciones y cesiones</h2>
                    <p>
                        No vendemos datos personales. Podemos compartir datos personales con:
                    </p>
                    <ul>
                        <li>Proveedores y subcontratistas que prestan servicios técnicos, administrativos, de pago o de soporte.</li>
                        <li>Autoridades públicas cuando exista obligación legal o en cumplimiento de requerimientos legales.</li>
                        <li>Socios comerciales con quien tengamos acuerdos para prestar servicios conjuntos, siempre con las
                            garantías legales necesarias.</li>
                    </ul>
                    <p>
                        Cuando se transfieran datos fuera del Espacio Económico Europeo, garantizaremos mecanismos
                        de protección adecuados (cláusulas contractuales estándar, decisiones de adecuación, etc.).
                    </p>
                </section>

                <section>
                    <h2>9. Seguridad de los datos</h2>
                    <p>
                        Implementamos medidas técnicas y organizativas apropiadas para proteger los datos personales frente
                        a pérdida, acceso no autorizado, uso indebido, divulgación o alteración. Estas medidas incluyen controles
                        de acceso, cifrado según necesidad, gestión de incidentes y revisiones periódicas de seguridad.
                    </p>
                </section>

                <section>
                    <h2>10. Derechos de los interesados</h2>
                    <p>
                        Los interesados tienen, en todo momento, los derechos reconocidos por la normativa de protección de datos:
                    </p>
                    <ul>
                        <li>Derecho de acceso: solicitar confirmación sobre si estamos tratando datos personales y acceder a ellos.</li>
                        <li>Derecho de rectificación: solicitar la corrección de datos inexactos o incompletos.</li>
                        <li>Derecho de supresión (derecho al olvido): solicitar la eliminación de los datos cuando proceda.</li>
                        <li>Derecho de oposición: oponerse al tratamiento por motivos relacionados con su situación particular.</li>
                        <li>Derecho de limitación del tratamiento: solicitar la limitación del tratamiento en determinados supuestos.</li>
                        <li>Derecho a la portabilidad: recibir los datos en un formato estructurado y, cuando sea técnicamente posible,
                            transferirlos a otro responsable.</li>
                        <li>Derecho a retirar el consentimiento: cuando el tratamiento se base en el consentimiento, sin afectar la licitud
                            del tratamiento previo a la retirada.</li>
                    </ul>
                    <p>
                        Para ejercer cualquier derecho puede enviar una solicitud a privacidad@dotanddot.com indicando el derecho que desea
                        ejercer y aportando una copia de un documento que acredite su identidad. También puede presentar una reclamación ante
                        la Agencia Española de Protección de Datos (AEPD) si considera que sus derechos no han sido respetados.
                    </p>
                </section>

                <section>
                    <h2>11. Cookies y tecnologías similares</h2>
                    <p>
                        Usamos cookies y otras tecnologías para recopilar información técnica sobre su navegación y para mejorar la experiencia
                        de usuario. Al acceder a nuestro sitio se mostrará un aviso de cookies con información sobre tipos de cookies, finalidades
                        y cómo configurarlas o rechazarlas. Puede ajustar sus preferencias en cualquier momento a través de la configuración de su navegador.
                    </p>
                </section>

                <section>
                    <h2>12. Menores</h2>
                    <p>
                        Nuestros servicios no están dirigidos a menores de edad. No recopilamos conscientemente datos de menores sin el
                        consentimiento verificable de sus padres o tutores. Si detectamos que hemos recopilado datos de un menor sin
                        la debida autorización lo eliminaremos de forma inmediata.
                    </p>
                </section>

                <section>
                    <h2>13. Cambios en la política</h2>
                    <p>
                        Podemos actualizar esta Política de Privacidad ocasionalmente. Publicaremos cualquier cambio en esta página y,
                        cuando corresponda, le notificaremos por otros medios (por ejemplo, correo electrónico) para informarle de cambios
                        significativos.
                    </p>
                </section>

                <section>
                    <h2>14. Contacto</h2>
                    <p>
                        Si tiene preguntas, solicitudes o desea ejercer sus derechos, puede contactar con nuestro Delegado de Protección de Datos
                        o el equipo responsable de privacidad en:
                    </p>
                    <p>
                        Email: privacidad@dotanddot.com
                        <br />
                        Dirección: Calle Ejemplo, 1 — 28000, Ciudad (España)
                    </p>
                </section>

                <footer className="privacy-footer">
                    <p className="privacy-footer-text">
                        Dot&amp;Dot se compromete a proteger su privacidad y a cumplir con la normativa aplicable. Esta política describe nuestras prácticas
                        generales; si necesita información específica sobre un tratamiento concreto, contacte con nosotros.
                    </p>
                </footer>
            </main>
        </div>
    );
}

export default PrivacyPolicy;