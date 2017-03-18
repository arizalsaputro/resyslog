app.factory('RestDB', ['$firebaseObject','$firebaseArray','$q',function ($firebaseObject,$firebaseArray,$q) {
		var baseurl = "https://resyslog.firebaseio.com/";
			
        var obj = {};
		/*
		*initialization
		*/
		function init(url){
			return new Firebase(url);
		}

		/*
		*get method 
		*/


		/*
		*get firebase t
		*/

		obj.getFirebase=function(url){
			var uri =  url ? baseurl+url : baseurl;
			return init(uri);
		}

		/*
		*get firebase object
		*/
		obj.getObject=function(url){
			url = baseurl + url;
			return $firebaseObject(init(url));
		}

		/*
		*get firebase array
		*/
		obj.getArray=function(url){
			url = baseurl + url;
			return $firebaseArray(init(url));
		}

		/*
		*get data
		*/

		obj.getOnceData=function(url){
			var deferred = $q.defer();
			url = baseurl + url;
			var ref = init(url);
			ref.once("value", function(data) {
			 	deferred.resolve(data.val());
			});
			return deferred.promise;
		}

		/*
		* save data 
		* param url, object data
		*/

		obj.saveData = function(url,data){
			var deferred = $q.defer();
			url = baseurl + url;
			var ref = init(url);
			ref.set(data);
			deferred.resolve(true);
			return deferred.promise;
		}
		/*
		*update data
		*/
		obj.updateData =function(url,data){
			var deferred = $q.defer();
			url = baseurl + url;
			var ref = init(url);
			ref.update(data);
			deferred.resolve(true);
			return deferred.promise;
		}

		obj.removeData = function(url){
			var deferred = $q.defer();
			url = baseurl + url;
			var ref = init(url);
			ref.remove();
			deferred.resolve(true);
			return deferred.promise;
		}
		
        return obj;

}]);

app.factory('DBAuthHelper', ['$firebaseAuth','$q',function ($firebaseAuth,$q) {
        var baseurl = "https://resyslog.firebaseio.com/";
        var obj = {};
        
        function init(url){
			return new Firebase(url);
		}

		obj.isAuththentification = function(auth){
			var deferred = $q.defer();
			var authData = auth.$getAuth();
			if (authData) {
			  deferred.resolve(true);
			} else {
			  deferred.resolve(false);
			}
			return deferred.promise;
		}

        /*
		*authentification
		*/
       	obj.getAuth=function(){
       		return $firebaseAuth(init(baseurl));
       	}

       	 /*
		* create authentification
		*/
       	obj.createUsers=function(auth,data){
       		var deferred = $q.defer();
       		auth.$createUser({
                email: data.email,
                password: data.password
            }).then(function (userData) {
              	deferred.resolve(userData);
            }).catch(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
       	}
       	/*
		* login create authentification
		*/
       	obj.loginUsers=function(auth,data){
       		var deferred = $q.defer();
		      auth.$authWithPassword({
		                email: data.email,
		                password: data.password
		      }).then(function (authData) {
		      	 deferred.resolve(authData);
		       }).catch(function (error) {   
		            deferred.reject(error);
		        });
		    return deferred.promise;
       	}
       	/*
		* remove user 
		*/
       	obj.removeUser=function(auth,data){
       		var deferred = $q.defer();
       		auth.$removeUser({
			  email: data.email,
			  password: data.password
			}).then(function() {
			  deferred.resolve(true);
			}).catch(function(error) {
			  deferred.reject(error);
			});
			return deferred.promise;
       	}

       	/*
		* changepassword user
		*/

       	obj.changePassword=function(auth,data){
       		var deferred = $q.defer();
       		auth.$changePassword({
			  email: data.email,
			  oldPassword: data.oldPassword,
			  newPassword: data.newPassword
			}).then(function() {
			  deferred.resolve(true);
			}).catch(function(error) {
			  deferred.reject(error);
			});
			return deferred.promise;
       	}

       	/*
		* change email user
		*/

       	obj.changeEmail=function(auth,data){
       		var deferred = $q.defer();
       		auth.$changeEmail({
			  oldEmail: data.oldEmail,
			  newEmail: data.newEmail,
			  password: data.password
			}).then(function() {
			  deferred.resolve(true);
			}).catch(function(error) {
			  deferred.reject(error);
			});
			return deferred.promise;
       	}

       	/*
		* reset user password
		* mengirim ke email user
		*/

       	obj.resetPassword=function(auth,data){
       		var deferred = $q.defer();

       		auth.$resetPassword({
			  email: data.email
			}).then(function() {
			  deferred.resolve(true);
			}).catch(function(error) {
			  deferred.reject(error);
			});

       		return deferred.promise;
       	}

       	obj.isAdministrator=function(uid){
       		var deferred = $q.defer();
       		var url = baseurl + 'admin/' + uid;
       		var fire = init(url);
       		fire.once("value", function(data) {
			 	deferred.resolve(data.val());
			});
			return deferred.promise;
       	}


        return obj;
}]);

app.factory('Notify',['webNotification',function(webNotification) {
	 var obj = {};

	obj.playsound = function() {
        var sound = new Audio('sound/pling.mp3');
        sound.play();
    }

    function playSound(){
    	var sound = new Audio('sound/pling.mp3');
        sound.play();
    }

    obj.makenotify = function(img,text1,text2) {
       	playSound();
        webNotification.showNotification(text1, {
            body: text2,
            icon: img || 'img/icon.png',
            onClick: function onNotificationClicked() {
               
            },
            autoClose: 5000 //auto close the notification after 4 seconds (you can manually close it via hide function)
        }, function onShow(error, hide) {
            if (error) {
                window.alert('Unable to show notification: ' + error.message);
            } else {
                setTimeout(function hideNotification() {
                    hide();
                }, 5000);
            }
        });
    }
    return obj;
}]);