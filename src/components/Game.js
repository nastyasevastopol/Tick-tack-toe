import React from 'react';
import Round from './Round.js';
import Header from './header.js';
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roundNumber : 0, //номер раунда
            score: {        //очки 
                computer : 0,
                player : 0
            },
            roundsArray : [], //история игр (тут будет храниться время игры, кто победил или если была ничья)
            messageEndGame: ''
        };
        let data = new Date();
        let hour = data.getHours();
        let minutes = data.getMinutes();
        let seconds = data.getSeconds();
       
        this.state.roundsArray.push({
            hour: hour,
            minutes : minutes,
            seconds : seconds
        });

    }

    /**
     * Обработчик нажатия на кнопку "Новая игра" (в ходе раунда или после его завершения)
     * @param {Event} e 
     */
    onClickNewRound(e){ //если человек нажимает на кнопку "новая игра"
        e.stopPropagation();
        let data = new Date();
        let hour = data.getHours();
        let minutes = data.getMinutes();
        let seconds = data.getSeconds();
        this.state.roundsArray.push({
            hour: hour,
            minutes : minutes,
            seconds : seconds
        });
        this.setState({
            roundNumber: this.state.roundNumber + 1,
            roundsArray: this.state.roundsArray,
            messageEndGame: ''
        });
    }

    /**
     * Обработка окончания раунда (обновление счета, вывод сообщения)
     * @param {String} whoWin - переданное значение из компонента Round, кто победил в прошлом раунде
     */
    somebodyWin(whoWin){
        this.state.roundsArray[this.state.roundNumber].whoWin = whoWin;
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
        }
        else if (whoWin == 'player'){ //победил игрок
            this.setState({
                score: {
                    computer : lastScoreComputer,
                    player: lastScorePlayer + 1
                },
                roundsArray : this.state.roundsArray,
                messageEndGame: 'Вы выиграли, ура! Для начала новой игры нажмите кнопку "Новая игра"'
            });
        }
        else{   //ничья
            this.setState({
                roundsArray : this.state.roundsArray,
                messageEndGame: 'Ничья - интересный результат! Для начала новой игры нажмите кнопку "Новая игра"'
            });
            
        }
        
    }
    render() {
        let round;
        //отображаем кто будет ходить первым
        if (!(this.state.roundNumber % 2)){ // число раундов четное - первым ходит игрок
            round = this.state.roundsArray.map((round, index) => (index == this.state.roundNumber) ? <Round somebodyWin={this.somebodyWin.bind(this)} whoIsFirst='player'/> : '');
        }
        else { // нечетное - компьютер
            round = this.state.roundsArray.map((round, index) => (index == this.state.roundNumber) ? <Round somebodyWin={this.somebodyWin.bind(this)} whoIsFirst='computer'/> : '');
        }
        //отображаем историю игр
        let historyGames = 'это ваша первая игра';
        if (this.state.roundNumber > 0){
            historyGames = this.state.roundsArray.map((round, index) => 
                (index < this.state.roundNumber) ? 
                    <div className = "history-games__item"> {'' + round.hour + ':'+round.minutes +  ':'  + round.seconds + (round.whoWin=='player'? ' Победа' : (round.whoWin=='computer'?' Проигрыш' : ' Ничья' ))}</div> : '');
        }
           return <div className = "container">
                    <Header title='Крестики-нолики' description='Сыграем?' />  
                    <div>
                       {round}
                    </div>
                    <input className="button" type = "button" id="new-round-button" name="new-round-button" value="Новая игра" onClick = {this.onClickNewRound.bind(this)}/>
                    <div className = "infoGames">    
                        <div className="score">
                            <div className="score__title">
                                <div className="score__item" >Общий счет</div>
                            </div>
                            <div className="score__string">
                                    <div className="score__item" >Вы</div>
                                    <div className="score__item">Компьютер</div>
                            </div>
                            <div className="score__string">
                                    <div className="score__item" >{this.state.score.player}</div>
                                    <div className="score__item">{this.state.score.computer}</div>
                            </div>
                        </div>
                        <div className = "history-games">
                            <div className = "history-games__title">История игр</div>
                            {historyGames}
                        </div>
                    </div>
                    {(this.state.messageEndGame !='') ? 
                        <div id = "form-names" className = "form-names">
                            <div className = 'form-names__info'>{this.state.messageEndGame}</div>
                            <input className="button" type = "button" id="new-round-button1" name="new-round-button1" value="Новая игра" onClick = {this.onClickNewRound.bind(this)}/>
                        </div> 
                    : <div></div>} 
                </div>
    }
}

export default Game;