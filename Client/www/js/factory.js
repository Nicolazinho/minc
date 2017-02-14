angular.module('app.factory', [])

// .factory('fbFactory', function($firebaseArray,$q) {
//     // var itemsRef = new Firebase('https://glaring-fire-1308.firebaseio.com');
//     // return $firebaseArray(itemsRef);

//     return {
//       fbRef: function() {
//         var dfd = $q.defer();
//         dfd.resolve({
//           base: new Firebase('https://glaring-fire-1308.firebaseio.com')
//         });
//         return dfd.promise
//       }
//     }
  
// })

// .factory("fbArrayFavs", ["$firebaseArray",
//   function($firebaseArray) {
//     var fbArrayFavs = $firebaseArray.$extend({
//       getTotal: function() {
//         console.log('this list ' + this.$list);
//         var total = 0;
//         angular.forEach(this.$list, function(rec) {
//           console.log('rec ' + rec);
//           total += rec.amount;
//         });
//         return total;
//       }
//     });
//     return function(listRef) {
//       return new fbArrayFavs(listRef);
//     }
//   }
// ]);