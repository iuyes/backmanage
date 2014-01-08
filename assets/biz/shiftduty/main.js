/**
 * 客服配置
 */
define(function(require, exports) {
    "use strict";
    
    var win = window;
    var $ = require('jquery');
    var artTemplate = require('artTemplate');
    var Json = require('gallery/json/1.0.2/json');
    
    
	//var Calendar = require('arale/calendar/0.9.0/calendar');
	//require('arale/calendar/0.9.0/calendar.css');
	//require('arale/calendar/0.9.0/i18n/zh-cn');
    
    
    /**
     * 产品数据
     */
    var productData;
    
    /**
     * 分类数据
     */
    var questionCategoryData;
    
    var formUI = function() {

        // 开始
        //new Calendar({trigger: '#startTime', format: 'YYYY MM-DD HH:mm:ss'});
        
        // 结束
        //new Calendar({trigger: '#endTime', format: 'YYYY MM-DD HH:mm:ss'});

        win._ajaxbeforeSubmit = function() {
            var postData = [];
            $('.J_productList').each(function(){
                var $product = $(this);
                var productId = $product.attr('data-productId');
                
                var data = {
                    productId: productId,
                    questionCategoryIds: [],
                }
                
                $product.find('input[type="checkbox"]:checked').each(function(){
                    data.questionCategoryIds.push(this.value); 
                });                
                 
                postData.push(data);
                
            });
                   
            $('#shiftDutyTable').val(Json.stringify(postData));
 
        }
        
        
    
    }();
    
    
    
    
    function _buildData() {
        
        $.each(productData, function(k, v){
            var tmpQuestionCategoryData = [];

            $.each(questionCategoryData, function(k2, v2) {
                var tmp = {
                	questionCategoryName: v2.questionCategoryName,
                    questionCategoryID: v2.questionCategoryID,
                    isSelected: 0
                }

                if (typeof v.selectedTopCategories != 'undefined' && $.inArray(v2.questionCategoryID, v.selectedTopCategories) > -1) {
                    console.log(productData[k]);
                    tmp.isSelected = 1;
                }

                tmpQuestionCategoryData.push(tmp);
            });

            productData[k].questionCategoryData = tmpQuestionCategoryData;
        });
               
    }
    
    
    function renderTabel() {
        _buildData();
        
        var buildHtml = artTemplate.render('shiftdutyBoxTpl', {productData: productData, questionCategoryData: questionCategoryData});
        $('#shiftdutyBox').html(buildHtml);
    }


    return {
        init: function(opts) {
            productData = opts.productData;
            questionCategoryData = opts.questionCategoryData;
            
            renderTabel();
        }
        
    }

})