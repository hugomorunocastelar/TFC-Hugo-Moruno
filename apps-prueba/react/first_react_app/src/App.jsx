import React, { useState } from "react";
import { URL_INFO } from "./env";
import "./App.css";

function App()
{
  const [respuesta, setRespuesta] = useState("default");

  function peticion(type)
  {
    let url = `${URL_INFO}${type + 1}`;

    console.log(url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.text(); 
      })
      .then((data) => {
        setRespuesta(data); 
      })
      .catch((error) => {
        setRespuesta("Failed to get information from the server :(");
        console.error(error);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Bienvenido a la prueba del despliegue del TFC! Hugo Moruno Parra
        </h1>
      </header>
      <main className="App-body">
        <section className="App-content">
          <div>
            <h2>Prueba el Backend! Desde aquí mismo 🔽</h2>
            <div className="buttonsAndResponses">
              <div className="buttons">
                <button
                  onClick={() =>
                  {
                    peticion(0);
                  }}
                >
                  <span>Prueba 1</span>
                </button>
                <button
                  onClick={() =>
                  {
                    peticion(1);
                  }}
                >
                  <span>Prueba 2</span>
                </button>
                <button
                  onClick={() =>
                  {
                    peticion(2);
                  }}
                >
                  <span>Prueba 3</span>
                </button>
              </div>
              <textarea
                name="response"
                className="response"
                value={respuesta}
                readOnly
              ></textarea>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
