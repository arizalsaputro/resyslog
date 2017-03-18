app.factory('SideNavUtils', ['$timeout', '$mdSidenav', '$log',
    function ($timeout, $mdSidenav, $log) {

           var obj = {};
         
            obj.getToggle = function(position){
                return buildDelayedToggler(position);
            };

            obj.isLeftOpen = function(position){
                return $mdSidenav(position).isOpen();
            };

            obj.buildToggle = function(position){
                return  buildToggler(position);
            };

            obj.openSideNavPanel = function(position){
                return $mdSidenav(position).open();
            };

            obj.closeSideNavPanel = function(position){
                return $mdSidenav(position).close();
            };

            /**
             * Supplies a function that will continue to operate until the
             * time is up.
             */
            function debounce(func, wait, context) {
              var timer;
              return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                  timer = undefined;
                  func.apply(context, args);
                }, wait || 10);
              };
            }
            /**
             * Build handler to open/close a SideNav; when animation finishes
             * report completion in console
             */
            function buildDelayedToggler(navID) {
              return debounce(function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                  .toggle()
                  .then(function () {
                    $log.debug("toggle " + navID + " is done");
                  });
              }, 200);
            }
            function buildToggler(navID) {
              return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                  .toggle()
                  .then(function () {
                    $log.debug("toggle " + navID + " is done");
                  });
              }
            }
       
        return obj;
}]);


app.factory('MenuUtils', [
    function () {

        var obj = {};
        var originatorEv;

        obj.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
            
        return obj;
}]);

app.factory('DialogUtils', ['$mdDialog','$q','ngProgressFactory','$mdMedia','$mdBottomSheet',function ($mdDialog,$q,ngProgressFactory,$mdMedia,$mdBottomSheet) {
        var obj = {};

        obj.createProgress = function(){
          return ngProgressFactory.createInstance();
        }
        
        obj.showAlert = function(ev,data) {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title(data.title)
              .textContent(data.content)
              .ariaLabel("Waspada")
              .ok('Mengerti!')
              .targetEvent(ev)
          );
        };

        

        obj.showBottomGrib=function(data){
            $mdBottomSheet.show({
              templateUrl: data.template,
              controller: data.controller,
              clickOutsideToClose: data.clickable
          });
        };

        obj.cancel=function(){
          $mdDialog.cancel();
        };

        obj.hide = function(){
          $mdDialog.hide();
        };

        obj.showPrompt = function(ev,data) {
          var def = $q.defer();
          var confirm = $mdDialog.prompt()
          .title(data.title)
          .textContent(data.content)
          .placeholder(data.placeholder)
          .ariaLabel(data.label)
          .ok('Oke')
          .cancel('batal');

         $mdDialog.show(confirm).then(function(result){
            def.resolve(result);
         });

           return def.promise;
        };

        obj.showCustomDialog=function(ev,data){
          $mdDialog.show({
            controller: data.controller,
            templateUrl: data.template,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
          });
        };

        obj.showConfirm = function(ev,data) {
          var def = $q.defer();
          var confirm = $mdDialog.confirm()
                .title(data.title)
                .textContent(data.content)
                .ariaLabel(data.label)
                .targetEvent(ev)
                .ok('okay')
                .cancel('batal');
          $mdDialog.show(confirm).then(function() {
            def.resolve(true);
          }, function() {
            def.reject(false);
          });
          return def.promise;
        };

            
        return obj;
}]);


app.factory('ToastUtils', ['$mdToast',function ($mdToast) {

        var obj = {};
        
        var last = {
          bottom: true,
          top: false,
          left: false,
          right: true
        };
        var toastPosition = angular.extend({},last);
        function getToastPosition() {
          sanitizePosition();
          return Object.keys(toastPosition)
            .filter(function(pos) { return toastPosition[pos]; })
            .join(' ');
        };

        function sanitizePosition() {
          var current = toastPosition;
          if ( current.bottom && last.top ) current.top = false;
          if ( current.top && last.bottom ) current.bottom = false;
          if ( current.right && last.left ) current.left = false;
          if ( current.left && last.right ) current.right = false;
          last = angular.extend({},current);
        }

        obj.showSimpleToast = function(text,config) {
          if(config){
            last = config;
          }
          var pinTo = getToastPosition();
          $mdToast.show(
            $mdToast.simple()
              .textContent(text)
              .position(pinTo )
              .hideDelay(3000)
          );
        };
            
        return obj;
}]);

app.factory('ErorException', ['DialogUtils',function (DialogUtils) {

        var obj = {};
       
        obj.checkError=function(ev,error){
          var fail = {};
          fail.title = "Gagal";
          switch(error){
            case "AUTHENTICATION_DISABLED":fail.content = "Authentication tidak aktiv";break;
            case "EMAIL_TAKEN":fail.content = "Alamat email sudah digunakan oleh pengguna lain,cobalah menggunakan alamat email yang berbeda.";break;
            case "INVALID_ARGUMENTS": fail.content = "Terjadi kesalahan pada argumen.";break;
            case "INVALID_CONFIGURATION": fail.content = "Terjadi kesalahan pada konfigurasi.";break;
            case "INVALID_CREDENTIALS":fail.content = "Credentials tidak sah.";break;
            case "INVALID_EMAIL": fail.content = "Alamat email tidak valid, email tidak terdaftar";break;
            case "INVALID_ORIGIN": fail.content = "Asal tidak valid";break;
            case "INVALID_PASSWORD": fail.content = "Kata sandi tidak benar, periksa kembali sandi Anda";break;
            case "INVALID_PROVIDER" : fail.content = "Provide tidak valid";break;
            case "INVALID_TOKEN" : fail.content = "Token tidak valid";break;
            case "INVALID_USER": fail.content = "Email atau pengguna tidak terdaftar";break;
            case "NETWORK_ERROR": fail.content = "Kesalahan jaringan, coba lagi nanti";break;
            case "PROVIDER_ERROR": fail.content = "Kesalahan penyedia, coba lagi nanti";break;
            case "TRANSPORT_UNAVAILABLE": fail.content = "Transportasi error, coba lagi nanti";break;
            case "USER_CANCELLED": fail.content = "Proses dibatalkan";break;
            case "USER_DENIED" :fail.content = "You have no access to login,contact administrator";break;
            case "UNKNOWN_ERROR": fail.content = "Terjadi kesalahan yang tidak diketahui,coba lagi nanti.";break;
            case "NOT_ADMIN": fail.content = "Anda bukan administrator,anda tidak memiliki akses.";break;
            
          }

          DialogUtils.showAlert(ev,fail);
        }
            
        return obj;
}]);