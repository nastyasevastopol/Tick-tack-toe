import React from 'react';
class Square extends React.Component {
        constructor(props){
            super(props);
            this.state = {  id: props.id, 
                            key: props.id, 
                            value: props.value,
                            wasShoot: props.wasShoot || false,
                            wasAlreadyShoot: props. wasAlreadyShoot || false,
                        }
        }
    /**
     * Обработчик события нажатия на квадратик 
     * @param {Event} e - событие нажатия на квадратик
     */
    handleClick(e){
        if (this.state.wasAlreadyShoot == false){
            this.setState({wasShoot : true, wasAlreadyShoot: true, value: 1}); //тут надо будет убрать
            this.props.computerClick(e, this.state.id);
        }
        else {
            //пока мы тут ничего не делаем, но может потом будем выводить сообщение мол сюда уже стреляли
            alert("Здесь уже есть крестик или нолик, попробуйте другое место"); 
        }
    }
    componentWillReceiveProps(nextProps){
            if ((nextProps.findID)){
                if (this.state.id == nextProps.findID)
                        this.setState({wasShoot: true, wasAlreadyShoot: true, value: 2}); 
            }
    }
    componentWillMount(){
            if ((this.props.findID)){
                if (this.state.id == this.props.findID)
                        this.setState({wasShoot: true, wasAlreadyShoot: true, value: 2}); 
            }
    }
    render() {
            return  <div className = {"field__square square"} id = {this.state.id} onClick = {this.handleClick.bind(this)}>
                            {this.state.value == 1 ? 
                                <img className = {this.state.wasShoot ? "square__img" : "disable"} src = {'../public/dagger.png'}/> : 
                                this.state.value == 2 ?
                                    <img className= {this.state.wasShoot ? "square__img" : "disable"} src = {'../public/zero.png'}/> :
                                    <div></div>}
                    </div>
    }
}

export default Square;