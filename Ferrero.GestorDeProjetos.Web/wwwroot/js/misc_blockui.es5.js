"use strict";

$(function () {
  $('#block-ui-block-page').click(function () {
    $.blockUI({
      message: '<div class="sk-folding-cube sk-primary"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div><h5 style="color: #444">LOADING...</h5>',
      css: {
        backgroundColor: 'transparent',
        border: '0',
        zIndex: 9999999
      },
      overlayCSS: {
        backgroundColor: '#fff',
        opacity: 0.8,
        zIndex: 9999990
      }
    });
    setTimeout(function () {
      $.unblockUI();
    }, 5000);
  });
  $('#block-ui-block-element').click(function () {
    $('#block-ui-element-example').block({
      message: '<div class="sk-wave sk-primary"><div class="sk-rect sk-rect1"></div> <div class="sk-rect sk-rect2"></div> <div class="sk-rect sk-rect3"></div> <div class="sk-rect sk-rect4"></div> <div class="sk-rect sk-rect5"></div></div>',
      css: {
        backgroundColor: 'transparent',
        border: '0'
      },
      overlayCSS: {
        backgroundColor: '#fff',
        opacity: 0.8
      }
    });
  });
  $('#block-ui-unblock-element').click(function () {
    $('#block-ui-element-example').unblock();
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL21pc2NfYmxvY2t1aS5qcyJdLCJuYW1lcyI6WyIkIiwiY2xpY2siLCJibG9ja1VJIiwibWVzc2FnZSIsImNzcyIsImJhY2tncm91bmRDb2xvciIsImJvcmRlciIsInpJbmRleCIsIm92ZXJsYXlDU1MiLCJvcGFjaXR5Iiwic2V0VGltZW91dCIsInVuYmxvY2tVSSIsImJsb2NrIiwidW5ibG9jayJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsQ0FBQyxDQUFDLFlBQVc7QUFDWEEsRUFBQUEsQ0FBQyxDQUFDLHNCQUFELENBQUQsQ0FBMEJDLEtBQTFCLENBQWdDLFlBQVc7QUFDekNELElBQUFBLENBQUMsQ0FBQ0UsT0FBRixDQUFVO0FBQ1JDLE1BQUFBLE9BQU8sRUFBRSx1T0FERDtBQUVSQyxNQUFBQSxHQUFHLEVBQUU7QUFDSEMsUUFBQUEsZUFBZSxFQUFFLGFBRGQ7QUFFSEMsUUFBQUEsTUFBTSxFQUFFLEdBRkw7QUFHSEMsUUFBQUEsTUFBTSxFQUFFO0FBSEwsT0FGRztBQU9SQyxNQUFBQSxVQUFVLEVBQUc7QUFDWEgsUUFBQUEsZUFBZSxFQUFFLE1BRE47QUFFWEksUUFBQUEsT0FBTyxFQUFFLEdBRkU7QUFHWEYsUUFBQUEsTUFBTSxFQUFFO0FBSEc7QUFQTCxLQUFWO0FBY0FHLElBQUFBLFVBQVUsQ0FBQyxZQUFXO0FBQ3BCVixNQUFBQSxDQUFDLENBQUNXLFNBQUY7QUFDRCxLQUZTLEVBRVAsSUFGTyxDQUFWO0FBR0QsR0FsQkQ7QUFvQkFYLEVBQUFBLENBQUMsQ0FBQyx5QkFBRCxDQUFELENBQTZCQyxLQUE3QixDQUFtQyxZQUFXO0FBQzVDRCxJQUFBQSxDQUFDLENBQUMsMkJBQUQsQ0FBRCxDQUErQlksS0FBL0IsQ0FBcUM7QUFDbkNULE1BQUFBLE9BQU8sRUFBRSxnT0FEMEI7QUFFbkNDLE1BQUFBLEdBQUcsRUFBRTtBQUNIQyxRQUFBQSxlQUFlLEVBQUUsYUFEZDtBQUVIQyxRQUFBQSxNQUFNLEVBQUU7QUFGTCxPQUY4QjtBQU1uQ0UsTUFBQUEsVUFBVSxFQUFHO0FBQ1hILFFBQUFBLGVBQWUsRUFBRSxNQUROO0FBRVhJLFFBQUFBLE9BQU8sRUFBRTtBQUZFO0FBTnNCLEtBQXJDO0FBV0QsR0FaRDtBQWNBVCxFQUFBQSxDQUFDLENBQUMsMkJBQUQsQ0FBRCxDQUErQkMsS0FBL0IsQ0FBcUMsWUFBVztBQUM5Q0QsSUFBQUEsQ0FBQyxDQUFDLDJCQUFELENBQUQsQ0FBK0JhLE9BQS9CO0FBQ0QsR0FGRDtBQUdELENBdENBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuICAkKCcjYmxvY2stdWktYmxvY2stcGFnZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQuYmxvY2tVSSh7XG4gICAgICBtZXNzYWdlOiAnPGRpdiBjbGFzcz1cInNrLWZvbGRpbmctY3ViZSBzay1wcmltYXJ5XCI+PGRpdiBjbGFzcz1cInNrLWN1YmUxIHNrLWN1YmVcIj48L2Rpdj48ZGl2IGNsYXNzPVwic2stY3ViZTIgc2stY3ViZVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJzay1jdWJlNCBzay1jdWJlXCI+PC9kaXY+PGRpdiBjbGFzcz1cInNrLWN1YmUzIHNrLWN1YmVcIj48L2Rpdj48L2Rpdj48aDUgc3R5bGU9XCJjb2xvcjogIzQ0NFwiPkxPQURJTkcuLi48L2g1PicsXG4gICAgICBjc3M6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBib3JkZXI6ICcwJyxcbiAgICAgICAgekluZGV4OiA5OTk5OTk5XG4gICAgICB9LFxuICAgICAgb3ZlcmxheUNTUzogIHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgICAgIG9wYWNpdHk6IDAuOCxcbiAgICAgICAgekluZGV4OiA5OTk5OTkwXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgJC51bmJsb2NrVUkoKTtcbiAgICB9LCA1MDAwKTtcbiAgfSk7XG5cbiAgJCgnI2Jsb2NrLXVpLWJsb2NrLWVsZW1lbnQnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAkKCcjYmxvY2stdWktZWxlbWVudC1leGFtcGxlJykuYmxvY2soe1xuICAgICAgbWVzc2FnZTogJzxkaXYgY2xhc3M9XCJzay13YXZlIHNrLXByaW1hcnlcIj48ZGl2IGNsYXNzPVwic2stcmVjdCBzay1yZWN0MVwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwic2stcmVjdCBzay1yZWN0MlwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwic2stcmVjdCBzay1yZWN0M1wiPjwvZGl2PiA8ZGl2IGNsYXNzPVwic2stcmVjdCBzay1yZWN0NFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwic2stcmVjdCBzay1yZWN0NVwiPjwvZGl2PjwvZGl2PicsXG4gICAgICBjc3M6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBib3JkZXI6ICcwJ1xuICAgICAgfSxcbiAgICAgIG92ZXJsYXlDU1M6ICB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgICAgICBvcGFjaXR5OiAwLjhcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJCgnI2Jsb2NrLXVpLXVuYmxvY2stZWxlbWVudCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQoJyNibG9jay11aS1lbGVtZW50LWV4YW1wbGUnKS51bmJsb2NrKCk7XG4gIH0pO1xufSk7XG4iXSwiZmlsZSI6ImpzL21pc2NfYmxvY2t1aS5lczUuanMifQ==
