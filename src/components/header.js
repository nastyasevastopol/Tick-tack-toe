import React from 'react';
class Header extends React.Component {
        //   <img className="information__logo" src="img/logo.jpg" alt="Логотип"/>
    render() {
        return  <div className  ="header">
                        
                        <div className="header__title title" title={this.props.title}>{this.props.title}</div>
                        <div className="header__subtitle" title={this.props.description}>{this.props.description}</div>
                </div>
        }
}

export default Header;