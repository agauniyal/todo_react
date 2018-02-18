import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { TodoForm, TodoList, Footer } from './Components/todo';
import {
  addTodo,
  findById,
  updateTodo,
  toggleTodo,
  removeTodo,
  filterTodos
} from './lib/todoHelpers';
import { pipe, partial } from './lib/utils';
import uniqueId from 'lodash.uniqueid';
import {
  loadTodos,
  createTodo,
  saveTodo,
  destroyTodo
} from './lib/todoService';

class App extends Component {
  state = {
    todos: [],
    currentTodo: '',
    errorMessage: '',
    message: ''
  };

  static contextTypes = {
    route: PropTypes.string
  };

  componentDidMount() {
    loadTodos().then(todos => this.setState({ todos }));
  }

  handleInputChange = e => {
    this.setState({ currentTodo: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const newTodo = {
      id: +uniqueId(100),
      name: this.state.currentTodo,
      isComplete: false
    };
    const updatedTodos = addTodo(this.state.todos, newTodo);
    this.setState({ todos: updatedTodos, currentTodo: '', errorMessage: '' });
    createTodo(newTodo).then(() => {
      this.setState({ message: 'Todo Added!' });
    });
  };

  handleEmptySubmit = e => {
    e.preventDefault();
    this.setState({
      errorMessage: 'Please supply a todo name'
    });
  };

  handleToggle = id => {
    const getToggledTodo = pipe(findById, toggleTodo);
    const updated = getToggledTodo(id, this.state.todos);
    const getUpdatedTodos = partial(updateTodo, this.state.todos);
    const updatedTodos = getUpdatedTodos(updated);
    this.setState({ todos: updatedTodos });
    saveTodo(updated).then(() => {
      this.setState({ message: 'Todo Updated' });
    });
  };

  handleRemove = (id, e) => {
    e.preventDefault();
    const updatedTodos = removeTodo(this.state.todos, id);
    this.setState({ todos: updatedTodos });
    destroyTodo(id).then(() => {
      this.setState({ message: 'Todo removed!' });
    });
  };

  render = () => {
    const displayTodos = filterTodos(this.state.todos, this.context.route);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Todo!</h1>
        </header>
        <div className="Todo-App">
          {this.state.errorMessage && (
            <span className="error">{this.state.errorMessage}</span>
          )}
          {this.state.message && (
            <span className="success">{this.state.message}</span>
          )}
          <TodoForm
            handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={
              this.state.currentTodo
                ? this.handleSubmit
                : this.handleEmptySubmit
            }
          />
          <TodoList
            handleToggle={this.handleToggle}
            todos={displayTodos}
            handleRemove={this.handleRemove}
          />
          <Footer />
        </div>
      </div>
    );
  };
}

export default App;
