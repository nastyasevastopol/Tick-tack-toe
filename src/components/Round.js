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
            playerPlays: props.playerPlays, //чем играет человек - крестиками или ноликами
            playerMotion: { //может мы это будем обновлять для начала новой игры
                rows: [0,0,0],
                colums : [0,0,0],
                diagonals : [0,0]
            },
            computerMotion: { //может мы это будем обновлять для начала новой игры
                rows: [0,0,0],
                colums : [0,0,0],
                diagonals : [0,0]
            },
            countOfFreeSquares : 8,
            whooseMotion: 'player',
            computerShoot: []
        }    
    }

    computerClick(e, id){ //обработчик нажатия человека на одну из клеток
        //
        //если не осталось клеток больше
        //проверить не выиграл ли человек
        //somebodyWin вызвать
        e.stopPropagation();
        let arrIndexes = id.split('х');
        // debugger;
        if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками
            this.state.arraySquare[arrIndexes[0]][arrIndexes[1]] = 1;
        }
        else {//игрок выбрал играть ноликами
            this.state.arraySquare[arrIndexes[0]][arrIndexes[1]] = 2;
        }
        //человек походил
        //обновляем все счетчики
        this.state.playerMotion.rows[arrIndexes[0]] += 1; //нажал игрок на элемент в строке
        this.state.playerMotion.colums[arrIndexes[1]] += 1; //нажал игрок на элемент в столбце
        if (arrIndexes[0] == arrIndexes[1]) //нажал игрок на элемент на главной диагонали
            this.state.playerMotion.diagonals[0] += 1;
        if (this.state.computerShoot[0] == 3 - this.state.computerShoot[1] - 1) //нажал игрок на элемент на главной диагонали
            this.state.playerMotion.diagonals[1] += 1;

        //НЕ УВЕРЕНА ЧТО SETSTATE ТУТ НЕ ЗАЦИКЛИТ
        this.setState({arraySquare: this.state.arraySquare, 
                        playerMotion: this.state.playerMotion,
                        countOfFreeSquares: this.state.countOfFreeSquares-1,
                        whooseMotion: 'player'});

                                                                                                                // console.log(this.state.arraySquare);
                                                                                                                // console.log(this.state.playerMotion);

        //проверяем что нет трех точек в одну полосу у человека
        if (this.check3inLinePlayer('player'))
                this.props.somebodyWin('player');
        else if (this.state.countOfFreeSquares == 0){ //человек походил, занял последнюю клетку, но не выиграл - значит ничья
                this.props.somebodyWin('nobody');
        }

        //ходим компьютером
        let maxofColumsComp = this.getMaxOfArray(this.state.computerMotion.colums);
        let maxofRowsComp = this.getMaxOfArray(this.state.computerMotion.rows);
        let maxofDiagComp = this.getMaxOfArray(this.state.computerMotion.diagonals);

        let maxofColumsPlayer= this.getMaxOfArray(this.state.playerMotion.colums);
        let maxofRowsPlayer = this.getMaxOfArray(this.state.playerMotion.rows);
        let maxofDiagPlayer = this.getMaxOfArray(this.state.playerMotion.diagonals);
        let maxIndex;
        // debugger;
        if (Math.max(maxofColumsComp, maxofRowsComp, maxofDiagComp) <= 1){
            if (Math.max(maxofColumsPlayer, maxofRowsPlayer, maxofDiagPlayer) == 1){
                //у нас по одному в строке и крестиков, и ноликов
                let indexes = this.randomShoot();
                if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                    this.state.arraySquare[indexes.index1][indexes.index2] = 2;
                    this.state.computerShoot[0] = indexes.index1;
                    this.state.computerShoot[1] = indexes.index2;
                }
                else {//игрок выбрал играть ноликами - комп играет крестиками
                    this.state.arraySquare[indexes.index1][indexes.index2] = 1;
                    this.state.computerShoot[0] = indexes.index1;
                    this.state.computerShoot[1] = indexes.index2;
                }
                
            }
            else if (maxofColumsPlayer == 2){
                maxIndex = this.state.playerMotion.colums.indexOf(Math.max.apply(Math, this.state.playerMotion.colums));
                for (let index = 0; index < 3; index++){
                    if (this.state.arraySquare[index][maxIndex] == 0){
                        if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                            this.state.arraySquare[index][maxIndex] = 2;
                            this.state.computerShoot[0] = index;
                            this.state.computerShoot[1] = maxIndex;
                        }
                        else {//игрок выбрал играть ноликами - комп играет крестиками
                            this.state.arraySquare[index][maxIndex] = 1;
                            this.state.computerShoot[0] = index;
                            this.state.computerShoot[1] = maxIndex;
                        }
                        break;
                    }
                }
            }
            else if (maxofRowsPlayer == 2){
                maxIndex = this.state.playerMotion.rows.indexOf(Math.max.apply(Math, this.state.playerMotion.rows));
                for (let index = 0; index < 3; index++){
                    if (this.state.arraySquare[maxIndex][index] == 0){
                        if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                            this.state.arraySquare[maxIndex][index] = 2;
                            this.state.computerShoot[0] = maxIndex;
                            this.state.computerShoot[1] = index;
                        }
                        else {//игрок выбрал играть ноликами - комп играет крестиками
                            this.state.arraySquare[maxIndex][index] = 1;
                            this.state.computerShoot[0] = maxIndex;
                            this.state.computerShoot[1] = index;
                        }
                        break;
                    }
                }
            }
            else if (maxofDiagPlayer == 2){
                maxIndex = this.state.playerMotion.diagonals.indexOf(Math.max.apply(Math, this.state.playerMotion.diagonals));
                if (maxIndex == 0){
                    //на главной диагонали
                    for (let index = 0; index < 3; index++){
                        if (this.state.arraySquare[index][index] == 0){
                            if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                                this.state.arraySquare[index][index] = 2;
                                this.state.computerShoot[0] = index;
                                this.state.computerShoot[1] = index;
                            }
                            else {//игрок выбрал играть ноликами - комп играет крестиками
                                this.state.arraySquare[index][index] = 1;
                                this.state.computerShoot[0] = index;
                                this.state.computerShoot[1] = index;
                            } 
                            break;
                        }
                    }
                }
                else{
                    //на побочной диагонали
                    for (let index = 0; index < 3; index++){
                        for (let index2 = 0; index2 < 3; index2++){
                            if(index == 3 - index2 - 1) {
                                if (this.state.arraySquare[index][index] == 0){
                                    if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                                        this.state.arraySquare[index][index2] = 2;
                                        this.state.computerShoot[0] = index;
                                        this.state.computerShoot[1] = index2;
                                    }
                                    else {//игрок выбрал играть ноликами - комп играет крестиками
                                        this.state.arraySquare[index][index2] = 1;
                                        this.state.computerShoot[0] = index;
                                        this.state.computerShoot[1] = index2;
                                    } 
                                    break;
                                }
                                
                            }
                        }
                    }
                }
            }
            
        }
        else if (maxofColumsComp == 2){
            //самое большое число  - по горизонтали
            maxIndex = this.state.computerMotion.colums.indexOf(Math.max.apply(Math, this.state.computerMotion.colums));
            for (let index = 0; index < 3; index++){
                if (this.state.arraySquare[index][maxIndex] == 0){
                    if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                        this.state.arraySquare[index][maxIndex] = 2;
                        this.state.computerShoot[0] = index;
                        this.state.computerShoot[1] = maxIndex;
                    }
                    else {//игрок выбрал играть ноликами - комп играет крестиками
                        this.state.arraySquare[index][maxIndex] = 1;
                        this.state.computerShoot[0] = index;
                        this.state.computerShoot[1] = maxIndex;
                    }
                    break;
                }
            }
        }
        else if (maxofRowsComp == 2){
            //самое большое число  - по горизонтали
            maxIndex = this.state.computerMotion.rows.indexOf(Math.max.apply(Math, this.state.computerMotion.rows));
            for (let index = 0; index < 3; index++){
                if (this.state.arraySquare[maxIndex][index] == 0){
                    if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                        this.state.arraySquare[maxIndex][index] = 2;
                        this.state.computerShoot[0] = maxIndex;
                        this.state.computerShoot[1] = index;
                    }
                    else {//игрок выбрал играть ноликами - комп играет крестиками
                        this.state.arraySquare[maxIndex][index] = 1;
                        this.state.computerShoot[0] = maxIndex;
                        this.state.computerShoot[1] = index;
                    }
                    break;
                }
            }
        }
        else if (maxofDiagComp == 2){
            //самое большое число  - на диагонали
            maxIndex = this.state.computerMotion.diagonals.indexOf(Math.max.apply(Math, this.state.computerMotion.diagonals));
                if (maxIndex == 0){
                    //на главной диагонали
                    for (let index = 0; index < 3; index++){
                        if (this.state.arraySquare[index][index] == 0){
                            if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                                this.state.arraySquare[index][index] = 2;
                                this.state.computerShoot[0] = index;
                                this.state.computerShoot[1] = index;
                            }
                            else {//игрок выбрал играть ноликами - комп играет крестиками
                                this.state.arraySquare[index][index] = 1;
                                this.state.computerShoot[0] = index;
                                this.state.computerShoot[1] = index;
                            } 
                            break;
                        }
                    }
                }
                else{
                    //на побочной диагонали
                    for (let index = 0; index < 3; index++){
                        for (let index2 = 0; index2 < 3; index2++){
                            if(index == 3 - index2 - 1) {
                                if (this.state.arraySquare[index][index] == 0){
                                    if (this.state.playerPlays=='x'){ //игрок выбрал играть крестиками, значит комп играет ноликами
                                        this.state.arraySquare[index][index2] = 2;
                                        this.state.computerShoot[0] = index;
                                        this.state.computerShoot[1] = index2;
                                    }
                                    else {//игрок выбрал играть ноликами - комп играет крестиками
                                        this.state.arraySquare[index][index2] = 1;
                                        this.state.computerShoot[0] = index;
                                        this.state.computerShoot[1] = index2;
                                    } 
                                    break;
                                }
                                
                            }
                        }
                    }
                }
        }
        
        console.log(this.state.computerShoot);  
        this.state.computerMotion.rows[this.state.computerShoot[0]] += 1; //нажал игрок на элемент в строке
        this.state.computerMotion.colums[this.state.computerShoot[1]] += 1; //нажал игрок на элемент в столбце
        if (this.state.computerShoot[0] == this.state.computerShoot[1]) //нажал игрок на элемент на главной диагонали
            this.state.computerMotion.diagonals[0] += 1;
        if (this.state.computerShoot[0] == 3 - this.state.computerShoot[1] - 1) //нажал игрок на элемент на побочной диагонали
            this.state.computerMotion.diagonals[1] += 1;

        // console.log(this.state.arraySquare);
        //НЕ УВЕРЕНА ЧТО SETSTATE ТУТ НЕ ЗАЦИКЛИТ
        this.setState({arraySquare: this.state.arraySquare, 
            computerMotion: this.state.computerMotion,
            countOfFreeSquares: this.state.countOfFreeSquares-1,
            whooseMotion: 'computer',
            computerShoot: this.state.computerShoot});
        // console.log(this.state.arraySquare);
        //проверяем что нет трех точек в одну полосу у компьютера
        if (this.check3inLinePlayer('computer'))
                this.props.somebodyWin('computer');
        else if (this.state.countOfFreeSquares == 0){ //компьютера походил, занял последнюю клетку, но не выиграл - значит ничья
                this.props.somebodyWin('nobody');
        }
    }

    getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
     }

    /**
     * Функция генерации случайного места для выстрела компьютера
     */
    randomShoot(){
        let index1 = this.getRandom(2);
        let index2 = this.getRandom(2);
        // console.log(1);
        if (this.checkRandomShoot(index1,index2)){
            // this.wasAlreadyShoot[index1][index2] = true;
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
     * функция для проверки, не стрелял ли еще компьютер по этому полю
     * @param {*} index1 индекс по строке
     * @param {*} index2 индекс по столбцу
     */
    checkRandomShoot(index1,index2){
        if (this.state.arraySquare[index1][index2] == 0){
            return true;
        }
        return false;
    }

    check3inLinePlayer(whoChecked){ //кого проверяем на три в один ряд
        if (whoChecked == 'player'){ //если проверка вызывается для игрока
            for (let index1 = 0; index1 < 3; index1++) 
                if ((this.state.playerMotion.rows[index1] == 3)||(this.state.playerMotion.colums[index1] == 3)) //проверка по строкам и столбцам
                    return true;
            if (((this.state.playerMotion.diagonals[0] == 3)||(this.state.playerMotion.diagonals[1] == 3)))
                return true;
            return false;
        }
        else { //если проверка вызывается для компьютера
            for (let index1 = 0; index1 < 3; index1++) 
            if ((this.state.computerMotion.rows[index1] == 3)||(this.state.computerMotion.colums[index1] == 3)) //проверка по строкам и столбцам
                return true;
            if (((this.state.computerMotion.diagonals[0] == 3)||(this.state.computerMotion.diagonals[1] == 3)))
                return true;
            return false;
        }
    }

    createSquares(){ //обеспечивает отрисовку игрового поля в соответствии с состоянием мастрицы в данный момент
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
            // debugger;
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
        //                        type = {this.state.type}
        // shootShip = {this.shootShip.bind(this)}
        return listSquares1;
    }

    render() {
        let listSquares1 = this.createSquares();
        // return  <div className  = {'field' + ` field_${this.state.type}`}>
        //                {listSquares1} 
        //         </div>
        return <div className  = {'field'}>
                    {listSquares1 || ''}
                </div>
        }
}

export default Round;