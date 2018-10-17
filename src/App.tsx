/* tslint:disable */
import * as _ from "lodash";
import * as React from 'react';
import * as toastr from 'toastr';
import './App.scss';
import './assets/scss/globals.scss';
import { AppState, TeamMate } from './interfaces';


import { initializeApp } from 'firebase';
import { dbConfig } from './Config';
class App extends React.Component<{}, AppState>{
  public timer:number = 0;
  public member:TeamMate;
  public done = false;
  public state = {
    teamMates: [] as any,
    time: 60,
    timeLeft: {
      "hours": 0,
      "minute": 0,
      "seconds": 0
    },
    memberName: '',
  }
  public app:any;
  public database:any;

  constructor(props: any) {
    super(props);
    this.app = initializeApp(dbConfig);
    this.database =  this.app.database().ref().child('members');
  }

  public componentDidMount() {
    this.getTeamMembers()
  }

  public getTeamMembers = () => {
    this.database.on('value', (snap: any)=> {
      const teamList = snap.val();
      this.setState({
        teamMates: Object.keys(teamList).map((memberKey: any) => ({
          id: memberKey,
          isDone: false,
          isPaused: false,
          name: teamList[memberKey],
          selected: false,
          time: 60,
        })),
      })
    })
  }

  public onTeamMemberChange = (event: any) => {
    this.setState({
      memberName: event.target.value,
    })
  }

  public onTeamMemberSubmit = (event: any) => {
    if (this.state.memberName !== '') {
      this.database.push(this.state.memberName);
      this.setState({
        memberName: '',
      });
      toastr.info(`Added ${this.state.memberName}`)
    }
  }

  public deleteMember = (teamMember: any) => () => {
    this.database.child(teamMember.id).remove();
    toastr.info(`${teamMember.name} removed`)
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
              }>
                s
              </p>
            </div>
          </div>
          <div className="main-page__container">
            <div className="main-page__container__title">Activo Team Members</div>
            <div className="main-page__container__list">
              {
                this.state.teamMates.map((teamMember: any, index: any) => (
                  <div
                    key={index}
                    className="main-page__container__list-item"
                  >
                    <div
                      className="main-page__container__list-item-container"
                      onClick={this.handleTeamMateTime(teamMember)}>
                        <div className="main-page__list-item__name">{`${teamMember.name}`}</div>
                        {
                          teamMember.selected 
                            ? <div>Speaking</div> 
                            : teamMember.isPaused && !teamMember.isDone && <div>&#10074; &#10074;</div>
                        }
                        {
                          teamMember.isDone &&  <div className="main-page__container__check">&#x2714;</div>
                        }
                    </div>
                    <img
                      className="main-page__container__delete-icon"
                      src="https://res.cloudinary.com/mikekrantz/image/upload/v1537265689/delete.svg"
                      onClick={this.deleteMember(teamMember)}/>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="main-page__input-container">
              <input
                type="text"
                className="main-page__input-container__input"
                placeholder="Team member name"
                value={this.state.memberName}
                onChange={this.onTeamMemberChange}/>
              <div
                className="main-page__input-container__submit-button"
                onClick={this.onTeamMemberSubmit}
              >
                Add Member
              </div>
            </div>
        </div>
    );
  }

  private handleTeamMateTime = (selectedMember: TeamMate) => (event: any) => {
    if (this.member && selectedMember.name === this.member.name) {
      if(this.timer === 0 && selectedMember.time > 0){
        this.setState({
          teamMates: [...this.state.teamMates].map((teamMember: any) => (
            teamMember.name === selectedMember.name
              ? { ...teamMember, selected: true }
              : { ...teamMember, selected: false }
          ))
        })
        this.startTimer(selectedMember);
      } else {
        clearInterval(this.timer);
        this.timer = 0;
        this.setState({
          teamMates: [...this.state.teamMates].map((teamMember: any) => (
            teamMember.name === selectedMember.name
              ? { ...teamMember, selected: false, isPaused: !teamMember.isPaused }
              : { ...teamMember, selected: false }
          ))
        })
      }
    } else {
      this.setState({
        teamMates: [...this.state.teamMates].map((teamMember: any) => (
          teamMember.name === selectedMember.name
            ? { ...teamMember, selected: true }
            : { ...teamMember, selected: false }
        ))
      })
      this.startTimer(selectedMember);
    }
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
      this.timer = 0;
      this.stopTimer()
    }
    this.member = selectedMember;
    this.timer = setInterval(this.countDown(selectedMember), 1000) as any;
  }

  private stopTimer = () => {
    clearInterval(this.timer);
    this.timer = 0;
    this.setState({
      teamMates: [...this.state.teamMates].map((teamMember: any) => (
        teamMember.name === this.member.name
          ? { ...teamMember, isDone: true, selected: false, time: 60}
          : { ...teamMember }
      ))
    })
  }

  private countDown = (selectedMember: TeamMate) => () => {
    if (selectedMember.time === 0 ) {
      clearInterval(this.timer);
      this.timer = 0;
      this.setState({
        teamMates: [...this.state.teamMates].map((teamMember: any) => (
          teamMember.name === selectedMember.name
            ? { ...teamMember, isDone: true, selected: false}
            : { ...teamMember }
        ))
      })
    }
    
    this.setState(()=>this.setSelected(this.state.teamMates,selectedMember));
  }


  private setSelected(teamMembers:[TeamMate],selectedMember:TeamMate){
      const member =   _.find(teamMembers,{name:selectedMember.name})
      return {
       teamMates: [...teamMembers].map((teamMember: any) => (
        teamMember.name === selectedMember.name
          ? { ...teamMember, isDone: false, selected: true, time: teamMember.time === 0 ? 0 : teamMember.time -1}
          : { ...teamMember }
      )),
       timeLeft: this.secondsToTime(member.time)
     }
  }
}

export default App;
