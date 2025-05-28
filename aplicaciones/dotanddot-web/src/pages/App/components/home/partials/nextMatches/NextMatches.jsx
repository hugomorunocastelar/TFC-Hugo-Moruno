import React from 'react'
import "./NextMatches.css";

function NextMatches() {

  const examMatches = [
    {
      team1: "Vva",
      team1result: 3,
      team2: "Alc",
      team2result: 1,
      day: "15/05/2025",
      hour: "16:00"
    },
    {
      team1: "CCs",
      team1result: 3,
      team2: "DBs",
      team2result: 0,
      day: "15/05/2025",
      hour: "12:00"
    },
    {
      team1: "Ppa",
      team1result: 1,
      team2: "Lic",
      team2result: 3,
      day: "14/05/2025",
      hour: "16:00"
    },
  ]
  
  return (
    <div className='NexMatches-Panel infoPanel'>
      <div className='NexMatches'>
        <header className='NM-Head'>
          <h2>Next Matches</h2>
        </header>
        <table className='NM-MatchesTable'>
          <tbody>
            {examMatches.map((elem, index) => (
              <tr key={index}>
                <td>
                  <p>{`${elem.team1} vs ${elem.team2}`}</p>
                </td>
                <td>
                  <div className='time'>
                    <p>{elem.day}</p>
                    <p>{elem.hour}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NextMatches