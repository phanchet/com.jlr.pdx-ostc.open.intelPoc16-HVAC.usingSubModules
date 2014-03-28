/*
 * Copyright (c) 2013, Intel Corporation, Jaguar Land Rover
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/*global Bootstrap, hvacControler*/
var debug = false;

/**
 * Heat, Ventilation and Air Conditioning provides UI controls to operate this subystem of the car from 
 * [tizen.vehicle API](https://raw.github.com/otcshare/automotive-message-broker/master/docs/amb.idl).
 * Uses mainly {{#crossLink "CarIndicator"}}{{/crossLink}} module from {{#crossLink "Bootstrap/carIndicator:property"}}{{/crossLink}}.
 *
 * Application directly controls following AMB properties:
 *
 * * WindowStatus
 *   * FrontDefrost
 *   * RearDefrost
 * * HVAC
 *   * FanSpeed
 *   * TargetTemperatureRight
 *   * TargetTemperatureLeft
 *   * SeatHeaterRight
 *   * SeatHeaterLeft
 *   * AirConditioning
 *   * AirRecirculation
 *   * AirflowDirection
 * * LightStatus
 *   * Hazard
 * * DirectionIndicationINST
 * * DirectionIndicationMS
 * * ACCommand
 * * RecircReq
 * * FrontTSetRightCmd
 * * FrontTSetLeftCmd
 * * FrontBlwrSpeedCmd
 * * HeatedSeatFRModeRequest
 * * HeatedSeatFRRequest
 * * HeatedSeatFLModeRequest
 * * HeatedSeatFLRequest
 * * FLHSDistrCmd
 * * FRHSDistrCmd
 *
 * Additionaly HVAC application implements following scenarios:
 *
 * * Automatic AC mode - Sets Fan Speed to zero, Airflow direction to OFF, Air recirculation to off and both target temperatures to 22 degrees. 
 * Turning off Automatic AC mode will set all properties to their previous values. If any of properties are set separately Automatic AC mode is 
 * turned off.
 * * Max defrost mode - Maximum defrost mode sets Fan speed to maximum value, Airflow direction to Screen and resets Left target temperature 
 * within range 16 to 28 degrees. If any of properties are set separately Max defrost mode is turned off. 
 *
 * Hover and click on elements in images below to navigate to components of HVAC application.
 *
 * <img id="Image-Maps_1201312180420487" src="../assets/img/hvac.png" usemap="#Image-Maps_1201312180420487" border="0" width="649" height="1152" alt="" />
 *   <map id="_Image-Maps_1201312180420487" name="Image-Maps_1201312180420487">
 *     <area shape="rect" coords="0,0,573,78" href="../classes/TopBarIcons.html" alt="Top bar icons" title="Top bar icons" />
 *     <area shape="rect" coords="0,994,644,1147" href="../classes/BottomPanel.html" alt="bottom panel" title="Bottom panel" />
 *     <area shape="rect" coords="573,1,644,76" href="../modules/Settings.html" alt="Settings" title="Settings" />
 *     <area  shape="rect" coords="138,103,513,176" alt="Hazard button" title="Hazard button" target="_self" href="../classes/hvacControler.html#method_onHazardChanged"     >
 *     <area  shape="rect" coords="13,197,99,653" alt="Left target temperature" title="Left target temperature" target="_self" href="../classes/hvacControler.html#method_onTargetTemperatureLeftChanged"     >
 *     <area  shape="rect" coords="551,194,637,650" alt="Right target temperature" title="Right target temperature" target="_self" href="../classes/hvacControler.html#method_onTargetTemperatureRightChanged"     >
 *     <area  shape="rect" coords="369,403,512,612" alt="Right target temperature indicator" title="Right target temperature indicator" target="_self" href="../classes/hvacControler.html#method_onTargetTemperatureRightChanged"     >
 *     <area  shape="rect" coords="135,404,278,614" alt="Left target temperature indicator" title="Left target temperature indicator" target="_self" href="../classes/hvacControler.html#method_onTargetTemperatureLeftChanged"     >
 *     <area  shape="rect" coords="137,252,278,368" alt="Left seat heater" title="Left seat heater" target="_self" href="../classes/hvacControler.html#method_onSeatHeaterLeftChanged"     >
 *     <area  shape="rect" coords="370,252,511,368" alt="Right seat heater" title="Right seat heater" target="_self" href="../classes/hvacControler.html#method_onSeatHeaterRightChanged"     >
 *     <area  shape="rect" coords="391,780,491,860" alt="Air recirculation" title="Air recirculation" target="_self" href="../classes/hvacControler.html#method_onAirRecirculationChanged"     >
 *     <area  shape="rect" coords="157,780,257,860" alt="Fan status" title="Fan status" target="_self" href="../classes/hvacControler.html#method_onFanChanged"     >
 *     <area  shape="rect" coords="273,781,373,861" alt="Automatic AC mode" title="Automatic AC mode" target="_self" href="../classes/HVAC.html"     >
 *     <area  shape="rect" coords="151,653,498,764" alt="Fan speed" title="Fan speed" target="_self" href="../classes/hvacControler.html#method_onFanSpeedChanged"     >
 *     <area  shape="rect" coords="17,672,135,961" alt="Airflow direction" title="Airflow direction" target="_self" href="../classes/hvacControler.html#method_onAirflowDirectionChanged"     >
 *     <area  shape="rect" coords="516,781,626,859" alt="Rear defrost" title="Rear defrost" target="_self" href="../classes/hvacControler.html#method_onRearDefrostChanged"     >
 *     <area  shape="rect" coords="518,876,627,956" alt="Front defrost" title="Front defrost" target="_self" href="../classes/hvacControler.html#method_onFrontDefrostChanged"     >
 *     <area  shape="rect" coords="515,676,627,764" alt="Max defrost mode" title="Max defrost mode" target="_self" href="../classes/HVAC.html"     >
 *     <area shape="rect" coords="646,1150,648,1152" alt="Image Map" title="Image Map" href="http://www.image-maps.com/index.php?aff=mapped_users_0" >
 *  </map>
 * </img>
 *
 * @module HVACApplication
 * @main HVACApplication
 * @class HVAC
 **/

/**
 * Reference to instance of bootstrap class.
 * @property bootstrap {Bootstrap}
 */
var bootstrap;

/**
 * Initializes plugins and register events for HVAC app.
 * @method init
 * @static
 **/
var init = function() {
	"use strict";
	var hvacIndicator = new hvacControler();
	bootstrap = new Bootstrap(function(status) {
		$("#topBarIcons").topBarIconsPlugin('init');
		$('#bottomPanel').bottomPanel('init');

		$(".noUiSliderLeft").noUiSlider({
			range : [ 0, 14 ],
			step : 1,
			start : 14,
			handles : 1,
			connect : "upper",
			orientation : "vertical",
			slide : function() {
				if ($("#defrost_max_btn").hasClass("on")) {
					switch ($(this).val()) {
					case 0:
						$(this).val(1);
						break;
					case 14:
						$(this).val(13);
						break;
					}
				}
				// -- This is about updating the indicator and I wonder if it's the right way to do it...
				bootstrap.carIndicator.setStatus("targetTemperatureLeft", ($(this).val() + 29) - ($(this).val() * 2));
				// -- This is setting the can bus hardware and is the correct name for the T5 plugins...
				bootstrap.carIndicator.setStatus("FrontTSetLeftCmd", ($(this).val() + 29) - ($(this).val() * 2));
			}
		});

		$(".noUiSliderRight").noUiSlider({
			range : [ 0, 14 ],
			step : 1,
			start : 14,
			handles : 1,
			connect : "upper",
			orientation : "vertical",
			slide : function() {
				bootstrap.carIndicator.setStatus("targetTemperatureRight", ($(this).val() + 29) - ($(this).val() * 2));
				bootstrap.carIndicator.setStatus("FrontTSetRightCmd", ($(this).val() + 29) - ($(this).val() * 2));
			}
		});

		$(".noUiSliderFan").noUiSlider({
			range : [ 0, 7 ],   // Even though this is defined as 4 bits the car does 0..7
			step : 1,
			start : 0,
			handles : 1,
			connect : "upper",
			orientation : "horizontal",
			slide : function() {
				bootstrap.carIndicator.setStatus("fanSpeed", $(this).val());
				bootstrap.carIndicator.setStatus("FrontBlwrSpeedCmd", ($(this).val()));
			}
		});

		bootstrap.carIndicator.addListener({
			onAirRecirculationChanged : function(newValue) {
				hvacIndicator.onAirRecirculationChanged(newValue);
			},
			onFanChanged : function(newValue) {
				hvacIndicator.onFanChanged(newValue);
			},
			onFanSpeedChanged : function(newValue) {
				hvacIndicator.onFanSpeedChanged(newValue);
			},
			onTargetTemperatureRightChanged : function(newValue) {
				hvacIndicator.onTargetTemperatureRightChanged(newValue);
			},
			onTargetTemperatureLeftChanged : function(newValue) {
				hvacIndicator.onTargetTemperatureLeftChanged(newValue);
			},
			onHazardChanged : function(newValue) {
				hvacIndicator.onHazardChanged(newValue);
			},
			onSeatHeaterRightChanged : function(newValue) {
				hvacIndicator.onSeatHeaterRightChanged(newValue);
			},
			onSeatHeaterLeftChanged : function(newValue) {
				hvacIndicator.onSeatHeaterLeftChanged(newValue);
			},
			onAirflowDirectionChanged : function(newValue) {
				hvacIndicator.onAirflowDirectionChanged(newValue);
			},
			onFrontDefrostChanged : function(newValue) {
				hvacIndicator.onFrontDefrostChanged(newValue);
			},
			onRearDefrostChanged : function(newValue) {
				hvacIndicator.onRearDefrostChanged(newValue);
			}
		});
	});
};

/**
 * Calls initialization fuction after document is loaded.
 * @method $(document).ready
 * @param init {function} Callback function for initialize Homescreen.
 * @static
 **/
$(function() {
	"use strict";
	// debug mode -
	if (!debug) {
		init()
	} else {
		window.setTimeout("init()", 20000);
	}
});