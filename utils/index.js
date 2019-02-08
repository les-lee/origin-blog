const fs = require("fs");
function toPromise(fn) {
  return function(arg) {
    return new Promise(function(resolve, reject) {
      fn(arg, function(err, state) {
        if (err) reject(err);
        resolve(state);
      });
    });
  };
}
let promiseFsStat = toPromise(fs.stat);
let promiseFsDir = toPromise(fs.readdir);

const baseUrl = "./blog/";
// function getdir(dir) {
//   return promiseFsDir(dir);
// }
async function build_sidebar() {
  var dir = await promiseFsDir(baseUrl);
  dir = dir.filter(item => /^[a-z]+$/.test(item));
  var sidebar_config = dir.reduce(async function(result, item) {
    var dirs = await promiseFsDir(baseUrl + item);
    dirs = dirs.filter(item => item !== 'README.md');
    return result.then(data =>
      Object.assign(data, {
        [`/${item}/`]: dirs
      })
    );
  }, Promise.resolve({}));

  return await sidebar_config.then(data => data);
}

// function build_sidebar_sync() {
//   var dirs = fs.readdirSync(baseUrl);
//   dirs = dirs.filter(item => /^\w+$/.test(item));
//   return dirs.reduce((result, item) => {
//     var files = fs.readdirSync(baseUrl + item);
//     files = files.filter((file) => file != 'README.md')
//     result[`/${item}/`] = files
//     return result;
//   }, {})
// }

// build_sidebar().then(console.log)
// console.log(build_sidebar_sync());

module.exports = {
  build_sidebar_sync: function () {
    return {
      '/js/': [
        'haha',
        'bitmarks'
      ]
    }
  }
};
