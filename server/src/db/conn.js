/**
 * @description mysql
 * @author Z
 */
const mysql = require('mysql');
const {
    MYSQL_CONFIG
} = require('../conf/constant');
// 创建连接 使用连接池
let pool  = mysql.createPool(MYSQL_CONFIG);
let conn = {};
conn.query=(sql) => {
    return new Promise((resolve,reject) => {
        // 取出连接
        pool.getConnection((err,connection)=>{
            if(err){ // 错误
                reject(err);
                return;
            } // 执行SQL语句
            connection.query(sql,(error,results,fields) => {
                console.log(`${sql}`);
                // 释放连接
                connection.release();
                if(error){
                    // 出错
                    reject(error);
                    return;
                }
                // 成功
                resolve(results);
            })
        });
    });
};
module.exports = conn;
