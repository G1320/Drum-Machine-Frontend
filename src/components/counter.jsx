// Counter.jsx
import React from 'react';
import store from '../store/store';

class Counter extends React.Component {
  state = {
    counter: store.getState().counter,
  };

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({ counter: store.getState().counter });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  incrementCounter = () => {
    store.dispatch({ type: 'INCREMENT' });
  };

  render() {
    return (
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Counter: {this.state.counter.counter}</p>
        <button onClick={this.incrementCounter}>Increment Counter</button>
      </div>
    );
  }
}

export default Counter;
