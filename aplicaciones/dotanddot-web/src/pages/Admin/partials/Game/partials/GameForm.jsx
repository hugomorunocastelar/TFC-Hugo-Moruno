import React, { useState } from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';
import './GameForm.css';

const CATEGORIES = [
    'PRE_BENJAMIN', 'BENJAMIN', 'ALEVIN', 'INFANTILE', 
    'CADET', 'YOUTH', 'JUNIOR', 'ABSOLUTE', 'SENIOR'
];

const DIVISIONS = ['MIXED', 'FEMININE', 'MASCULINE'];

const RELEVANCE_LEVELS = [
    { value: 1, label: 'Common' },
    { value: 2, label: 'Interest' },
    { value: 3, label: 'Disputed' },
    { value: 4, label: 'Competition' },
    { value: 5, label: 'Final' }
];

function GameForm({ formData, teams, leagues, competitions, cities, referees, onChange, onSubmit, onCancel }) {
    const [activeSection, setActiveSection] = useState('basic');

    
    const generateUniqueCodePreview = () => {
        if (!formData.leagueId) {
            return 'Select a league to see code preview';
        }
        
        const league = leagues.find(l => l.id == formData.leagueId);
        if (!league) {
            return 'League not found';
        }
        
        
        
        return `${league.codePrefix}XXX000 (auto-incremented)`;
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'basic':
                return (
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        
                        {!formData.id && (
                            <div className="unique-code-preview">
                                <label>
                                    <span>Game Code Preview (auto-generated)</span>
                                    <input 
                                        type="text" 
                                        value={generateUniqueCodePreview()} 
                                        readOnly 
                                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                                    />
                                </label>
                            </div>
                        )}
                        
                        <div className="form-grid">
                            <label>
                                <span>League*</span>
                                <select name="leagueId" value={formData.leagueId} onChange={onChange} required>
                                    <option value="">Select a league</option>
                                    {leagues.map(league => (
                                        <option key={league.id} value={league.id}>{league.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Relevance*</span>
                                <select 
                                    name="relevance" 
                                    value={formData.relevance} 
                                    onChange={onChange}
                                    required
                                >
                                    <option value="">Select relevance</option>
                                    {RELEVANCE_LEVELS.map(level => (
                                        <option key={level.value} value={level.value}>
                                            {level.value} - {level.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Category*</span>
                                <select name="category" value={formData.category} onChange={onChange} required>
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Division (Gender)</span>
                                <select name="division" value={formData.division} onChange={onChange}>
                                    <option value="">Select division</option>
                                    {DIVISIONS.map(div => (
                                        <option key={div} value={div}>{div}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Competition*</span>
                                <select name="competitionId" value={formData.competitionId} onChange={onChange} required>
                                    <option value="">Select competition</option>
                                    {competitions.map(comp => (
                                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>City*</span>
                                <select name="cityId" value={formData.cityId} onChange={onChange} required>
                                    <option value="">Select city</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="full-width">
                                <span>Match Date*</span>
                                <input 
                                    type="date" 
                                    name="date" 
                                    value={formData.date} 
                                    onChange={onChange} 
                                    required 
                                />
                            </label>
                        </div>
                    </div>
                );

            case 'teams':
                return (
                    <div className="form-section">
                        <h3>Teams</h3>
                        <div className="form-grid">
                            <label>
                                <span>Home Team*</span>
                                <select 
                                    name="localTeamId" 
                                    value={formData.localTeamId} 
                                    onChange={onChange} 
                                    required
                                >
                                    <option value="">Select home team</option>
                                    {teams.filter(t => t.id != formData.visitTeamId).map(team => (
                                        <option key={team.id} value={team.id}>
                                            {team.name} - {team.idClub?.name || 'No club'}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Away Team*</span>
                                <select 
                                    name="visitTeamId" 
                                    value={formData.visitTeamId} 
                                    onChange={onChange} 
                                    required
                                >
                                    <option value="">Select away team</option>
                                    {teams.filter(t => t.id != formData.localTeamId).map(team => (
                                        <option key={team.id} value={team.id}>
                                            {team.name} - {team.idClub?.name || 'No club'}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                );

            case 'referees':
                return (
                    <div className="form-section">
                        <h3>Referee Team</h3>
                        <div className="form-grid">
                            <label>
                                <span>Main Referee*</span>
                                <select name="principalRefereeId" value={formData.principalRefereeId} onChange={onChange} required>
                                    <option value="">Select main referee</option>
                                    {referees.map(ref => (
                                        <option key={ref.id} value={ref.id}>
                                            {ref.dni?.name || `Referee ${ref.id}`} - {ref.noLicense}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Second Referee</span>
                                <select name="secondaryRefereeId" value={formData.secondaryRefereeId} onChange={onChange}>
                                    <option value="">Not assigned</option>
                                    {referees.filter(r => r.id != formData.principalRefereeId).map(ref => (
                                        <option key={ref.id} value={ref.id}>
                                            {ref.dni?.name || `Referee ${ref.id}`} - {ref.noLicense}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Scorer</span>
                                <select name="scorerId" value={formData.scorerId} onChange={onChange}>
                                    <option value="">Not assigned</option>
                                    {referees.filter(r => r.id != formData.principalRefereeId && r.id != formData.secondaryRefereeId).map(ref => (
                                        <option key={ref.id} value={ref.id}>
                                            {ref.dni?.name || `Referee ${ref.id}`} - {ref.noLicense}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Line Judge 1</span>
                                <select name="lineReferee1Id" value={formData.lineReferee1Id} onChange={onChange}>
                                    <option value="">Not assigned</option>
                                    {referees.map(ref => (
                                        <option key={ref.id} value={ref.id}>
                                            {ref.dni?.name || `Referee ${ref.id}`} - {ref.noLicense}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Line Judge 2</span>
                                <select name="lineReferee2Id" value={formData.lineReferee2Id} onChange={onChange}>
                                    <option value="">Not assigned</option>
                                    {referees.map(ref => (
                                        <option key={ref.id} value={ref.id}>
                                            {ref.dni?.name || `Referee ${ref.id}`} - {ref.noLicense}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Line Judge 3</span>
                                <select name="lineReferee3Id" value={formData.lineReferee3Id} onChange={onChange}>
                                    <option value="">Not assigned</option>
                                    {referees.map(ref => (
                                        <option key={ref.id} value={ref.id}>
                                            {ref.dni?.name || `Referee ${ref.id}`} - {ref.noLicense}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Line Judge 4</span>
                                <select name="lineReferee4Id" value={formData.lineReferee4Id} onChange={onChange}>
                                    <option value="">Not assigned</option>
                                    {referees.map(ref => (
                                        <option key={ref.id} value={ref.id}>
                                            {ref.dni?.name || `Referee ${ref.id}`} - {ref.noLicense}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                );



            default:
                return null;
        }
    };

    return (
        <div className='game-form-container'>
            <div className='game-form-header'>
                <h2>{formData.id ? 'Edit Match' : 'New Match'}</h2>
            </div>

            <div className='game-form-tabs'>
                <button 
                    className={activeSection === 'basic' ? 'active' : ''} 
                    onClick={() => setActiveSection('basic')}
                    type="button"
                >
                    Basic
                </button>
                <button 
                    className={activeSection === 'teams' ? 'active' : ''} 
                    onClick={() => setActiveSection('teams')}
                    type="button"
                >
                    Teams
                </button>
                <button 
                    className={activeSection === 'referees' ? 'active' : ''} 
                    onClick={() => setActiveSection('referees')}
                    type="button"
                >
                    Referees
                </button>
            </div>

            <form onSubmit={onSubmit} className='game-form'>
                {renderSection()}

                <div className='game-form-buttons'>
                    {formData.id ? <UpdateButton type="submit" /> : <CreateButton type="submit" />}
                    <CancelButton onClick={onCancel} />
                </div>
            </form>
        </div>
    );
}

export default GameForm;
