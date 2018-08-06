var FormValidation = function () {


    return {
        //main function to initiate the module
        init: function () {

            // for more info visit the official plugin documentation: 
            // http://docs.jquery.com/Plugins/Validation

            var form1 = $('#form_sample_1');
            var error1 = $('.alert-error', form1);
            var success1 = $('.alert-success', form1);

            var submitBtn=$('#submitBtn');

            Array.prototype.unique = function(){
            	var n = {},r=[]; //n为hash表，r为临时数组
            	for(var i = 0; i < this.length; i++) //遍历当前数组
            	{
            		if (!n[this[i]]) //如果hash表中没有当前项
            		{
            			n[this[i]] = true; //存入hash表
            			r.push(this[i]); //把当前数组的当前项push到临时数组里面
            		}
            	}
            	return r;
            }

            Array.prototype.removeByValue = function(val) {
              for(var i=0; i<this.length; i++) {
                if(this[i] == val) {
                  this.splice(i, 1);
                  break;
                }
              }
            };
            var array=new Array();
            var flag=false;
            submitBtn.hide();
            var fromValidate= form1.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                        name: {required: true},
                        code: {required: true},
                        idCardNo: {minlength: 16,maxlength: 18,required: true},
                        email: {required: true,email: true},
                        linkPhone: {minlength: 11,maxlength: 11,required: true},
                       costRate: {required: true},
                       expireDateString: {required: true},
                       expireTimeString: {required: true}
                },
                messages: {
                        idCardNo: {required: "请输入身份证号码",minlength: "大于等于16",maxlength: "小于等于18"},
                        linkPhone: {required: "请输入手机号码",minlength: "请输入11位数字",maxlength: "请输入11位数字"}
                 },

                invalidHandler: function (event, validator) { //display error alert on form submit              
                    //success1.hide();
                    //error1.show();
                    submitBtn.hide();
                    //App.scrollTo(error1, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                        //array.unique();
                       //array.removeByValue(element.name);
                       submitBtn.hide();
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                       // array.push(element.name);
                        //array.unique();
                        // console.info('---------------------');
                       //for(var i=0;i<array.length;i++){
                            // console.info('--'+array[i]);
                      // }
                        //console.info('-------------------------');
                        //if(array.length>=7){
                              submitBtn.show();
                        //}
                },

                success: function (label) {
                    label
                        .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                    .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                },

                submitHandler: function (form) {
                    submitBtn.show();
                    //success1.show();
                    //error1.hide();
                }
            });

            //Sample 2
            $('#form_2_select2').select2({
                placeholder: "Select an Option",
                allowClear: true
            });

            var form2 = $('#form_sample_2');
            var error2 = $('.alert-error', form2);
            var success2 = $('.alert-success', form2);

            form2.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    name: {
                        minlength: 2,
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    category: {
                        required: true
                    },
                    options1: {
                        required: true
                    },
                    options2: {
                        required: true
                    },
                    occupation: {
                        minlength: 5,
                    },
                    membership: {
                        required: true
                    },
                    service: {
                        required: true,
                        minlength: 2
                    }
                },

                messages: { // custom messages for radio buttons and checkboxes
                    membership: {
                        required: "Please select a Membership type"
                    },
                    service: {
                        required: "Please select  at least 2 types of Service",
                        minlength: jQuery.format("Please select  at least {0} types of Service")
                    }
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "education") { // for chosen elements, need to insert the error after the chosen container
                        error.insertAfter("#form_2_education_chzn");
                    } else if (element.attr("name") == "membership") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_2_membership_error");
                    } else if (element.attr("name") == "service") { // for uniform checkboxes, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_2_service_error");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavoir
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   
                    success2.hide();
                    error2.show();
                    App.scrollTo(error2, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    if (label.attr("for") == "service" || label.attr("for") == "membership") { // for checkboxes and radip buttons, no need to show OK icon
                        label
                            .closest('.control-group').removeClass('error').addClass('success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                        .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                    }
                },

                submitHandler: function (form) {
                    success2.show();
                    error2.hide();
                }

            });

            //apply validation on chosen dropdown value change, this only needed for chosen dropdown integration.
            $('.chosen, .chosen-with-diselect', form2).change(function () {
                form2.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });

             //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
            $('.select2', form2).change(function () {
                form2.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });

        }

    };

}();