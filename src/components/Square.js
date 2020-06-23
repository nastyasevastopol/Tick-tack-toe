import React from 'react';
export class Square extends React.Component {
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
            this.setState({wasShoot : true, wasAlreadyShoot: true});
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
            if ((nextProps.findID)&&(nextProps.type)){
                //if nextprops.type = 'крестик'
                //в состояние заводим открыт и крестик
                //в другом случае в состояние заводим открыт и нолик
                if (this.state.id==nextProps.findID)
                    if (nextProps.type == 'x'){
                        this.setState({wasShoot: true, wasAlreadyShoot: true, type:'x'}); 
                    }
                    else if (nextProps.type == 'x'){
                        this.setState({wasShoot: true, wasAlreadyShoot: true, type: 'o'}); 
                    }
            }

        // }
    }
    render() {
            return  <div className = {"square field__square field__square_computer"} id = {this.state.id} onClick = {this.handleClick.bind(this)}>
                            {this.state.type == 'x' ? 
                                <img className = {this.state.wasShoot ? "square__shoot" : "square__shoot disable"} src = {'../img/dagger.png'}/> : 
                                <img className= {this.state.wasShoot ? "square__shoot" : "square__shoot disable"} src = {'../img/dot.png'}/>}
                    </div>
    }
}