import React from 'react';
import Round from './Round.js';
import Header from './header.js';
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roundNumber : 1, //номер раунда
            score: { //очки 
                computer : 0,
                player : 0
            },
            roundsArray : [], //история игр (тут будет храниться время игры, кто победил или если была ничья)
            messageEndGame: ''
        }
        //roundWasFinish : false,
    }
    onClickNewRound(e){ //если человек нажимает на кнопку "новая игра"
        e.stopPropagation();
        let data = new Date();
        let hour = data.getHours();
        let minutes = data.getMinutes();
        let seconds = data.getSeconds();
        if (this.state.roundNumber==1){

        }
        else{
            this.state.roundsArray[this.state.roundNumber-1].whoWin = 'nobody'; 
        }
        this.state.roundsArray.push({
            hour: hour,
            minutes : minutes,
            seconds : seconds
        });
        this.setState({
            roundNumber: this.state.roundNumber++,
            roundsArray: this.state.roundsArray
        });
    }

    somebodyWin(whoWin){
        //эту функцию лучше переписать с использованием case
        this.state.roundsArray[this.state.roundNumber - 1].whoWin = whoWin;
        let lastScoreComputer = this.state.score.computer;
        let lastScorePlayer = this.state.score.player;
        if (whoWin == 'computer'){

            this.setState({ //победил компьютер
                score: {
                    computer : lastScoreComputer + 1,
                    player: lastScorePlayer
                },
                roundsArray : this.state.roundsArray,
                messageEndGame: 'Вы проиграли, увы. Для начала новой игры нажмите кнопку "Новая игра"'
            });
            // console.log("комп победил");
        }
        else if (whoWin == 'player'){ //победил игрок
            this.setState({
                score: {
                    computer : lastScoreComputer,
                    player: lastScorePlayer + 1
                },
                roundsArray : this.state.roundsArray,
                messageEndGame: 'Вы выиграли, ура! Поздравляем! Для начала новой игры нажмите кнопку "Новая игра"'
            });
            // console.log("Игрок победил");
        }
        else{//ничья
            this.setState({
                roundsArray : this.state.roundsArray,
                messageEndGame: 'Ничья - это интересный результат! Для начала новой игры нажмите кнопку "Новая игра"'
            });
            
        }
        
    }
    render() {
        console.log(this.state.messageEndGame);
        //playerPlays должно меняться в зависимости от выбора игрока чем он играет (надо сделать select)
           return <div>
                    <Header title='Крестики-нолики' description='Сыграем?' />  
                    <div>
                        <Round somebodyWin = {this.somebodyWin.bind(this)} playerPlays='x'/>
                    </div>
                    <input className="form-names__button form-button" type = "button" id="add-person-button" name="add-person-button" value="Новая игра" onClick = {this.onClickNewRound.bind(this)}/>
                </div>
    }
}

export default Game;