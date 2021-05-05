/* eslint-disable one-var */
const days = ['Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat', 'Sun'];
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const _ = require('lodash');
const moment = require('moment');
let restaurants = require('../assets/seed/restaurant.json');
let users = require('../assets/seed/users.json');



function carryForwardTime(map) {
  _.forEach(map, (times, curDay) => {
    let time = times[0].split(' - ');
    let sTime = convert24Hrs(time[0]);
    let eTime = convert24Hrs(time[1]);

    if (eTime < sTime) {
      let time1 = moment(sTime, 'HH.mm').diff(moment().startOf('day'), 'seconds')+' - ' + '86401';
      let time2 = '0' +' - '+ moment(eTime, 'HH.mm').diff(moment().startOf('day'), 'seconds');
      let nextDay = days[(days.indexOf(curDay)+1)%7];
      map[curDay].shift();
      map[curDay].push(time1);

      map[nextDay].push(time2);
    } else {
      let time1 = moment(sTime, 'HH.mm').diff(moment().startOf('day'), 'seconds') + ' - ' + moment(eTime, 'HH.mm').diff(moment().startOf('day'), 'seconds');
      map[curDay].shift();
      map[curDay].push(time1);
    }
  });

  return map;
}

function parseHours(str) {
  let routines = str.split('/');
  let map = {};

  let tempThurArr = {
    'Thu': 'Thurs',
    'Thur': 'Thurs',
    'Wed': 'Weds'
  };

  routines.forEach(routine => {
    routine = routine.trim();
    let ind = findTimes(routine);
    let dates = routine.substring(0, ind).trim().split(',');

    let time = routine.substring(ind).trim();

    dates.forEach((date) => {
      date = date.trim();

      let curDays = date.split('-');

      if (curDays.length > 1) {
        let sDay = curDays[0].trim();
        let eDay = curDays[1].trim();

        sDay = tempThurArr[sDay] ? tempThurArr[sDay] : sDay;
        eDay = tempThurArr[eDay] ? tempThurArr[eDay] : eDay;

        let sI = days.indexOf(sDay);
        let eI = days.indexOf(eDay);

        console.log('sI and eI are : ', sI, eI);

        let count = sI;

        let tempCounter = 0;

        while (true) {
          console.log('count is : ', count);
          map[days[count]] = [time];

          if (count === eI) {break;}

          count++;
          count = count % 7;

          tempCounter++;

          if (tempCounter > 8) {
            console.log(sDay, eDay);
            process.exit(1);
          }
        }
      }
      else {
        map[curDays[0]] = [time];
      }
    });
  });

  return map;
}

function findTimes(str) {
  for (let i = 0; i < str.length; i++) {
    let ch = str.charAt(i);

    if (digits.includes(ch)) { return i; }
  }
}

function convert24Hrs(timeStr) {
  timeStr = timeStr.trim();

  return parseFloat(moment(timeStr, 'hh.mm a').format('HH.mm'));
}

function restaurantDataQueryBuilder () {
  let restaurantQuery = 'INSERT INTO restaurants (id, name, balance) VALUES ',
    menuQuery = 'INSERT INTO menu (id, name, price, restaurant) VALUES ',
    openingHoursQuery = 'INSERT INTO opening_hours (id, start, end, day, restaurant) VALUES ',
    restaurantIdCounter = 1,
    menuIdCounter = 1,
    openingHoursCounter = 1;

  for(var i=0; i < restaurants.length; i++) {
    console.log('Generating query for restaurant : ' , restaurants[i].restaurantName, ' id : ', i+1);
    let openingHoursMap = carryForwardTime(parseHours(restaurants[i].openingHours));
    console.log('Got the opening hours');
    for(let [day, hours] of Object.entries(openingHoursMap)) {
      day = days.indexOf(day) + 1;
      hours.forEach(entry => {
        let splits = entry.split(' - ');
        openingHoursQuery += `\n(${openingHoursCounter}, ${splits[0]}, ${splits[1]}, ${day}, ${restaurantIdCounter}),`;
        openingHoursCounter++;
      });
    }

    console.log('Added opening hours query');

    restaurants[i].menu.forEach(menuItem => {
      menuQuery += `\n(${menuIdCounter}, "${menuItem.dishName}", ${menuItem.price}, ${restaurantIdCounter}),`;
      menuIdCounter++;
    });

    console.log('Added menu items query');

    restaurantQuery += `\n(${restaurantIdCounter}, "${restaurants[i].restaurantName}", ${restaurants[i].cashBalance}),`;
    restaurantIdCounter++;

    console.log('Added restaurant query');
  }

  // writing to file
  let content = `\n   --\n   -- Restaurant dummy data insert query\n   --\n   ${restaurantQuery.substring(0, restaurantQuery.length-1)};\n\n   --\n   -- Opening hours dummy data insert query\n   --\n   ${openingHoursQuery.substring(0, openingHoursQuery.length-1)};\n\n   --\n   -- Menu items dummy data insert query\n   --\n   ${menuQuery.substring(0, menuQuery.length-1)};\n `;

  require('fs').writeFile('./dummyInsert.sql', content, {flag: 'a+'}, (err) => {
    if (err) {
      console.log('err');
    }

    console.log('Wrote queries to file');
    process.exit(1);
  });
}

// restaurantDataQueryBuilder();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'food_app'
});
 
connection.connect();
 
connection.query('SELECT m.id, m.name AS menuName, r.name AS restaurantName FROM menu m LEFT JOIN restaurants r ON m.restaurant=r.id WHERE m.name="Sdsapanish Puchero"', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

let queryPromise = (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) return reject(error);
      resolve(results[0]);
    });
  });
};

function userQueryBuilder() {
  let usersQuery = 'INSERT INTO users (id, name, balance) VALUES ';
  let ordersQuery = 'INSERT INTO orders (id, user, restaurant, dish, amount) VALUES ';
  let ordersCounter = 1;
  for(var i=0; i < users.length; i++) {
    let user = users[i];
    user.id = user.id + 1;
    usersQuery += `\n(${user.id}, "${user.name}", ${user.cashBalance}),`;

    console.log('processing user : ', user.id);

    user.purchaseHistory.forEach(async (order) => {

      let res = await queryPromise(`SELECT m.id AS dish, r.id AS restaurant FROM menu m LEFT JOIN restaurants r ON m.restaurant=r.id WHERE m.name="${order.dishName}"`);
      
      console.log('processing order : ', ordersCounter, ' for user : ', user.id);
      ordersQuery += `\n(${ordersCounter}, ${user.id}, ${res.restaurant}, ${res.dish}, ${order.transactionAmount}),`;
      ordersCounter++;
    });
  }

  setTimeout(() => {
    let content = `\n   --\n   -- Users dummy data insert query\n   --\n   ${usersQuery.substring(0, usersQuery.length-1)};\n\n   --\n   -- Orders dummy data insert query\n   --\n   ${ordersQuery.substring(0, ordersQuery.length-1)};\n\n`;

    require('fs').writeFile('./dummyInsert1.sql', content, (err) => {
      if (err) {
        console.log('err');
      }

      console.log('Wrote queries to file');
      process.exit(1);
    });
  }, 120000);
}

userQueryBuilder();

