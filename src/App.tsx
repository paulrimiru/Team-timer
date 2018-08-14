import * as React from 'react';
import './App.scss';
import { AppState, TeamMate } from './interfaces';

class App extends React.Component<{}, AppState>{
    public timer:number = 0;
    public member:TeamMate;
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
      'Olayemi Lawal',
      'Sonia Karungi',
      'Iyke Nwankwo',
      'Anaeze Nsoffor',
      'Roger Okello',
      'Stephen Akinyemi',
      'Olusola Oseni',
      'Anyama Richard',
      'Idrees Ibraheem'
    ].map((member) => ({
        isDone: false,
        name: member,
        selected: false,
      })),
      time: 60,
      timeLeft: {
        "hours": 0,
        "minute": 0,
        "seconds": 0
      },
    }

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="main-page">
        <div className="main-page__container">
          <div className="main-page__container__title">Activo Team Timer</div>
          <div className="main-page__container__time">{this.state.timeLeft.seconds} Seconds</div>
          <div className="main-page__container__done" onClick={this.stopTimer}>Done</div>
          <div className="main-page__container__list">
            {
              this.state.teamMates.map((teamMember) => (
                <div
                  className={`main-page__container__list-item${teamMember.isDone ? '-done': ''}`}
                  onClick={this.handleTeamMateTime(teamMember)}>
                  <div className="main-page__list-item__name">{`${teamMember.name}`}</div>
                  {
                    teamMember.selected && <div>Speaking</div>
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  private handleTeamMateTime = (selectedMember: TeamMate) => (event: any) => {
    this.member = selectedMember;
    this.setState({
      teamMates: [...this.state.teamMates].map((teamMember: any) => (
        teamMember.name === selectedMember.name
          ? { ...teamMember, selected: true }
          : { ...teamMember, selected: false }
      ))
    })
    this.startTimer(selectedMember);
  }

  private secondsToTime = (secs: any) => {
    const hours = Math.floor(secs / (60 * 60));
  
    const minutesDivisor = secs % (60 * 60);
    const minutes = Math.floor(minutesDivisor / 60);
  
    const secondsDivisor = minutesDivisor % 60;
    const seconds = Math.ceil(secondsDivisor);
  
    const obj = {
      "hours": hours,
      "minute": minutes,
      "seconds": seconds
    };
    return obj;
  }

  private startTimer = (selectedMember: TeamMate) => {
    if (this.state.time < 1) {
      this.setState({
        time: 3
      })
    }
    this.timer = setInterval(this.countDown(selectedMember), 1000) as any;
  }

  private stopTimer = () => {
    clearInterval(this.timer);
    this.setState({
      teamMates: [...this.state.teamMates].map((teamMember: any) => (
        teamMember.name === this.member.name
          ? { ...teamMember, isDone: true, selected: false}
          : { ...teamMember }
      )),
      time: 60,
    })
  }

  private countDown = (selectedMember: TeamMate) => () => {
    if (this.state.time === 0) { 
      clearInterval(this.timer);
      this.setState({
        teamMates: [...this.state.teamMates].map((teamMember: any) => (
          teamMember.name === selectedMember.name
            ? { ...teamMember, isDone: true, selected: false}
            : { ...teamMember }
        ))
      })
    }

    this.setState({
      time: this.state.time - 1,
      timeLeft: this.secondsToTime(this.state.time),
    });
  }
}

export default App;
