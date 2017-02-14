angular.module('app.services', [])

// delete?
.service('SessionData', function() {
    var user = '';
    return {
        getUser: function() {
            return user;
        },
        setUser: function(value) {
            user = value;
        }
    };
})

.service('storageService', function($q) {
  	return {
	    getStorage: function() {
			var dfd = $q.defer();
			dfd.resolve({ 
				company: window.localStorage['company'],
				domain: window.localStorage['domain'],
				ldap: window.localStorage['ldap'],
				email: window.localStorage['email']
			});
			return dfd.promise
	    }
  	}
})