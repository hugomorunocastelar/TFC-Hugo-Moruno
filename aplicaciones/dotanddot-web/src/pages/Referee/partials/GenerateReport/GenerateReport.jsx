import React, { useState, useEffect } from 'react';
import { getRefereeGames } from '../../../../js/referee/referee.mjs';
import Loader from '../../../Loader/Loader';
import './GenerateReport.css';

function GenerateReport() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFinishedGames();
    }, []);

    const fetchFinishedGames = async () => {
        try {
            const gamesData = await getRefereeGames();
            const finishedGames = gamesData.filter(g => g.finished);
            setGames(finishedGames);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching games:', err);
            setError('Error loading finished games');
            setLoading(false);
        }
    };

    const generatePDF = (game) => {
        const printWindow = window.open('', '_blank');
        
        const setsArray = [game.set1, game.set2, game.set3, game.set4, game.set5].filter(Boolean);
        
        let setsWonLocal = 0;
        let setsWonVisit = 0;
        setsArray.forEach(set => {
            if (set.timeEnd) {
                if (set.pointsLocal > set.pointsVisit) setsWonLocal++;
                else if (set.pointsVisit > set.pointsLocal) setsWonVisit++;
            }
        });

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Volleyball Match Report - ${game.uniqueCode}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 15mm;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: white;
        }
        
        .report-container {
            max-width: 210mm;
            margin: 0 auto;
            border: 3px solid #000;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .header h2 {
            font-size: 18px;
            color: #555;
            margin-bottom: 10px;
        }
        
        .match-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
            padding: 15px;
            background: #f8f8f8;
            border: 1px solid #ddd;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
        }
        
        .info-label {
            font-weight: bold;
            font-size: 12px;
            color: #666;
            margin-bottom: 3px;
            text-transform: uppercase;
        }
        
        .info-value {
            font-size: 14px;
            color: #000;
        }
        
        .teams-section {
            margin-bottom: 25px;
        }
        
        .team-row {
            display: grid;
            grid-template-columns: 100px 1fr 100px;
            align-items: center;
            padding: 15px;
            border: 2px solid #000;
            margin-bottom: 10px;
            background: white;
        }
        
        .team-label {
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
        }
        
        .team-name {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }
        
        .team-sets {
            font-size: 24px;
            font-weight: bold;
            text-align: right;
        }
        
        .winner-badge {
            background: #28a745;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            margin-left: 10px;
            display: inline-block;
        }
        
        .sets-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        
        .sets-table th,
        .sets-table td {
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
        }
        
        .sets-table th {
            background: #333;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .sets-table td {
            font-size: 16px;
        }
        
        .sets-table .set-winner {
            background: #d4edda;
            font-weight: bold;
        }
        
        .sanctions-section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            padding: 8px;
            background: #333;
            color: white;
            text-transform: uppercase;
        }
        
        .sanctions-list {
            border: 1px solid #ddd;
            padding: 15px;
            min-height: 80px;
        }
        
        .sanction-item {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-bottom: 1px solid #eee;
        }
        
        .sanction-item:last-child {
            border-bottom: none;
        }
        
        .sanction-card {
            display: inline-block;
            width: 20px;
            height: 28px;
            border: 1px solid #000;
            margin-right: 8px;
        }
        
        .sanction-card.yellow {
            background: #ffc107;
        }
        
        .sanction-card.red {
            background: #dc3545;
        }
        
        .signatures-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #000;
        }
        
        .signature-box {
            text-align: center;
        }
        
        .signature-line {
            border-top: 1px solid #000;
            margin-top: 60px;
            padding-top: 8px;
            font-weight: bold;
        }
        
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .report-container {
                border: none;
                max-width: 100%;
            }
            
            @page {
                margin: 10mm;
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <h1>Official Volleyball Match Report</h1>
            <h2>Match Code: ${game.uniqueCode}</h2>
        </div>
        
        <div class="match-info">
            <div class="info-item">
                <span class="info-label">League</span>
                <span class="info-value">${game.league?.name || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Venue</span>
                <span class="info-value">${game.gameplace?.name || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Date</span>
                <span class="info-value">${game.startTime ? new Date(game.startTime).toLocaleString() : 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Season</span>
                <span class="info-value">${game.season?.name || 'N/A'}</span>
            </div>
        </div>
        
        <div class="teams-section">
            <div class="team-row">
                <span class="team-label">HOME</span>
                <span class="team-name">
                    ${game.initialSituation?.localTeam?.name || 'TBD'}
                    ${setsWonLocal > setsWonVisit ? '<span class="winner-badge">WINNER</span>' : ''}
                </span>
                <span class="team-sets">${setsWonLocal}</span>
            </div>
            
            <div class="team-row">
                <span class="team-label">AWAY</span>
                <span class="team-name">
                    ${game.initialSituation?.visitTeam?.name || 'TBD'}
                    ${setsWonVisit > setsWonLocal ? '<span class="winner-badge">WINNER</span>' : ''}
                </span>
                <span class="team-sets">${setsWonVisit}</span>
            </div>
        </div>
        
        <div class="section-title">Set by Set Results</div>
        <table class="sets-table">
            <thead>
                <tr>
                    <th>Set</th>
                    <th>Home Team</th>
                    <th>Away Team</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                ${setsArray.map((set, idx) => {
                    const isLocalWinner = set.pointsLocal > set.pointsVisit;
                    const duration = set.timeStart && set.timeEnd 
                        ? Math.round((new Date(set.timeEnd) - new Date(set.timeStart)) / 60000) + ' min'
                        : 'N/A';
                    
                    return `
                        <tr>
                            <td><strong>Set ${idx + 1}</strong></td>
                            <td class="${isLocalWinner ? 'set-winner' : ''}">${set.pointsLocal}</td>
                            <td class="${!isLocalWinner ? 'set-winner' : ''}">${set.pointsVisit}</td>
                            <td>${duration}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <div class="sanctions-section">
            <div class="section-title">Sanctions</div>
            <div class="sanctions-list">
                ${game.sanctionsList && game.sanctionsList.length > 0 
                    ? game.sanctionsList.map((sanction) => `
                        <div class="sanction-item">
                            <div>
                                <span class="sanction-card ${sanction.severity?.toLowerCase() || 'yellow'}"></span>
                                <strong>${sanction.team?.name || 'N/A'}</strong> - ${sanction.type}
                            </div>
                            <div>Score: ${sanction.marcador}</div>
                        </div>
                    `).join('')
                    : '<p style="text-align: center; color: #666;">No sanctions recorded</p>'
                }
            </div>
        </div>
        
        <div class="signatures-section">
            <div class="signature-box">
                <div class="signature-line">Referee Signature</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Official Signature</div>
            </div>
        </div>
        
        <div class="footer">
            <p>Official Volleyball Match Report | Generated on ${new Date().toLocaleString()}</p>
            <p>This document is an official record of the match and should be kept for league records</p>
        </div>
    </div>
    
    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    if (loading) return <Loader />;

    if (error) {
        return <div className="generate-error">{error}</div>;
    }

    if (games.length === 0) {
        return (
            <div className="generate-empty">
                <h2>No Finished Games</h2>
                <p>There are no finished games available to generate reports.</p>
            </div>
        );
    }

    return (
        <div className="generate-report-container">
            <h2 className="generate-title">Generate Match Report</h2>
            <p className="generate-subtitle">Select a finished game to generate an official volleyball match report PDF</p>
            
            <div className="games-grid">
                {games.map((game) => (
                    <div key={game.id} className="report-game-card">
                        <div className="report-game-header">
                            <span className="report-game-code">{game.uniqueCode}</span>
                            <span className="report-game-status">✓ Finished</span>
                        </div>
                        
                        <div className="report-game-teams">
                            <div className="report-team">
                                {game.initialSituation?.localTeam?.name || 'TBD'}
                            </div>
                            <div className="report-vs">VS</div>
                            <div className="report-team">
                                {game.initialSituation?.visitTeam?.name || 'TBD'}
                            </div>
                        </div>
                        
                        <div className="report-game-info">
                            <span>📍 {game.gameplace?.name || 'N/A'}</span>
                            <span>🏆 {game.league?.name || 'N/A'}</span>
                        </div>
                        
                        <button 
                            className="btn-generate-pdf"
                            onClick={() => generatePDF(game)}
                        >
                            📄 Generate PDF Report
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GenerateReport;
