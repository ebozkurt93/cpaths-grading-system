import React, { Component } from 'react';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }
  escFunction(event) {
    // ? if you decide to add input fields etc, modify this function
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      this.props.closeModal();
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }
  render() {
    let sizename = '';
    const modals = {
      small: 'modal-sm',
      large: 'modal-lg'
    };
    const { size, title } = this.props;
    if (size) {
      sizename = modals[size];
    }
    return (
      <div className={`modal ${sizename} active`}>
        <a
          className='modal-overlay'
          aria-label='Close'
          onClick={this.props.closeModal}
        />
        <div className='modal-container'>
          <div className='modal-header'>
            <a
              className='btn btn-clear float-right'
              aria-label='Close'
              onClick={this.props.closeModal}
            />
            {title && <div className='modal-title h5'>{title}</div>}
          </div>
          <div className='modal-body'>
            <div className='content'>{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}
export default Modal;
