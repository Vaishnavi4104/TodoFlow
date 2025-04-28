import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const priorityColors = {
  High: 'danger',
  Medium: 'warning',
  Low: 'success',
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: '', subtasks: [] });
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({ title: '', description: '', dueDate: '', priority: '', subtasks: [] });

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error.response?.data || error.message);
        setError('Failed to fetch tasks');
      }
      setLoading(false);
    };
    fetchTasks();
  }, [token]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!token) {
        setError('Not authenticated. Please login again.');
        return;
      }
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        newTask,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '', dueDate: '', priority: '', subtasks: [] });
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to create task. Please try again.');
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTasks(tasks.map(task =>
        task._id === taskId ? res.data : task
      ));
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      setError('Failed to delete task');
      toast.error('Failed to delete task!');
    }
  };

  // Edit handlers
  const openEditModal = (task) => {
    setEditTask(task);
    setEditTaskData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      priority: task.priority || '',
      subtasks: task.subtasks || []
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditTask(null);
  };

  const handleEditInputChange = (e) => {
    setEditTaskData({ ...editTaskData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${editTask._id}`,
        editTaskData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTasks(tasks.map(task => (task._id === editTask._id ? res.data : task)));
      toast.success('Task updated successfully!');
      closeEditModal();
    } catch (error) {
      toast.error('Failed to update task!');
    }
  };

  // Filter tasks based on filter state
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Sort tasks based on sortBy state
  const sortedTasks = [...filteredTasks];
  if (sortBy === 'dueDate') {
    sortedTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (sortBy === 'priority') {
    const priorityOrder = { High: 1, Medium: 2, Low: 3, '': 4 };
    sortedTasks.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
  }

  const handleToggleSubtask = async (taskId, subIdx, completed) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    const updatedSubtasks = task.subtasks.map((sub, idx) =>
      idx === subIdx ? { ...sub, completed } : sub
    );
    await handleUpdateTask(taskId, { ...task, subtasks: updatedSubtasks });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">TodoFlow</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Bar */}
      <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
        <div>
          <button
            className={`btn btn-outline-primary mx-1${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button
            className={`btn btn-outline-success mx-1${filter === 'completed' ? ' active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`btn btn-outline-warning mx-1${filter === 'pending' ? ' active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
        </div>
        <div className="d-flex align-items-center ms-2">
          <label className="me-2 fw-bold" htmlFor="sortDropdown">Sort by:</label>
          <select
            id="sortDropdown"
            className="form-select w-auto"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Create Task Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Create New Task</h5>
          <form onSubmit={handleCreateTask}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date (optional)</label>
              <input
                type="date"
                className="form-control"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Priority (optional)</label>
              <select
                className="form-select"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Subtasks</label>
              {newTask.subtasks && newTask.subtasks.map((sub, idx) => (
                <div key={idx} className="input-group mb-1">
                  <input
                    type="text"
                    className="form-control"
                    value={sub.title}
                    onChange={e => {
                      const subtasks = [...newTask.subtasks];
                      subtasks[idx].title = e.target.value;
                      setNewTask({ ...newTask, subtasks });
                    }}
                    placeholder={`Subtask ${idx + 1}`}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                      const subtasks = newTask.subtasks.filter((_, i) => i !== idx);
                      setNewTask({ ...newTask, subtasks });
                    }}
                  >Remove</button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-1"
                onClick={() => setNewTask({ ...newTask, subtasks: [...(newTask.subtasks || []), { title: '', completed: false }] })}
              >Add Subtask</button>
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Task Modal */}
      {editModalOpen && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={editTaskData.title}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={editTaskData.description}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dueDate"
                      value={editTaskData.dueDate}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      name="priority"
                      value={editTaskData.priority}
                      onChange={handleEditInputChange}
                    >
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subtasks</label>
                    {editTaskData.subtasks && editTaskData.subtasks.map((sub, idx) => (
                      <div key={idx} className="input-group mb-1">
                        <input
                          type="text"
                          className="form-control"
                          value={sub.title}
                          onChange={e => {
                            const subtasks = [...editTaskData.subtasks];
                            subtasks[idx].title = e.target.value;
                            setEditTaskData({ ...editTaskData, subtasks });
                          }}
                          placeholder={`Subtask ${idx + 1}`}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            const subtasks = editTaskData.subtasks.filter((_, i) => i !== idx);
                            setEditTaskData({ ...editTaskData, subtasks });
                          }}
                        >Remove</button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm mt-1"
                      onClick={() => setEditTaskData({ ...editTaskData, subtasks: [...(editTaskData.subtasks || []), { title: '', completed: false }] })}
                    >Add Subtask</button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List or Loading Spinner */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="task-list-flex">
          {sortedTasks.map((task) => (
            <div key={task._id} className="task-card-flex">
              <div className={`card${task.completed ? ' completed-task-card' : ''}`}>
                <div className="card-body">
                  <h5 className={`card-title d-flex align-items-center justify-content-between${task.completed ? ' completed-task-title' : ''}`}>
                    {task.title}
                    {task.priority && (
                      <span className={`badge bg-${priorityColors[task.priority] || 'secondary'} ms-2`}>
                        {task.priority}
                      </span>
                    )}
                  </h5>
                  <p className="card-text">{task.description}</p>
                  {task.dueDate && (
                    <span className="badge bg-info text-dark mb-2">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.completedAt && (
                    <div className="text-success small mb-2">
                      Completed on: {new Date(task.completedAt).toLocaleDateString()}
                    </div>
                  )}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <ul className="subtask-list">
                      {task.subtasks.map((sub, idx) => (
                        <li key={sub._id || idx} className="subtask-item">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={sub.completed}
                            onChange={() => handleToggleSubtask(task._id, idx, !sub.completed)}
                          />
                          <span style={{ textDecoration: sub.completed ? 'line-through' : 'none' }}>{sub.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) =>
                        handleUpdateTask(task._id, {
                          ...task,
                          completed: e.target.checked
                        })
                      }
                    />
                    <label className="form-check-label">
                      Completed
                    </label>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm ms-2"
                      onClick={() => openEditModal(task)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 