import React from 'react';
import Square from './Square.js';
class Round extends React.Component {
    constructor(props){
        super(props);
        let arraySquares = [];
        for (let index1 = 0; index1 < 3; index1++){
            arraySquares[index1] = [];
            for (var index2 = 0; index2 < 3; index2++){
                arraySquares[index1][index2] = 0;
            } 
        }
        this.state = {
            arraySquare: arraySquares,
            playerMotion: { //счетчики сколько элементов в строке/столбце/диагонали уже были заполнены человеком
                rows: [0,0,0],
                colums : [0,0,0],
                diagonals : [0,0]
            },
            computerMotion: { //счетчики сколько элементов в строке/столбце/диагонали уже были заполнены компьютером
                rows: [0,0,0],
                colums : [0,0,0],
                diagonals : [0,0]
            },
            whooseMotion: 'player',
            computerShoot: []
        }    
        if (props.whoIsFirst == 'player'){ //если первым ходит человек
            this.countOfFreeSquares = 9;
        }
        else { //если первым ходит компьютер
            this.state.whooseMotion = 'computer';
            this.computerFindIndexes();
            //компьютер походил
            //обновляем все счетчики
            this.state.computerMotion.rows[this.state.computerShoot[0]] += 1; 
            this.state.computerMotion.colums[this.state.computerShoot[1]] += 1; 
            if (this.state.computerShoot[0] == this.state.computerShoot[1]) 
                this.state.computerMotion.diagonals[0] += 1;
            if (this.state.computerShoot[0] == 3 - this.state.computerShoot[1] - 1)
                this.state.computerMotion.diagonals[1] += 1;
            this.countOfFreeSquares = 8;
        }
    }

    /**
     * Обработчик нажатия человека на одну из клеток (здесь же компьютер делает ответ)
     * @param {Event} e - событие нажатия на клетку
     * @param {Number} id - клеточка, на которую нажал человек
     */
    computerClick(e, id){ 
        e.stopPropagation();
        let arrIndexes = id.split('х'); //разделяем id на строку и столбец, которые были нажаты
        this.state.arraySquare[arrIndexes[0]][arrIndexes[1]] = 1;
        //человек походил
        //обновляем все счетчики
        this.state.playerMotion.rows[arrIndexes[0]] += 1; 
        this.state.playerMotion.colums[arrIndexes[1]] += 1; 
        if (arrIndexes[0] == arrIndexes[1])                 //нажал игрок на элемент на главной диагонали
            this.state.playerMotion.diagonals[0] += 1;
        if (arrIndexes[0] == 3 - arrIndexes[1] - 1) //нажал игрок на элемент на главной диагонали
            this.state.playerMotion.diagonals[1] += 1;
        this.countOfFreeSquares--;
        this.setState({arraySquare: this.state.arraySquare, 
                        playerMotion: this.state.playerMotion,
                        whooseMotion: 'player'});
        if (this.check3inLine('player')){         //проверяем что нет трех точек в одну полосу у человека
            //(таймаут чтобы после победы/поражения человек мог увидеть свох ход/ход компьютера)
            setTimeout(()=>this.props.somebodyWin('player'), 500);
            }
        else if (this.countOfFreeSquares == 0){ //человек походил, занял последнюю клетку, но не выиграл - значит ничья 
            setTimeout(()=>this.props.somebodyWin('nobody'), 500);
        }
        else { //человек не выиграл и клетки пустые не закончились, играем дальше
            this.computerFindIndexes();
            this.state.computerMotion.rows[this.state.computerShoot[0]] += 1; 
            this.state.computerMotion.colums[this.state.computerShoot[1]] += 1; 
            if (this.state.computerShoot[0] == this.state.computerShoot[1])
                this.state.computerMotion.diagonals[0] += 1;
            if (this.state.computerShoot[0] == 3 - this.state.computerShoot[1] - 1)
                this.state.computerMotion.diagonals[1] += 1;
            this.countOfFreeSquares--;
            this.setState({arraySquare: this.state.arraySquare, 
                computerMotion: this.state.computerMotion,
                whooseMotion: 'computer',
                computerShoot: this.state.computerShoot});
            if (this.check3inLine('computer')) //проверяем что нет трех точек в одну полосу у компьютера
            setTimeout(()=>this.props.somebodyWin('computer'), 500);
            else if (this.countOfFreeSquares == 0){ //компьютера походил, занял последнюю клетку, но не выиграл - значит ничья
                setTimeout(()=>this.props.somebodyWin('nobody'), 500);
            }
        }      
    }
    
    /**
     * Функция поиска максимума в массиве
     * @param {Array} numArray массив для поиска
     */
    getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
     }

    /**
     * Функция генерации случайного места для хода компьютера
     */
    randomShoot(){
        let index1 = this.getRandom(2);
        let index2 = this.getRandom(2);
        if (this.checkPlace(index1,index2)){
            let params = {
                index1: index1,
                index2: index2
            }
            return params;
        }
        else return this.randomShoot();
    }
    getRandom(max) {
        return Math.floor(Math.random() * (max + 1));
    }
    /**
     * функция для проверки, есть ли уже в этом месте крестик или нолик
     * @param {*} index1 индекс по строке
     * @param {*} index2 индекс по столбцу
     */
    checkPlace(index1,index2){
        if (this.state.arraySquare[index1][index2] == 0){
            return true;
        }
        return false;
    }

    /**
     * Функция проверки, не выиграл ли человек/компьютер (нет ли у них трех х или 0 в ряд)
     * @param {String} whoChecked 
     */
    check3inLine(whoChecked){ //кого проверяем на три в один ряд
        if (whoChecked == 'player'){ 
            for (let index1 = 0; index1 < 3; index1++) 
                if ((this.state.playerMotion.rows[index1] == 3)||(this.state.playerMotion.colums[index1] == 3)) 
                    return true;
            if (((this.state.playerMotion.diagonals[0] == 3)||(this.state.playerMotion.diagonals[1] == 3)))
                return true;
            return false;
        }
        else { 
            for (let index1 = 0; index1 < 3; index1++) 
            if ((this.state.computerMotion.rows[index1] == 3)||(this.state.computerMotion.colums[index1] == 3)) 
                return true;
            if (((this.state.computerMotion.diagonals[0] == 3)||(this.state.computerMotion.diagonals[1] == 3)))
                return true;
            return false;
        }
    }

    /**
     * Функция хода компьютера
     */
    computerFindIndexes(){
        //ходим компьютером
        let maxofColumsComp = this.getMaxOfArray(this.state.computerMotion.colums);
        let maxofRowsComp = this.getMaxOfArray(this.state.computerMotion.rows);
        let maxofDiagComp = this.getMaxOfArray(this.state.computerMotion.diagonals);

        let maxofColumsPlayer= this.getMaxOfArray(this.state.playerMotion.colums);
        let maxofRowsPlayer = this.getMaxOfArray(this.state.playerMotion.rows);
        let maxofDiagPlayer = this.getMaxOfArray(this.state.playerMotion.diagonals);
        let maxIndex;
        if (Math.max(maxofColumsComp, maxofRowsComp, maxofDiagComp) == 2){
            if ((maxofColumsComp == 2)&&(!this.state.playerMotion.colums[this.state.computerMotion.colums.indexOf(Math.max.apply(Math, this.state.computerMotion.colums))])){
                //самое большое число  - по горизонтали
                maxIndex = this.state.computerMotion.colums.indexOf(Math.max.apply(Math, this.state.computerMotion.colums));
                for (let index = 0; index < 3; index++){
                    if (this.checkPlace(index,maxIndex)){
                            this.state.arraySquare[index][maxIndex] = 2;
                            this.state.computerShoot[0] = index;
                            this.state.computerShoot[1] = maxIndex;
                        break;
                    }
                }
            }
            else if ((maxofRowsComp == 2)&&(!this.state.playerMotion.rows[this.state.computerMotion.rows.indexOf(Math.max.apply(Math, this.state.computerMotion.rows))])){
                //самое большое число  - по горизонтали
                maxIndex = this.state.computerMotion.rows.indexOf(Math.max.apply(Math, this.state.computerMotion.rows));
                for (let index = 0; index < 3; index++){
                    if (this.checkPlace(maxIndex,index)){
                            this.state.arraySquare[maxIndex][index] = 2;
                            this.state.computerShoot[0] = maxIndex;
                            this.state.computerShoot[1] = index;
                        break;
                    }
                }
            }
            else if ((maxofDiagComp == 2)&&(!this.state.playerMotion.diagonals[this.state.computerMotion.diagonals.indexOf(Math.max.apply(Math, this.state.computerMotion.diagonals))])){
                //самое большое число  - на диагонали
                maxIndex = this.state.computerMotion.diagonals.indexOf(Math.max.apply(Math, this.state.computerMotion.diagonals));
                    if (maxIndex == 0){
                        //на главной диагонали
                        for (let index = 0; index < 3; index++){
                            if (this.checkPlace(index,index)){
                                    this.state.arraySquare[index][index] = 2;
                                    this.state.computerShoot[0] = index;
                                    this.state.computerShoot[1] = index;
                                break;
                            }
                        }
                    }
                    else{
                        //на побочной диагонали
                        for (let index = 0; index < 3; index++){
                            let index2 = 2 - index;
                                    if (this.checkPlace(index,index2)){
                                            this.state.arraySquare[index][index2] = 2;
                                            this.state.computerShoot[0] = index;
                                            this.state.computerShoot[1] = index2;
                                        this.state.playerMotion.diagonals[1] = 1;
                                        break;
                                    }
                        }
                    }
            }
            else {
                let indexes = this.randomShoot();
                        this.state.arraySquare[indexes.index1][indexes.index2] = 2;
                        this.state.computerShoot[0] = indexes.index1;
                        this.state.computerShoot[1] = indexes.index2; 
            }
        }
        else {
            if ((maxofColumsPlayer == 2)&&(!this.state.computerMotion.colums[this.state.playerMotion.colums.indexOf(Math.max.apply(Math, this.state.playerMotion.colums))])){
                maxIndex = this.state.playerMotion.colums.indexOf(Math.max.apply(Math, this.state.playerMotion.colums));
                for (let index = 0; index < 3; index++){
                    
                    if (this.checkPlace(index,maxIndex)){
                            this.state.arraySquare[index][maxIndex] = 2;
                            this.state.computerShoot[0] = index;
                            this.state.computerShoot[1] = maxIndex;
                        this.state.playerMotion.colums[maxIndex] = 1;
                        break;
                    }
                }
            }
            else if ((maxofRowsPlayer == 2)&&(!this.state.computerMotion.rows[this.state.playerMotion.rows.indexOf(Math.max.apply(Math, this.state.playerMotion.rows))])){
                maxIndex = this.state.playerMotion.rows.indexOf(Math.max.apply(Math, this.state.playerMotion.rows));
                for (let index = 0; index < 3; index++){
                    if (this.checkPlace(maxIndex,index)){
                            this.state.arraySquare[maxIndex][index] = 2;
                            this.state.computerShoot[0] = maxIndex;
                            this.state.computerShoot[1] = index;
                        this.state.playerMotion.rows[maxIndex] = 1;
                        break;
                    }
                }
            }
            else if ((maxofDiagPlayer == 2)&&(!this.state.computerMotion.diagonals[this.state.playerMotion.diagonals.indexOf(Math.max.apply(Math, this.state.playerMotion.diagonals))])){
                maxIndex = this.state.playerMotion.diagonals.indexOf(Math.max.apply(Math, this.state.playerMotion.diagonals));
                if (maxIndex == 0){
                    //на главной диагонали
                    for (let index = 0; index < 3; index++){
                        if (this.checkPlace(index,index)){
                                this.state.arraySquare[index][index] = 2;
                                this.state.computerShoot[0] = index;
                                this.state.computerShoot[1] = index;
                            this.state.playerMotion.diagonals[0] = 1;
                            break;
                        }
                    }
                }
                else{
                    //на побочной диагонали
                    for (let index = 0; index < 3; index++){
                        let index2 = 2 - index;
                                if (this.checkPlace(index,index2)){
                                        this.state.arraySquare[index][index2] = 2;
                                        this.state.computerShoot[0] = index;
                                        this.state.computerShoot[1] = index2;
                                    this.state.playerMotion.diagonals[1] = 1;
                                    break;
                                }
                    }
                }
            } 
            else {
                let indexes = this.randomShoot();
                    this.state.arraySquare[indexes.index1][indexes.index2] = 2;
                    this.state.computerShoot[0] = indexes.index1;
                    this.state.computerShoot[1] = indexes.index2;                
            }
            
        }
        
    }
    /**
     * обеспечивает формирование массива для отрисовки игрового поля в соответствии с состоянием мастрицы в данный момент
     */
    createSquares(){ 
        let listSquares1;
        if (this.state.whooseMotion == 'computer') {
            listSquares1 = this.state.arraySquare.map((row, indexrow)=>{
                return <div className="field__row">     
                    {row.map((item, index) => { 
                        return <Square 
                            id = {indexrow + 'х' + index}
                            findID = {this.state.computerShoot[0] + 'х' + this.state.computerShoot[1]}
                            value = {item}
                            wasShoot = {false}
                            wasAlreadyShoot = {false}
                            computerClick = {this.computerClick.bind(this)}/>;
                    })}
                        </div>;     
            });  
        }
        else {
            listSquares1 = this.state.arraySquare.map((row, indexrow)=>{
                return <div className="field__row">     
                    {row.map((item, index) => { 
                        return <Square 
                            id = {indexrow + 'х' + index}
                            value = {item}
                            wasShoot = {false}
                            wasAlreadyShoot = {false}
                            computerClick = {this.computerClick.bind(this)}/>;
                    })}
                        </div>;     
            });  
        }
        return listSquares1;
    }

    render() {
        let listSquares1 = this.createSquares();
        let strWhooseMotion = '';
        if (this.countOfFreeSquares >= 8){
            strWhooseMotion = (this.props.whoIsFirst=='player')? 'Вы ходите первым' : 'Компьютер походил первым';
        }
        else if (!(this.countOfFreeSquares % 2)){//четное число ходов осталось
            strWhooseMotion = (this.props.whoIsFirst=='player')? 'Ход компьютера' : 'Ваш ход';
        }
        else {
            strWhooseMotion = (this.props.whoIsFirst=='player')? 'Ваш ход' : 'Ход компьютера';
        }
        return <div> 
                    <div className = 'round-info'>{strWhooseMotion}</div>
                    <div className  = 'field'>
                        {listSquares1 || ''}
                    </div>
                </div>
        }
}

export default Round;