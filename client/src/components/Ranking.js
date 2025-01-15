import React from 'react';
import Navbar from './Navbar';

const Ranking = () => {
  const rankingData = [
    { position: 1, user: "Alexander", points: 1500 },
    { position: 2, user: "Michael", points: 1400 },
    { position: 3, user: "JeremyNakano", points: 1300 },
    { position: 4, user: "Katherine", points: 1200 },
    { position: 5, user: "Alison", points: 1100 }
  ];

  return (
    <div>
      <Navbar />
      <div className="container">
        <section className="sectionRanking">
          <h1>Ranking</h1>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {rankingData.map((player) => (
                <tr key={player.position}>
                  <td>{player.position}</td>
                  <td>{player.user}</td>
                  <td>{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Ranking;