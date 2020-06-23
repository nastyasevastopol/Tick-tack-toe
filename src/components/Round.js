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
        }    
    }
    computerClick(){ //обработчик нажатия человека на одну из клеток
        //
        //если не осталось клеток больше
        //проверить не выиграл ли человек
        //somebodyWin вызвать

    }
    render() {
        // let listSquares1 = this.createSquares();
        // return  <div className  = {'field' + ` field_${this.state.type}`}>
        //                {listSquares1} 
        //         </div>
        return <div></div>
        }
}

export default Round;