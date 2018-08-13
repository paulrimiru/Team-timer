import * as React from 'react';
import './App.scss';


class App extends React.Component {
  public state = {
    teamMates: ['Allan Ibutiti',
    'Damilare Olatuboson',
    'Ayobami Adelakun',
    'Ejiro Ogidigbo',
    'Gbenga Oshinaga',
    'Kati Frantz',
    'Kayode Ayelegun',
    'Michael Umanah',
    'Victor Adukwu',
    'Felix Mathia',
    'Paul Kariuki',
    'Francis Kipchumba',
    'Olayemi',
    'Sonia',
    'Iyke',
    'Anaeze',
    'Roger',
    'Stephen',
    'Olusola',].map((member) => ({
      isDone: false,
      name: member,
    })),
    time: 60,
  }

  public render() {
    return (
      <div className="main-page">
        <div className="main-page__container">
          <div className="main-page__container__title">Activo Team Timer</div>
          <div
            className="main-page__container__list"
            onClick={this.handleTeamMateTime}
          >
            {
              this.state.teamMates.map((teamMember) => (
                <div className="main-page__list-item">
                  <div className="main-page__list-item__name">{teamMember.name}</div>
                  <div className="main-page__list-item__time">{this.state.time}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  private handleTeamMateTime = (selectedMember) => {
    setTimeout(() => {
      if (this.state.time !== 0) {
        this.setState({
            time: this.state.time -1,
        })
      }
      else {
        this.setState({
          teamMates: [...this.state.teamMates].map((teamMate) => (
            teamMate.name === selectedMember.name
              && { ...teamMate, isDone: true }
          ))
        })
      }
    }, 1000);
  }
}

export default App;
