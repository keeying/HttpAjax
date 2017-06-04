(function () {
  /**
   * 构造器
   * @constructor {AsyncTaskManager} AsyncTaskManager
   */
  function AsyncTaskManager() {
    this._flags = [];
    this._tasks = [];
    this._exceptions = {};
    this._catchfunc = null;
  }

  AsyncTaskManager.of = function () {
    return new AsyncTaskManager();
  }

  /**
   * 添加异步任务
   * @param {Function} f 异步方法
   * @param {Object} param 异步方法参数
   * @param {Object} key 结果对应map中的健
   */
  AsyncTaskManager.prototype.addTask = function (f, param, key) {
    if (Object.prototype.toString.call(f) === '[object Object]') {
      this._tasks.push(f);
      this._flags[f.key] = 'ready';
    } else {
      this._tasks.push({
        fn: f,
        param: param,
        key: key
      });
      this._flags[key] = 'ready';
    }
    return this;
  };

  /**
   * 批量添加异步任务
   * @param {Array} '[{fn: '异步方法', param: '异步方法参数', key: '结果对应map中的健'}]'
   */
  AsyncTaskManager.prototype.addTasks = function (tasks) {
    for (var key in tasks) {
      if (tasks.hasOwnProperty(key)) {
        this._tasks.push(tasks[key]);
      }
    }
    return this;
  };

  /**
   * 所有异步任务都完成时执行
   * @param {Function} f
   */
  AsyncTaskManager.prototype.every = function (f) {
    var _self = this,
      result = [],
      _task;

    while (this._tasks.length) {
      _task = this._tasks.shift();
      _self._flags[_task.key] = 'pending';
      if (_task.param !== null && _task.param !== 'undefined') {
        (function (task) {
          task.fn(task.param, function (res) {
            result[task.key] = res;
            _self._flags[task.key] = 'resolved';
            ask(f);
          }, function (err) {
            _self._flags[task.key] = 'rejected';
            _self._exceptions[task.key] = err.msg;
            ask(f);
          });
        }(_task));
      } else {
        (function (task) {
          task.fn(function (res) {
            result[task.key] = res;
            _self._flags[task.key] = 'resolved';
            ask(f);
          }, function (err) {
            _self._flags[task.key] = 'rejected';
            _self._exceptions[task.key] = err.msg;
            ask(f);
          });
        }(_task));
      }
    }

    function ask(f) {
      var completed = true;
      var resolved = true;
      var empty = true;
      // console.log(_self._catchfunc)
      for (var key in _self._flags) {
        if (_self._flags.hasOwnProperty(key)) {
          // 任何 pending 状态的任务存在，则说明未执行完成，即亦没有得到完全解决
          // ** 注：走到这一步不会出现 ready 状态
          if (_self._flags[key] === 'pending' || _self._flags[key] === 'ready') {
            completed = false;
            resolved = false;
            return;
          }
          // 有任何非 resolved 状态的任务存在，即代表没有得到完全解决
          if (_self._flags[key] !== 'resolved') {
            resolved = false;
          }
        }
      }
      if (completed) {
        for (var k in _self._exceptions) {
          if (_self._exceptions.hasOwnProperty(k)) {
            _self._catchfunc(_self._exceptions);
            break;
          }
        }
      }
      resolved && f(result);
    }
    return this;
  };

  /**
   * 任务异常捕获
   * @param {Function} f
   * @param {Boolean} catchall 是否捕获并记录所有异常的异步任务
   */
  AsyncTaskManager.prototype.catch = function (f, catchall) {
    this._catchfunc = f;
  };

  return AsyncTaskManager;
}());