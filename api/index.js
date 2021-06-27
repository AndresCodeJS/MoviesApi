//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function requestApi() {
  let counter = 1;
  return async function () {
    setInterval(async () => {
      counter++;
      console.log('hola ',counter)
    },5000)
  }
}
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
//
// Syncing all the models at once.
conn.sync({ force: false}).then(() => {
  server.listen(process.env.PORT, () => {
    let requestApiFunction = requestApi();
    requestApiFunction();
    console.log('%s listening at 4545'); // eslint-disable-line no-console
  });
});
