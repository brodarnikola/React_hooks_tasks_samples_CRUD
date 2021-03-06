import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import About from './components/About';
import Button from './components/Button';
import CustomHookExample from './components/CustomHookExample';
import ReducerExample from './components/ReducerExample';
import ExampleSortableTree from './components/ExampleSortableTree';
import ExampleDragAndDrop from './components/ExampleDragAndDrop';

function App() {
  const [number, setNumber] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      setIsLoading(true);
      const tasksFromServer = await fetchTasks();
      setTimeout(() => {
        setTasks(tasksFromServer);
        setIsLoading(false);
      }, 1000);
    };

    getTasks();
  }, []);

  useEffect(() => {
    console.log(
      'In this useEffect it will only enter, when the value of state, variable number is changed.. because number is passed as second parameter'
    );
  }, [number]);

  useEffect(() => {
    console.log(
      'This useEffect will be executed every time, when some new state, value change. Because I have nothing passed as second parameter'
    );
  });

  // fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    console.log(data);
    return data;
  };

  //fetch task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    console.log(data);
    return data;
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });

    setTasks(tasks.filter((task) => task.id !== id));
  };

  //toogle task
  const toogleReminder = async (id) => {
    console.log('Change reminder' + id);

    const taskToToogle = await fetchTask(id);
    // I want, that all values in this object taskToToogle remains the same.. with help of ...taskToToogle
    // I'm only changing this value -> reminder
    const updTask = { ...taskToToogle, reminder: !taskToToogle.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    });

    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  const increaseValueByOne = () => setNumber((value) => value + 1);

  return (
    <Router>
      <div className="container">
        {isLoading ? (
          <div>Loading data, please wait..</div>
        ) : (
          <>
            <Header title="Task tracker Practice Igor Ariel Brc" />

            <br />
            <Button
              text={'Sortable tree example'}
              onClick={(e) => {
                window.location.href = '/sortableTreeExample';
                //let path = '/sortableTreeExample';
                //history.push(path);
                //history.push('/sortableTreeExample');
              }}
            />
            <br />
            <Button
              text={'Drag and drop example'}
              onClick={(e) => {
                window.location.href = '/dragAndDropExample';
              }}
            />
            <br />

            <Route
              path="/"
              exact
              render={(props) => (
                <>
                  For odd number background color of button will be green. For
                  even number background color will be blue.
                  <br />
                  <Button text={number.toString()} />
                  <Button
                    color={number % 2 === 0 ? 'green' : 'blue'}
                    text={'+'}
                    onClick={increaseValueByOne}
                  />
                  <br />
                  Custom hook example.. fetching data from network, backend.
                  Displaying data, loading and error state
                  <Link to={'/customHookExample'}>
                    {' '}
                    <Button
                      text={'Custom hook example'}
                      color={'darkblue'}
                    />{' '}
                  </Link>
                  <br />
                  <br />
                  Reducer hook example.. fetching data from network, backend.
                  Displaying data, loading and error state
                  <Link to={'/reducerHookExample'}>
                    {' '}
                    <Button
                      text={'Reducer hook example'}
                      color={'darkblue'}
                    />{' '}
                  </Link>
                  {/* {showAddTask && <AddTask onAddNewTask={addTask} />} */}
                  {tasks.length > 0 ? (
                    <Tasks
                      tasks={tasks}
                      onDelete={deleteTask}
                      onToogle={toogleReminder}
                    />
                  ) : (
                    'All task are done'
                  )}
                </>
              )}
            />
            {/* <Route path='/addNewTask' render={
            () => <AddTask />
          } /> */}
            <Route path="/addNewTask" component={AddTask} />
            <Route
              path="/sortableTreeExample"
              component={ExampleSortableTree}
            />
            <Route path="/dragAndDropExample" component={ExampleDragAndDrop} />
            <Route path="/customHookExample" component={CustomHookExample} />
            <Route path="/reducerHookExample" component={ReducerExample} />
            <Route path="/about" component={About} />
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
