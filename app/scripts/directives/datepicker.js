angular.module('sigmaAgentApp')
  .directive('datepicker', function(PrerequisiteService, $compile) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {


        fnFormatServerDate = function(oDate){
          if(!oDate){
            return;
          }
          var iD = oDate.getDate(),
              iM = parseInt(oDate.getMonth() + 1),
              iY = oDate.getFullYear();

          sDt = iY + '-';
          sDt += (iM<=9 ? '0' + iM : iM) + '-'; 
          sDt += (iD<=9 ? '0' + iD : iD);
          return sDt;
        };
        fnFormatDate = function(oDate){
          if(!oDate){
            return;
          }
          var iD = oDate.getDate(),
              iM = parseInt(oDate.getMonth() + 1),
              iY = oDate.getFullYear();

          sDt  = (iD<=9 ? '0' + iD : iD) + '/'; 
          sDt += (iM<=9 ? '0' + iM : iM) + '/';
          sDt += iY;
          return sDt;
        };
        fnGetProperMultiDateModel = function(aSplit){
          var oMd;
          switch(aSplit.length){
            case 1:
              oMd = scope[aSplit[0]];
            break;
            case 2:
              oMd = scope[aSplit[0]][aSplit[1]];
            break;
          }
          return oMd;
        };


        var isMultiDate = element.attr('multidate');

        element
          .datePicker({
            createButton: false,
            displayClose: true,
            closeOnSelect: (!isMultiDate ? true : false),
            selectMultiple: (isMultiDate ? true : false),
            startDate: scope[element.attr('dpMinDate')] || '01/01/2001',
            endDate: scope[element.attr('dpMaxDate')] || '10/03/2022'
          }).bind(
            'click',
            function() {
              $(this).dpDisplay();
              this.blur();
              return false;
            }
        )
          .bind(
            'dateSelected',
            function(e, selectedDate, $td, state)
            {
              console.log('You ' + (state ? '' : 'un') // wrap
                + 'selected ' + selectedDate);

              if(!state){
               element.clearSelected();
              }

              
            }
          )
         .bind('dpClosed',function(e, selectedDates) {
            if(isMultiDate) {
              var oMultiDate = element.attr('multidate-model');
              var oDot = oMultiDate.split('.'),
                  oMd = fnGetProperMultiDateModel(oDot);               

              for(var i=0;i<selectedDates.length;i++){
                var sD = fnFormatServerDate(selectedDates[i]);
                oMd.push(sD);
              }    
              console.log('DateClosed:: Selected: ',oMd.join());
            } else {
              ngModel.$setViewValue(fnFormatDate(selectedDates[0]));
              ngModel.$render();
            }
          });

        // scope.$watch('model',function(){
        //   console.log('watching date....', model.$modelValue);
        //   element.dpSetSelected(model.$modelValue);
        // });

        scope.$watch(function () {
            return ngModel.$modelValue;
         }, function(newValue) {
             console.log('watching date....', ngModel.$modelValue, newValue);
            element.dpSetSelected(ngModel.$modelValue);
         });

        element.bind('blur', function(){
          var sVal = element.val(),
              aVal = sVal.split('/');
          if(   sVal.length != 10
             || (aVal.length != 3)
             || (isNaN(aVal[0]) || isNaN(aVal[1]) || isNaN(aVal[2]))
          ){
            element.val(PrerequisiteService.fnFormatDate());
            alert('Please enter a valid date.');
            return;
          }
        });

      }
    };
  });