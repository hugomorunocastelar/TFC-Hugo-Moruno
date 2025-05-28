import React from 'react';
import "./Competitions.css";
import { Link } from 'react-router-dom';

function Competitions() {

  const CATEGORIES = [
    "senior",
    "absolute",
    "junior",
    "youth",
    "cadet",
    "infantile",
    "alevin",
    "benjamin",
    "pre-benjamin",
  ];


  const competitions = {
      "judex": {
        "man": {
          "pre-benjamin": { "teams": 4 },
          "benjamin": {},
          "alevin": { "teams": 6 },
          "infantile": {},
          "cadet": { "teams": 3 },
          "youth": {},
          "junior": {},
          "absolute": {},
          "senior": {}
        },
        "woman": {
          "pre-benjamin": {},
          "benjamin": {},
          "alevin": { "teams": 2 },
          "infantile": {},
          "cadet": {},
          "youth": {},
          "junior": {},
          "absolute": {},
          "senior": {}
        },
        "mix": {
          "pre-benjamin": {},
          "benjamin": {},
          "alevin": { "teams": 2 },
          "infantile": {},
          "cadet": {},
          "youth": {},
          "junior": {},
          "absolute": {},
          "senior": {}
        }
      },
      "federation": {
        "man": {
          "pre-benjamin": {},
          "benjamin": { "teams": 5 },
          "alevin": {},
          "infantile": {},
          "cadet": {},
          "youth": { "teams": 2 },
          "junior": {},
          "absolute": {},
          "senior": {}
        },
        "woman": {
          "pre-benjamin": {},
          "benjamin": {},
          "alevin": {},
          "infantile": {},
          "cadet": {},
          "youth": {},
          "junior": {},
          "absolute": {},
          "senior": {}
        },
        "mix": {
          "pre-benjamin": {},
          "benjamin": {},
          "alevin": { "teams": 2 },
          "infantile": {},
          "cadet": {},
          "youth": {},
          "junior": {},
          "absolute": {},
          "senior": {}
        }
      },
      "friendly": {
        "man": {
          "pre-benjamin": {},
          "benjamin": {},
          "alevin": {},
          "infantile": {},
          "cadet": {},
          "youth": {},
          "junior": {},
          "absolute": {},
          "senior": {}
        },
        "woman": {
          "pre-benjamin": { "teams": 1 },
          "benjamin": {},
          "alevin": {},
          "infantile": {},
          "cadet": {},
          "youth": {},
          "junior": {},
          "absolute": {},
          "senior": {}
        },
        "mix": {
          "pre-benjamin": {},
          "benjamin": {},
          "alevin": { "teams": 2 },
          "infantile": {},
          "cadet": {},
          "youth": {},
          "junior": {},
          "absolute": {},
          "senior": {}
        }
      }
    }

  const GENDER_ORDER = ["woman", "man", "mix"];

  const hasData = Object.values(competitions).some((types) =>
    Object.values(types).some((gender) =>
      Object.values(gender).some((category) => Object.keys(category).length > 0)
    )
  );

  if (!hasData) {
    return <div>Error: No hay datos para mostrar.</div>;
  }

  return (
    <div className="competition-container">
      {Object.entries(competitions).map(([type, genders]) => {
        const typeHasData = Object.values(genders).some((gender) =>
          Object.values(gender).some((category) => Object.keys(category).length > 0)
        );

        if (!typeHasData) return null;

        return (
          <div key={type} className="competition-card infoPanel">
            <h2 className="competition-title">{type}</h2>
            <div className='cards'>
              {GENDER_ORDER.map((gender) => {
                const categories = genders[gender] || {};
                const filteredCategories = CATEGORIES.filter(
                  (cat) => categories[cat] && Object.keys(categories[cat]).length > 0
                );

                if (filteredCategories.length === 0) return null;

                return (
                  <div key={gender} className="gender-section">
                    <h3 className="gender-title">{gender}</h3>
                    <ul className="category-list">
                      {filteredCategories.map((cat) => (
                        <li key={cat}>
                          <Link className="category-link" to={`/competitions/${type}/${cat}`}>{cat}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Competitions