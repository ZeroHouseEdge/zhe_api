import PythonShell from 'python-shell';

export function fetchWallet(args) {
  return new Promise(function(resolve, reject) {
    const pyFile = '/Users/jackmallers/Projects/electron-test/zhe-server/server/';
    const opts = {
      mode: 'json',
      pythonPath: '/usr/local/bin/python3',
      scriptPath: pyFile,
      args: args
    };
    PythonShell.run('wallet.py', opts, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}
