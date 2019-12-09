/*
	jQuery Year Calendar
	https://github.com/toporchillo/jQuery-year-calendar/

	inspired by "jQuery Verbose Calendar" by John Patrick Given


	MIT License

	Copyright (c) 2013 Alexander Toporkov (toporchillo@gmail.com)

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function () {
	function setup ($) {
		//
		// Globals
		var pluginName = 'year_calendar',
			pl = null,
			d = new Date();

		//
		// Defaults
		defaults = {
			d: d,
			year: d.getFullYear(),
			today: d.getDate(),
			month: d.getMonth(),
			current_year: d.getFullYear(),
			scroll_to_date: true,
			events: [],
			date_styles: [],
			event_click: null,
			day_click: null,
			range_select: null,
			range_unselect: null,
			markers: [],
			marker_click: null
		};

		month_array = [
			 '12',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
			'11',
			'12',
			 '1' 
		];

		month_days = [
			 '31', 
			'31', // jan
			'28', // feb
			'31', // mar
			'30', // apr
			'31', // may
			'30', // june
			'31', // july
			'31', // aug
			'30', // sept
			'31', // oct
			'30', // nov
			'31',  // dec
			 '31'
		];

//		week_days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		week_days = ['', '', '', '', '', '', ''];
		//
		// Main Plugin Object
		function Calendar(element, options) {
			pl = this;
			this.element = element;
			this.options = $.extend({}, defaults, options);
			this._defaults = defaults;
			this._name = pluginName;


			//
			// Begin
			this.init();
		}

		//
		// Init
		Calendar.prototype.init = function() {
			this.print();
		}

		Calendar.prototype.print = function(year) {
			//
			// Pass in any year you damn like.
			var the_year = (year) ? parseInt(year) : parseInt(pl.options.year);

			//
			// First, clear the element
			$(this.element).empty();

			//
			// Append parent div to the element
			$(this.element).append('<div id=\"year-calendar\"></div>');

			//
			// Set reference for calendar DOM object
			var $_calendar = $('#year-calendar');

			//
			// Status data
//			$_calendar.append('<div id=\"status\"><div id=\"hover\"></div><div id=\"selection\">選擇日期:</div></div>');
			$_calendar.append('<div id=\"status\"><div id=\"hover\"></div></div>');
			//
			// Navigation arrows
			$_calendar.append('<div id=\"arrows\"></div>');


			//
			// DOM object reference for arrows
			$_arrows = $('#arrows');
			// Let's append the year
			$_arrows.append('<div class=\"prev\ btn">&laquo;</div>');
			for (var i=0; i<the_year.toString().length; i++) {
				var o = the_year.toString()[i];
				$_arrows.append('<div class=\"year\">' + o + '</div>');
			}
			$_arrows.append('<div class=\"next btn\">&raquo;</div>');

			//
			// Add a clear for the floated elements
			$_calendar.append('<div class=\"clear\"></div>');

			$_calendar.append('<div class=\"label label-calendar bold\"></div>');
			for (j = 1; j <= 31; j++) {
				$_calendar.append('<div class=\"label label-calendar header\">'+j+'</div>');
			}

			//
			// Loop over the month arrays, loop over the characters in teh string, and apply to divs.
			$.each(month_array, function(i, o) {
				if (i!=0 && i!=13){
					if (i==1 || i==13)
						$_calendar.append('<div class=\"yearbrake\"></div>');
	
					//
					// Create a scrollto marker
					if (typeof o != 'undefined')
						$_calendar.append('<div class=\"label label-calendar bold\">' + o + '</div>');
	
					//
					// Check for leap year
					if (o === '2') {
						if (pl.isLeap(the_year)) {
							month_days[i] = 29;
						} else {
							month_days[i] = 28;
						}
					}
	
					for (j = 1; j <= parseInt(month_days[i]); j++) {
						//
						// Check for today
						var today = '';
						if ((i-1) === pl.options.month && the_year === d.getFullYear()) {
							if (j === pl.options.today) {
								today = 'today';
							}
						}
	
						mon = parseInt(i);
						if (mon == 0)
							var date = new Date(12 + '/' + j + '/' + (the_year-1));
						else if (mon == 13)
							var date = new Date(1 + '/' + j + '/' + (the_year+1));
						else
							var date = new Date(mon + '/' + j + '/' + the_year);
						date.setHours(12,0);
						var da = date.getDay();
						var da_label = week_days[da];
						weekend = '';
						if (da == 0 || da == 6) weekend = ' weekend';
	
						var evt = '';
						$.each(pl.options.events, function(i,v) {
							var v_start = v.start;
							var v_end = v.end;
							var style = (v.type ? ' '+v.type : '')
							if (v_end.valueOf() == date.valueOf()) {
								evt = '<div class="events event-end'+style+'" data-_id="'+v._id+'"></div>';
								return;
							}
							else if (v_start.valueOf() == date.valueOf()) {
								evt = evt + '<div class="events event-start'+style+'" data-_id="'+v._id+'"></div>';
								return;
							}
							else if (v_start.valueOf() < date.valueOf() && v_end.valueOf() > date.valueOf()) {
								evt = '<div class="events event'+style+'" data-_id="'+v._id+'"></div>';
								return;
							}
						});
	
						var marker = '';
						$.each(pl.options.markers, function(i,m) {
							var v = m.date.setHours(12,0);
							if (v.valueOf() == date.valueOf()) {
								marker = '<div class="markers" data-title="' + m.title + '"></div>';
								return;
							}
						});
	
						var day_label = '';
						var day_color = '';
						$.each(pl.options.date_styles, function(i,v) {
							if (v.start.valueOf() <= date.valueOf() && v.end.valueOf() >= date.valueOf()) {
								day_label =day_label+ ' '+v.label;
								day_color = v.color;
								return;
							}
						});
	
						//
						// Looping over numbers, apply them to divs
						var cell = $("<div data-date='" + (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear() + "' class='label label-calendar day " + today + weekend + day_label + "' style='background-color: " + day_color + ";'>" + da_label + evt + marker + '</div>');
						$_calendar.append(cell);
					}
	
					//
					// Add a clear for the floated elements
					$_calendar.append('<div class=\"clear\"></div>');
				}
			});

//			$_calendar.append('<div id=\"legend\"></div>');
//			$_legend = $('#legend');
//			$.each(pl.options.date_styles, function(i,style) {
//				$_legend.append('<div class="legend-item"><div class=\"label label-calendar day ' + style.label + '\" style="background-color: ' + style.color + ';"></div><span>' + style.title + '</span></legend-item>');
//			})
		}

				
		
		//
		// Previous / Next Year on click events
		$(document).on('click', '#year-calendar #arrows .next', function() {
			pl.options.year = parseInt(pl.options.year) + 1;

			pl.print(pl.options.year);
		});

		$(document).on('click', '#year-calendar #arrows .prev', function() {
			pl.options.year = parseInt(pl.options.year) - 1;

			pl.print(pl.options.year);
		});

		$(document).on('mouseover', '#year-calendar .day', function() {
			$('#year-calendar #hover').html($(this).data('date'));
		});
		$(document).on('mouseout', '#year-calendar .day', function() {
			$('#year-calendar #hover').html('');
		});

		$(document).on('mousedown', '#year-calendar .events', function(e) {
			e.stopPropagation();
		})

		$(document).on('mousedown', '#year-calendar .markers', function(e) {
			e.stopPropagation();
		})

	/*
		$(document).on('mouseup', '#year-calendar .events', function(e) {
			e.stopPropagation();
		})
	*/

		$(document).on('click', '#year-calendar .events', function(e) {
			e.stopPropagation();
			$('#year-calendar .events').removeClass('selected');
			$('#year-calendar .markers').removeClass('selected');
			$('#year-calendar .events[data-_id="'+$(this).data('_id')+'"]').addClass('selected');
			if ($.isFunction(pl.options.event_click)){
				pl.options.event_click($(this));
			}
		});

		$(document).on('click', '#year-calendar .markers', function(e) {
			e.stopPropagation();
			$('#year-calendar .events').removeClass('selected');
			$('#year-calendar .markers').removeClass('selected');
			$('#year-calendar .markers[data-_id="'+$(this).data('_id')+'"]').addClass('selected');
			if ($.isFunction(pl.options.marker_click))
				pl.options.marker_click($(this));
		});

		$(document).on('click', 'body', function(e) {
			$('#year-calendar .events').removeClass('selected');
			$('#year-calendar .markers').removeClass('selected');
		})



		$(document).on('click', '#year-calendar .day', function(e) {
			
			$('#year-calendar .events').removeClass('selected');
			$('#year-calendar .markers').removeClass('selected');
			if ($.isFunction(pl.options.day_click))
				pl.options.day_click($(this));
		})

		$(document).on('mousedown', '#year-calendar .day', function(e) {
			e.preventDefault();
			if (DAY_SELECTED || DAY_SELECTED2)
				cancelSelect();
			startSelect($(this));
		})

		$(document).on('mouseup', '#year-calendar .day', function(e) {
			e.preventDefault();
			e.stopPropagation();
			// console.log(DAY_SELECTED);
			// console.log(DAY_SELECTED2);
			if (DAY_SELECTED && !DAY_SELECTED2){

				endSelect($(this));
			}
		})

		var DAY_SELECTED = null;
		var DAY_SELECTED2 = null;
		var cleaningMode=false;
		var dindex = null;
	
		
		/////////////////////////////////////
		// parse a date in mm-dd-yyyy format
		function parseDate(input) {
		  var parts = input.split('/');
		  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
		  return new Date(parts[2],parts[0]-1,parts[1]); // Note: months are 0-based
		}
		
		function findDateInArr(nextDate){
			for (var i=0; i<pl.options.date_styles.length; i++)
				console.log(pl.options.date_styles[i]);
			
			return true;
		}
		/////////////////////////////////////
		
		
		function startSelect(day) {
			//$('#year-calendar .day').removeClass('selected');
				if(day.hasClass('selected')){
					day.removeClass('selected');
					cleaningMode=true;
				}
				else{
					day.addClass('selected');
					cleaningMode=false;
				}
				DAY_SELECTED = day;
			
				
				dindex = day.index("#year-calendar .day");
				$(document).on('mouseover', '#year-calendar .day', selectRangeOver);
				$(document).on('mouseout', '#year-calendar .day', selectRangeOut)
			
		}

		//original:
		// var selectRangeOver = function(e) {
		// 	var idx = $(this).index("#year-calendar .day");
		// 	$('#year-calendar .day').filter(':lt('+(dindex+1)+'):gt('+(idx-1)+')').addClass('selected');
		// 	$('#year-calendar .day').filter(':lt('+(idx+1)+'):gt('+(dindex-1)+')').addClass('selected');
		// }
		// var selectRangeOut = function(e) {
		// 	$('#year-calendar .day').removeClass('selected');
		// 	$(DAY_SELECTED).addClass('selected');
		// }

		var selectRangeOver2 = function(e) {
			var idx = $(this).index("#year-calendar .day");
			// console.log('1.dindex='+dindex);
			// console.log('1.idx='+idx);
			$('#year-calendar .day').filter(':lt('+(dindex+1)+'):gt('+(idx-1)+')').removeClass('selected');
			$('#year-calendar .day').filter(':lt('+(idx+1)+'):gt('+(dindex-1)+')').removeClass('selected');
			DAY_SELECTED= $(this);
			
		}

		var selectRangeOut2 = function(e) {
			//dindex: start index, idx: end
			var idx = $(this).index("#year-calendar .day");
			// console.log('2.dindex='+dindex);
			// console.log('2.idx='+idx);
		
			//this part response for cancel selecting while draging back
			$('#year-calendar .day').filter(':lt('+(dindex+1)+'):gt('+(idx-1)+')').removeClass('selected');
			//this part response for cancel selecting while draging forward
			$('#year-calendar .day').filter(':lt('+(idx+1)+'):gt('+(dindex-1)+')').removeClass('selected');
			DAY_SELECTED= $(this);
			// console.log(DAY_SELECTED);
		}

		var selectRangeOver = function(e) {
			var idx = $(this).index("#year-calendar .day");



			// if($('#year-calendar .day').filter(':eq( '+(dindex)+')').hasClass('selected')){

			// 	$('#year-calendar .day').filter(':lt('+(dindex+1)+'):gt('+(idx-1)+')').removeClass('selected');
			// 	$('#year-calendar .day').filter(':lt('+(idx+1)+'):gt('+(dindex-1)+')').removeClass('selected');
			// 	alert("clear");
			// }else
			if($(this).hasClass("selected")==false && cleaningMode==false){
				// console.log("range over");
				// console.log(DAY_SELECTED);
				////////////////////try to comment
				$('#year-calendar .day').filter(':lt('+(dindex+1)+'):gt('+(idx-1)+')').addClass('selected');
				$('#year-calendar .day').filter(':lt('+(idx+1)+'):gt('+(dindex-1)+')').addClass('selected');

				///////////////////
			}
			else if (cleaningMode==true)
				{
					// cleaningMode=true;
					$(this).removeClass('selected');
					$('#year-calendar .day').filter(':lt('+(dindex+1)+'):gt('+(idx-1)+')').removeClass('selected');
					// console.log(':lt('+(dindex+1)+'):gt('+(idx-1)+')'+'is removed');
					//this part response for cancel selecting while draging forward
					$('#year-calendar .day').filter(':lt('+(idx+1)+'):gt('+(dindex-1)+')').removeClass('selected');
					// console.log(':lt('+(idx+1)+'):gt('+(dindex-1)+')'+'is removed');
				}
		}

		var selectRangeOut = function(e) {
			//dindex: start index, idx: end
			var idx = $(this).index("#year-calendar .day");

			if (	DAY_SELECTED.hasClass('selected') && cleaningMode==true){
				//DAY_SELECTED= $(this);
				// console.log("hello");
				DAY_SELECTED.removeClass('selected');

			}
			if (cleaningMode==true){
				//this part response for cancel selecting while draging back	
				$('#year-calendar .day').filter(':lt('+(dindex+1)+'):gt('+(idx-1)+')').removeClass('selected');
				// console.log(':lt('+(dindex+1)+'):gt('+(idx-1)+')'+'is removed');
				//this part response for cancel selecting while draging forward
				$('#year-calendar .day').filter(':lt('+(idx+1)+'):gt('+(dindex-1)+')').removeClass('selected');
				// console.log(':lt('+(idx+1)+'):gt('+(dindex-1)+')'+'is removed');
			}
		}
		
		
/////////////////////////////
		
		function showHint(str)
		{
			var xmlhttp;
			if (str.length==0)
			  { 
			  document.getElementById("txtHint").innerHTML="";
			  return;
			  }
			if (window.XMLHttpRequest)
			  {// code for IE7+, Firefox, Chrome, Opera, Safari
			  xmlhttp=new XMLHttpRequest();
			  }
			else
			  {// code for IE6, IE5
			  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			  }
			
			//when jsp result is returned
			xmlhttp.onreadystatechange=function()
			  {
			  if (xmlhttp.readyState==4 && xmlhttp.status==200)
			    {
			    document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
			    ////
			    var old_choice=$("input[name='applType']:checked");
//			    console.log(old_choice.val());
			    ////
			    var str=xmlhttp.responseText.replace(/^\s+|\s+$/gm,'');
			    str="#"+str;
			   
			    var new_choice=$(str);
//			    console.log('new_choice='+new_choice.val());
			    if ((old_choice.val()=='preHoliday' || old_choice.val()=='ChangeHoliday') && new_choice.val()=='preHoliday')
			    	;
			    else
			    	$(str).prop('checked', true);
			    
			    
			    
			    
			    
			    if(str=="#choice3"){
			    		$("#choice1").prop('disabled', true);
			    		$("#choice2").prop('disabled', false);
			    		$("#choice3").prop('disabled', false);
			    		$("#changeHoliBox").prop('disabled', true);
			    		
			    		$("#C1").val("disabled");
			    		$("#C2").val("");
			    		$("#C3").val("");
			    		$("#C4").val("disabled");
			    		
			    }
			    else if (str=="#choice1"){
			    		$("#choice1").prop('disabled', false);
			    		$("#choice2").prop('disabled', false);
			    		$("#choice3").prop('disabled', true);
			    		$("#changeHoliBox").prop('disabled', true);
			    		
			    		$("#C1").val("");
			    		$("#C2").val("");
			    		$("#C3").val("disabled");
			    		$("#C4").val("disabled");
			    }
			    else if (str=="#choice2"){
			    		$("#choice1").prop('disabled', true);
			    		$("#choice2").prop('disabled', false);
			    		$("#choice3").prop('disabled', true);
			    		$("#changeHoliBox").prop('disabled', false);
			    		
			    		$("#C1").val("disabled");
			    		$("#C2").val("");
			    		$("#C3").val("disabled");
			    		$("#C4").val("");
			    }
			    else if (str=="#choice5"){
			    	$("#choice2").prop('checked', true);
			    	
			    	$("#choice1").prop('disabled', true);
		    		$("#choice2").prop('disabled', false);
		    		$("#choice3").prop('disabled', true);
		    		$("#changeHoliBox").prop('disabled', true);
		    		
		    		$("#C1").val("disabled");
		    		$("#C2").val("");
		    		$("#C3").val("disabled");
		    		$("#C4").val("disabled");
			    	
			    	
			    }
			    	
			   }
			}
			
//			var date1=$("#datepicker").datepicker({ dateFormat: "dd-mm-yy" }).val()
//			var date2=$("#datepicker2").datepicker({ dateFormat: "dd-mm-yy" }).val()
			var date1=$('#from_date_normal').val();
			var date2=$('#to_date_normal').val();
			
			var url="getHint.jsp?selectedDate1="+date1+"&selectedDate2="+date2;
			xmlhttp.open("GET",url,true);
			//console.log(url);
			xmlhttp.send();
		}
		
		/////////////////////////////
		
		
		
		function endSelect(day) {
			DAY_SELECTED2 = day;
			if (new Date(DAY_SELECTED2.data('date')) < new Date(DAY_SELECTED.data('date'))) {
				tmp = DAY_SELECTED;
				DAY_SELECTED = DAY_SELECTED2;
				DAY_SELECTED2 = tmp;
			}
			// day.addClass('selected');
			$(document).off('mouseover', '#year-calendar .day', selectRangeOver);
			$(document).off('mouseout', '#year-calendar .day', selectRangeOut);
			/////////////////////////////
			// alert("hello");
			// $(document).off('mouseover', '#year-calendar .day', selectRangeOver2);
			// $(document).off('mouseout', '#year-calendar .day', selectRangeOut2);
			////////////////////////////
			$('#year-calendar #selection').html(DAY_SELECTED.data('date')+' - '+DAY_SELECTED2.data('date'));
			
			//dateArr: union of public holiday and selected days
			var dateArr=[];	//string arr
			var selectedDateArr=[];	//Date obj arr
			
			var holidayArr=[]; //string arr
			
			$( "body" ).find( ".label.label-calendar.day.selected" ).each(function(index) {
				
				//push date strs into array
				dateArr.push( parseDate($(this).attr("data-date")).getTime() );
				selectedDateArr.push(parseDate($(this).attr("data-date")));
//				$("#selectedRange").append($(this).attr("data-date"));
//				console.log("index:"+index+" "+$(this).attr("data-date"));
			});
			
			//now we have 2 arrs: dateArr and date_styles{ start:new Date(2015, 11, 1), end:new Date(2015, 2, 1)...
			
			var startDate_i=0
			var endDate_i=dateArr.length-1;
			//push the public holiday into dateArr and holidayArr
			for(var i=0;i<pl.options.date_styles.length;i++){
				if(pl.options.date_styles[i].title=="public-holiday"){
					//dateArr.push(pl.options.date_styles[i].start.getTime());
					var startDate=new Date(pl.options.date_styles[i].start);
					var endDate=new Date(pl.options.date_styles[i].end);
					
					var oneDay = 24*60*60*1000; 
					
					var diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
					// diffDays++;
					var tmp=new Date(startDate);
					for(var j=0;j<diffDays;j++){
						holidayArr.push(tmp.getTime());
						dateArr.push(tmp.getTime());
	//					console.log("holiday:"+tmp);
						tmp.setDate(tmp.getDate()+1);
					}
				}
			}
			
//			for(var i=0;i<dateArr.length;i++)
//				console.log(new Date(dateArr[i]));
//			console.log("endDate_i="+endDate_i);
			
			var nextDate;
			var continuous=true;
			var startDate=new Date(selectedDateArr[0]);
			var endDate=new Date(selectedDateArr[endDate_i]);
			
			
			var oneDay = 24*60*60*1000; 
			var diff = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
			
			if (endDate_i>0)
			for(var i = startDate_i; i < diff; i++) {
				
				nextDate=new Date(startDate.getTime());
				nextDate.setDate(nextDate.getDate()+i+1);
//				console.log("nextDate="+nextDate);
				if($.inArray( nextDate.getTime(), dateArr)==-1 ){
					continuous=false;
//					console.log("cannot find next day in dateArr");
				}
				else
					continuous= continuous&&true;
					
				
			}	
		
			if (continuous){
				if (isNaN(startDate.getDate())==false){
					$("#selectedRange").html($("#lang_select_holi").val()+": "+startDate.getDate()+"/"+(startDate.getMonth()+1)+"/"+startDate.getFullYear()+" - "+endDate.getDate()+"/"+(endDate.getMonth()+1)+"/"+endDate.getFullYear());
//					console.log("startDate="+startDate);
					$('#from_date_normal').val((startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+startDate.getFullYear());
					$('#to_date_normal').val((endDate.getMonth()+1)+"/"+endDate.getDate()+"/"+endDate.getFullYear());
					showHint("test");
				}
				else{
					$("#selectedRange").html($("#lang_select_holi").val()+": ");
					$('#from_date_normal').val("");
					$('#to_date_normal').val("");
				}
				
//				console.log(continuous);
			}
			else{
				$("#selectedRange").html($("#enterContinousHoli").val())
//				alert($("#enterContinousHoli").val());
				//$('#from_date_normal').val("");
				$('#to_date_normal').val("");
//				console.log(continuous)	;
			}	
				
			//check if selected days are applied days
			var selectedDateStrArr=[];
			for(var i=0; i<selectedDateArr.length;i++){
				selectedDateStrArr.push(selectedDateArr[i].getTime());
				
			}
			
			//check if selected days are valid
			$('#js_msg').val("");
			for(var i=0;i<pl.options.date_styles.length;i++){
//				console.log("inside for loop");
				if(pl.options.date_styles[i].title=="applied_hol" || pl.options.date_styles[i].title=="non_blue" || pl.options.date_styles[i].title=="from_change_hol" ){
//					console.log("applied_hol found");
					
					var startDate=new Date(pl.options.date_styles[i].start);
					var endDate=new Date(pl.options.date_styles[i].end);
					
					var oneDay = 24*60*60*1000; 
					
					var diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
					// diffDays++;
//					console.log("diffDays="+diffDays);
					var tmp=new Date(startDate);
//					console.log(typeof selectedDateArr[0]);
					for(var j=0;j<diffDays;j++){
						//console.log($.inArray(tmp.getTime(),selectedDateArr));
						if( $.inArray(tmp.getTime(),selectedDateStrArr)!=-1 ){
//							alert("selected days are applied holidays");
							if(pl.options.date_styles[i].title=="applied_hol" || pl.options.date_styles[i].title=="non_blue")
								$('#js_msg').val($("#notUsedHoli2").val());
							//check if selected day is changed(in f_plan_o but not f_plan_m)
//							if(pl.options.date_styles[i].title=="from_change_hol")
//								$('#js_msg').val($("#notChangedHoli2").val());
						}
//						dateArr.push(tmp.getTime());
						tmp.setDate(tmp.getDate()+1);
					}
				}
			}
			//check if selected dates are all holidays
			var isAllHol=true;
			for(var i=0; i<selectedDateArr.length; i++){
				if($.inArray(selectedDateArr[i].getTime(),holidayArr)==-1){
					isAllHol=false;
				}
			}
			if (isAllHol==true)
				$('#js_msg').val("所選日期為假日，請重新輸入。");
			///////////////////
			
			if ($.isFunction(pl.options.range_select))
				pl.options.range_select(DAY_SELECTED, DAY_SELECTED2);
			dindex = null;
		}

		function cancelSelect() {
			DAY_SELECTED = null;
			DAY_SELECTED2 = null;
			//$('#year-calendar .day').removeClass('selected');
		
			$(document).off('mouseover', '#year-calendar .day', selectRangeOver);
			$(document).off('mouseout', '#year-calendar .day', selectRangeOut);
			/////////////////////////////
			// $(document).off('mouseover', '#year-calendar .day', selectRangeOver2);
			// $(document).off('mouseout', '#year-calendar .day', selectRangeOut2);
			////////////////////////////
			$('#year-calendar #selection').html('');
			$.isFunction(pl.options.range_unselect);
			pl.options.range_unselect();
			dindex = null;
		}


		//
		// Simple JS function to check if leap year
		Calendar.prototype.isLeap = function(year) {
			var leap = 0;
			leap = new Date(year, 1, 29).getMonth() == 1;
			return leap;
		}

		//
		// Method to return full date
		Calendar.prototype.returnFormattedDate = function(date) {
			var returned_date;
			var d = new Date(date);
			var da = d.getDay();

			if (da === 1) {
				returned_date = 'Monday';
			} else if (da === 2) {
				returned_date = 'Tuesday';
			} else if (da === 3) {
				returned_date = 'Wednesday';
			} else if (da === 4) {
				returned_date = 'Thursday';
			} else if (da === 5) {
				returned_date = 'Friday';
			} else if (da === 6) {
				returned_date = 'Saturday';
			} else if (da === 0) {
				returned_date = 'Sunday';
			}

			return returned_date;
		}

		//
		// Plugin Instantiation
		$.fn[pluginName] = function(options ) {
			return this.each(function() {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Calendar(this, options));
				}
			});
		}
	}

	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}
})();
