var app  = angular.module('grafico', []);

var tempoSP = [];
var tempoMinMax = [];
var dateUnit;
var data = [];
var dataRain = [];
var rainSP = [];
var windSP = [];


app.controller("GraficoController", function($scope, $http){
  var numero3h = String('3h');
  $http({
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/forecast?id=3448439&&units=metric&APPID=e1fb553dc53ab1192ceec845f83c6d1d'
  }).then(function successCallback(response) {
    console.log(response.data);
    for(var i = 0; i < 30; i++){
      tempoSP.push(response.data.list[i]);
      tempoMinMax.push([tempoSP[i].main.temp_min, (tempoSP[i].main.temp_max-0.5)]);
      dateUnit = new Date(tempoSP[i].dt_txt);
      data.push([dateUnit.getDate()+"/"+(dateUnit.getMonth()+1)+"/"+dateUnit.getFullYear()+"\n"+dateUnit.getHours()+"h"+"00m"]);
      if(tempoSP[i].rain != undefined){
        rainSP.push([tempoSP[i].rain]);
        dataRain.push([dateUnit.getDate()+"/"+(dateUnit.getMonth()+1)+"/"+dateUnit.getFullYear()+"\n"+dateUnit.getHours()+"h"+"00m"])
      }
      windSP.push([parseInt((tempoSP[i].wind.speed)*3.6)]);
    }
    console.log(rainSP);
    console.log(dataRain);
    var rainy = parseFloat((((rainSP[0][0]['3h']*100)/14.6).toFixed(1)));



    console.log(rainy);

    var myConfigTemperatura = {
      type: "range",
      backgroundColor : "#ffffff",
      title : {
        // text : "Variação da temperatura",
        backgroundColor : "#ffffff",
        fontColor : "#000"
      },
      legend : {
        layout : "x4",
        verticalAlign:'bottom',
        align:'center',
        shadow : 0,
        borderColor : "#fff",
        backgroundColor: '#e0e0e0'
      },
      plot : {
        aspect : "spline",
        marker : {
          visible : false
        },
        lineWidth : 0,
        alphaArea : 1,
        hoverState:{
          backgroundColor:'none'
        }
      },
      tooltip:{visible:false},
      scaleY : {
        label:{
          text:'Grau Celsius'
        },
        lineWidth : 1,
        tick : {
          lineWidth : "1"
        }
      },
      guide:{
        marker:{
          type:'triangle',
          size:1
        },
        plotLabel:{
          headerText:'%kt',
          text:'<span style="color:%color">%t</span><span style="color:%color"> Min: %node-min-value ºC  Max: %node-max-value ºC</span> ',
          fontSize:15,
          borderRadius:5,
          fontColor:'#FFF',
          backgroundColor:'#000'
        }
      },
      scaleX :{
        label:{
          text:'Período'
        },
        lineWidth : 1,
        tick : {
          placement : "outer",
          size : "10px",
          lineWidth : "1"
        },
        guide : {
          lineWidth : 1,
          lineStyle : "solid",
          alpha : 1
        },
        item : {
          offsetX : "0px",
          textAlign : "center"
        },
        labels : data
      },
      series : [
        {
          values : tempoMinMax,
          backgroundColor : "#0ce9d1",
          lineColor : "#0ce9d1",
          text:'São Paulo',
          textAlign: "center",

        }
      ]
    };

    console.log(myConfigTemperatura);

    zingchart.render({
      id : 'myChart-temperatura',
      data : myConfigTemperatura,
      height: '80%',
      width: '99.9%'
    });

    zingchart.render({
    id: 'myChart-alagamento',
    data: {
        type: "pie",
        labels : [
          {
            text : dataRain[0],
            x : "50%",
            y : "62%",
            anchor : "c",
            fontSize : "20px",
            fontColor : "#000",
            alpha : 0.7
          },
          {
            text: [rainy]+"%",
            y : "38%",
            textAlign : "center",
            //borderWidth : 1,
            //borderColor : "#000",
            offsetX : "0px",
            width : "100%",
            fontColor: "#000",
            fontSize: "60px",
            fontFamily : "Avenir"
          }
        ],
        backgroundColor: "#fff",
        borderRadius: 4,
        valueBox: {
            visible: true
        },
        plot: {
            slice: '50%',
            refAngle: 270,
            detach: false,
            hoverState: {visible: false},
            valueBox: {visible: false},
            animation:{
              effect:5,
              sequence:3
            },
            tooltip: {
                fontColor: "#000",
                rules: [{
                    rule: "%i == 0",
                    text: "%v Created",
                    shadow: false,
                    borderRadius: 4
                }, {
                    rule: "%i == 1",
                    text: "%v Left",
                    shadow: false,
                    borderRadius: 4
                }]
            }
        },
        plotarea: {
            margin: "dynamic",
        },
        series: [{
            values: [rainy],
            "gradient-colors" : "#fff #fff #ff9b99 #f24c4c" ,
            "gradient-stops" : "0.2 0.5 0.5",
            fillType : "radial",
            borderWidth: "0px",
            shadow: 0,
            backgroundColor:'#000'
        }, {
            values: [100 - rainy],
            backgroundColor: "#000",
            //"gradient-colors" : "#000000 #FFFFFF",
            //"gradient-stops" : "0.9 0.4",
            slice: 155,
            //alpha: "0.5",
            borderWidth: "1px",
            shadow: 0,
            valueBox: {
                visible: false
            }
        }]

    },
    height:"500",
    width : "450"
  });

    var myConfigVento = {
      backgroundColor:'none',
     	type: "gauge",
     	plot: {
     	  arperture:180,
     	  csize:4,
     	  backgroundColor:'none',
     	  tooltip:{
     	    visible: false
     	  }
     	},
     	plotarea: {
     	  backgroundColor: 'none',
     	  borderWidth: 0,
     	  margin: "100 0 0 0"
     	},
     	scaleR: {
        minValue:0,
        maxValue:100,
        step:10,
     	  aperture:180,
    	  backgroundColor:'none',
     	  item: {
     	    padding: 5,
     	    fontColor : "#1E5D9E",
     	    fontFamily: 'Montserrat',
          offsetR:0
     	  },
     	  tick: {
     	    lineColor: '#D1D3D4',
     	    placement:'out',
    	    lineColor:'#1E5D9E'
     	  },
     	  center:{
     	    size:0,
     	    borderColor:'none',
     	    backgroundColor:'none'
     	  },
     	  ring:{
     	    size:3,
     	    rules:[
     	      {
     	        rule:'%v < 20',
     	        backgroundColor:'#00BAF2'
     	      },
     	      {
     	        rule:'%v >= 20 && %v < 40',
     	        backgroundColor:'#1E5D9E'
     	      },
     	      {
     	        rule:'%v >= 40 && %v < 60',
     	        backgroundColor:'#9B26AF'
     	      },
     	      {
     	        rule:'%v >= 60',
     	        backgroundColor:'#E80C60'
     	      }
     	    ]
     	  }
     	},
    	series : [
    		{
    		  text: "Internal",
    			values : windSP[12],
    			lineColor: "#00BAF2",
    			backgroundColor: "#1E5D9E",
    		},

    	]
    };

    zingchart.render({
    	id : 'myChart-vento',
      data:myConfigVento,
    	height: 400,
    	width: '100%'
    });
  },
  function errorCallback(response) {
    console.log(response);

  });
});
