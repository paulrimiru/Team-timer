import * as React from 'react';
import './App.scss';
import './assets/scss/globals.scss';
import { AppState, TeamMate } from './interfaces';

import { team } from './fixtures';

class App extends React.Component<{}, AppState>{
    public timer:number = 0;
    public member:TeamMate;
    public state = {
      teamMates: team.map((member) => ({
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
      <div className="main-page__timer-position">
      <div className="main-page__timer-position__title">Timer</div>
      <div className="main-page__timer-div">
      <div className={
        this.state.timeLeft.seconds <= 15 ?
        "main-page__timer-div__time-critical" :
        "main-page__timer-div__time"
      }>
      {this.state.timeLeft.seconds}
      </div>
      <p className={
        this.state.timeLeft.seconds <= 15 ?
        "main-page__timer-div__second-critical":
        "main-page__timer-div__second"
        }>s</p>
      </div>
        </div>
        <div className="main-page__container">
          <div className="main-page__container__title">Activo Team Members</div>
          <div className="main-page__container__list">
            {
              this.state.teamMates.map((teamMember, index) => (
                <div
                  key={index}
                  className="main-page__container__list-item"
                  onClick={this.handleTeamMateTime(teamMember)
                  }>
                  <div className="main-page__list-item__name">{`${teamMember.name}`}</div>
                  {
                    teamMember.selected && <div>Speaking</div>
                  }
                  {
                    teamMember.isDone &&  <div className="main-page__container__check">&#x2714;</div>
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
    if (this.timer !== 0) {
      clearInterval(this.timer);
      this.stopTimer()
    }
    this.member = selectedMember;
    this.setState({
      time: 60
    })
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
      teamMates: [...this.state.teamMates].map((teamMember: any) => (
        teamMember.name === selectedMember.name
          ? { ...teamMember, isDone: false, selected: true}
          : { ...teamMember }
      )),
      time: this.state.time - 1,
      timeLeft: this.secondsToTime(this.state.time),
    });
  }
}

export default App;
