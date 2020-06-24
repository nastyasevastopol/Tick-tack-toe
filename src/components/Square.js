import React from 'react';
class Square extends React.Component {
        constructor(props){
            super(props);
            this.state = {  id: props.id, 
                            key: props.id, 
                            value: props.value,
                            wasShoot: props.wasShoot,
                            wasAlreadyShoot: props. wasAlreadyShoot || false,
                        }
        }
    /**
     * Обработчик события нажатия на квадратик 
     * @param {Event} e - событие нажатия на квадратик
     */
    handleClick(e){
        if (this.state.wasAlreadyShoot==false){
            this.setState({wasShoot : true, wasAlreadyShoot: true, value: 1}); //тут надо будет убрать
            this.props.computerClick(e, this.state.id);
        }
        else {
            //пока мы тут ничего не делаем, но может потом будем выводить сообщение мол сюда уже стреляли
            alert("Здесь уже есть крестик или нолик, попробуйте другое место"); 
        }
    }
    componentWillReceiveProps(nextProps){
        // if (this.state.type == 'player'){
            //сюда надо уже передавать тип - крестик или нолик
            if ((nextProps.findID)){
                //if nextprops.type = 'крестик'
                //в состояние заводим открыт и крестик
                //в другом случае в состояние заводим открыт и нолик
                if (this.state.id == nextProps.findID)
                    // if (nextProps.type == 'x'){
                        this.setState({wasShoot: true, wasAlreadyShoot: true, value: 2}); 
                    // }
                    // else if (nextProps.type == 'o'){
                        // this.setState({wasShoot: true, wasAlreadyShoot: true, value: 2}); 
                    // }
            }

        // }
    }
    render() {
            return  <div className = {"square field__square field__square_computer"} id = {this.state.id} onClick = {this.handleClick.bind(this)}>
                            {this.state.value == 1 ? 
                                <img className = {this.state.wasShoot ? "square_img" : "disable"} src = {'../public/dagger.png'}/> : 
                                this.state.value == 2 ?
                                    <img className= {this.state.wasShoot ? "square_img" : "disable"} src = {'../public/zero.png'}/> :
                                    <div></div>}
                    </div>
    }
}

export default Square;