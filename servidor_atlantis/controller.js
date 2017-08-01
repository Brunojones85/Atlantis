var app  = angular.module('grafico', []);

var tempoSP = [];
var tempoMinMax = [];
var dateUnit, dateTransform;
var data = [];

app.controller("GraficoController", function($scope, $http){
  $http({
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/forecast?id=3448439&&units=metric&APPID=e1fb553dc53ab1192ceec845f83c6d1d'
  }).then(function successCallback(response) {
    console.log(response.data);
    for(var i = 0; i < 30; i++){
      tempoSP.push(response.data.list[i]);
      tempoMinMax.push([tempoSP[i].main.temp_min, (tempoSP[i].main.temp_max-1)]);
      dateUnit = new Date(tempoSP[i].dt_txt);
      data.push([dateUnit.getDate()+"/"+(dateUnit.getMonth()+1)+"/"+dateUnit.getFullYear()]);
    }

    var myConfig = {
      type: "range",
      backgroundColor : "#ffffff",
      title : {
        text : "Variação da temperatura",
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
          text:'<span style="color:%color">%t</span><span style="color:%color"> Min: %node-min-value  Max: %node-max-value</span> ',
          fontSize:15,
          borderRadius:5,
          fontColor:'#FFF',
          backgroundColor:'#000'
        }
      },
      scaleX :{
        label:{
          text:'Dia/Mes/Ano'
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
          text:'São Paulo'
        },
      ]
    };

    console.log(myConfig);

    zingchart.render({
      id : 'myChart',
      data : myConfig,
      height: '80%',
      width: '99.9%'
    });
  },
  function errorCallback(response) {
    console.log(response);

  });
});
