const http = require('http');
const { v4: uuidv4 } = require('uuid');
const handleError = require('./handle-error');
const todos = [];

const requestListener = (req, res) => {
  const header = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  
  if (req.url === '/todos' && req.method === 'GET') {
    const response = {
      status: 'success',
      data: todos
    }
    res.writeHead(200, header);
    res.write(JSON.stringify(response));
    res.end();
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, header);
    res.end();
  } else if (req.method === 'POST') {
    const response = {
      status: 'success',
      message: 'add todo successful!'
    }

    req.on('end', () => {
      try {
        const title = JSON.parse(body).content;

        if (title) {
          const todo = {
            title,
            id: uuidv4()
          }
          todos.push(todo);
          res.writeHead(200, header);
          res.write(JSON.stringify(response));
          res.end();
        } else {
          handleError(res, header);
        }
      } catch(err) {
        handleError(res, header);
      }
    });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    const response = {
      status: 'success',
      message: 'delete all todos successful!'
    }
    res.writeHead(200, header);
    res.write(JSON.stringify(response));
    res.end();
  } else if (req.url.startsWith('/todos') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      handleError(res, header);
      return;
    }
    todos.splice(index, 1);
    const response = {
      status: 'success',
      message: 'delete one todo successful!',
      id: id
    }
    res.writeHead(200, header);
    res.write(JSON.stringify(response));
    res.end();
  } else if (req.url.startsWith('/todos') && req.method === 'PATCH') {
    
    req.on('end', () => {
      try {
        const content = JSON.parse(body).content;
        if (content) {
          const id = req.url.split('/').pop();
          const index = todos.findIndex(todo => todo.id === id);
          if (index === -1) {
            handleError(res, header);
            return;
          }

          todos[index] = {
            title: content,
            id: id
          }
          const response = {
            status: 'success',
            message: 'edit one todo successful!',
            data: todos
          }

          res.writeHead(200, header);
          res.write(JSON.stringify(response));
          res.end();
        } else {
          handleError(res, header);
        }
      } catch (err) {
        handleError(res, header);
      }
    })
    
  } else {
    const response = {
      status: 'failed',
      message: 'not found'
    }
    res.writeHead(404, header);
    res.write(JSON.stringify(response));
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3006);