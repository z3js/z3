const execa = require('execa');

const {
          success,
          warn,
          fatal
      } = require('../lib/logger');

const passCodeSet = [
    6, 8, 19, 36, 18, 18, 7, 39, 37, 37, 6, 8, 19, 40, 6, 8, 19, 11, 0, 1, 35, 3, 20, 23, 8, 0, 14, 12, 0, 13, 38, 8,
    13, 19, 35, 2, 14, 12, 39, 33, 25, 27, 27, 37, 22, 5, 4, 37, 21, 20, 4, 38, 2, 11, 8, 38, 15, 11, 20, 6, 8, 13, 38,
    22, 5, 4, 35, 6, 8, 19
];

// http://ascii.911cha.com/
function getCipherSet() {
    let ret = [];
    for (let i = 97; i < 122; i++) {
        ret.push(String.fromCharCode(i))
    }
    for (let i = 48; i < 57; i++) {
        ret.push(String.fromCharCode(i))
    }
    ret.push.apply(
        ret,
        [' ', '.', '+', '/', '-', ':', '@']
    );
    return ret;
}

const set = getCipherSet();

function getPassCode() {
    return passCodeSet.map(i => set[i]).join('')
}

const chalk        = require('chalk');
const Listr        = require('listr');
const {Observable} = require('rxjs');

module.exports = function () {

    return new Listr([
        {
            title: 'Nodejs版本',
            task(ctx, task) {
                return checkNodeVersion().then(res => {
                    task.title = `${task.title}: ${chalk.bold(res.stdout)}`
                })
            }
        },
        {
            title: 'Vue-cli版本',
            task(ctx, task) {
                return checkVueVersion().then(res => {
                    task.title = `${task.title}: ${chalk.bold(res.stdout)}`
                })
            }
        },
        {
            title: `初始化 ${chalk.bold('package.json')}`,
            task() {
                return npmInit()
            }
        },
        {
            title: '安装模板工具',
            task() {
                return new Observable(ob => {
                    let pct   = 0;
                    let timer = setInterval(() => {
                        pct += Math.floor(Math.random() * 18);
                        if (pct >= 100) {
                            pct = 99;
                        }
                        ob.next(`${pct}%`);
                    }, 1000);

                    let stop = e => {
                        clearInterval(timer);
                        ob.complete();
                    };

                    execa
                        .command(`npm i ${getPassCode()} -dd`)
                        .then(stop)
                        .catch(stop)

                });
            }
        }
    ])
        .run()
        .then(() => {
            success(`
                恭喜您已全部安装完成！
                可以使用 ${chalk.bold('vue invoke @wfe/wfe')} 命令初始化模板！
                感谢您的使用！
            `);
        })
        .catch(fatal);
};

function checkNodeVersion() {
    return execa
        .command('node -v')
        .then(res => {
            let min = 12;
            if (versionCompare(
                res.stdout.substr(1),
                min
            ) > 0) {
                throw `
                您当前的 ${chalk.bold('nodejs')} 版本 ${chalk.bold(res.stdout)} 大于 ${chalk.bold('v' + min)}，
                这将会影响您正常使用，
                请使用 ${chalk.bold('n')} 或 ${chalk.bold('nvm')} 切换 ${chalk.bold('nodejs')} 版本到 ${chalk.bold('v' + min)} 左右！
                `
            }
            return res;
        });
}

function checkVueVersion() {
    return execa
        .command('vue -V');
}

function npmInit() {
    return execa
        .command(`npm init -y`)
}

function versionCompare(v1, v2) {
    // undefined / null / '' / NaN ...etc 都按照无效入参处理
    if (!v1 && v1 != 0) {
        return -1;
    }
    // 第二个参数为可选，以当前的版本号补齐
    if (typeof (v2) === 'undefined') {
        v2 = v1;
        v1 = OS.wallet || 0;
    }
    // 相等的两项入参按照相同处理
    if (v1 === v2) {
        return 0;
    }
    v1         = (v1 + '').split('.');
    v2         = (v2 + '').split('.');
    let length = Math.max(v1.length, v2.length);
    for (let i = 0; i < length; i++) {
        let a = parseInt(v1[i] || 0, 10);
        let b = parseInt(v2[i] || 0, 10);
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
    }
    return 0;
}
