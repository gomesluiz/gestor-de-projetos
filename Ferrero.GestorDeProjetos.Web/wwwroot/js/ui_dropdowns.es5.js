"use strict";

$(function () {
  if ($('html').attr('dir') === 'rtl') {
    $('#hover-dropdown-demo .dropdown-menu').addClass('dropdown-menu-right');
    $('#nesting-dropdown-demo > .dropdown-menu').addClass('dropdown-menu-right');
    $('#btn-dropdown-demo .dropdown-menu').addClass('dropdown-menu-right');
  }
}); // Bootstrap menu

$(function () {
  var isRtl = $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl';
  new BootstrapMenu('#bs-menu-example', {
    menuPosition: isRtl ? 'belowRight' : 'belowLeft',
    actionsGroups: [['actionName', 'anotherActionName'], ['thirdActionName']],
    actions: {
      actionName: {
        name: 'Action',
        onClick: function onClick() {
          toastr.info("'Action' clicked!");
        }
      },
      anotherActionName: {
        name: 'Another action',
        iconClass: 'ion ion-md-create',
        onClick: function onClick() {
          toastr.info("'Another action' clicked!");
        }
      },
      thirdActionName: {
        name: 'A third action',
        iconClass: 'ion ion-md-unlock',
        onClick: function onClick() {
          toastr.info("'A third action' clicked!");
        }
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3VpX2Ryb3Bkb3ducy5qcyJdLCJuYW1lcyI6WyIkIiwiYXR0ciIsImFkZENsYXNzIiwiaXNSdGwiLCJCb290c3RyYXBNZW51IiwibWVudVBvc2l0aW9uIiwiYWN0aW9uc0dyb3VwcyIsImFjdGlvbnMiLCJhY3Rpb25OYW1lIiwibmFtZSIsIm9uQ2xpY2siLCJ0b2FzdHIiLCJpbmZvIiwiYW5vdGhlckFjdGlvbk5hbWUiLCJpY29uQ2xhc3MiLCJ0aGlyZEFjdGlvbk5hbWUiXSwibWFwcGluZ3MiOiI7O0FBQUFBLENBQUMsQ0FBQyxZQUFXO0FBQ1gsTUFBSUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVQyxJQUFWLENBQWUsS0FBZixNQUEwQixLQUE5QixFQUFxQztBQUNuQ0QsSUFBQUEsQ0FBQyxDQUFDLHFDQUFELENBQUQsQ0FBeUNFLFFBQXpDLENBQWtELHFCQUFsRDtBQUNBRixJQUFBQSxDQUFDLENBQUMseUNBQUQsQ0FBRCxDQUE2Q0UsUUFBN0MsQ0FBc0QscUJBQXREO0FBQ0FGLElBQUFBLENBQUMsQ0FBQyxtQ0FBRCxDQUFELENBQXVDRSxRQUF2QyxDQUFnRCxxQkFBaEQ7QUFDRDtBQUNGLENBTkEsQ0FBRCxDLENBUUE7O0FBQ0FGLENBQUMsQ0FBQyxZQUFXO0FBQ1gsTUFBSUcsS0FBSyxHQUFHSCxDQUFDLENBQUMsTUFBRCxDQUFELENBQVVDLElBQVYsQ0FBZSxLQUFmLE1BQTBCLEtBQTFCLElBQW1DRCxDQUFDLENBQUMsTUFBRCxDQUFELENBQVVDLElBQVYsQ0FBZSxLQUFmLE1BQTBCLEtBQXpFO0FBRUEsTUFBSUcsYUFBSixDQUFrQixrQkFBbEIsRUFBc0M7QUFDcENDLElBQUFBLFlBQVksRUFBRUYsS0FBSyxHQUFHLFlBQUgsR0FBa0IsV0FERDtBQUVwQ0csSUFBQUEsYUFBYSxFQUFFLENBQ2IsQ0FBQyxZQUFELEVBQWUsbUJBQWYsQ0FEYSxFQUViLENBQUMsaUJBQUQsQ0FGYSxDQUZxQjtBQU1wQ0MsSUFBQUEsT0FBTyxFQUFFO0FBQ1BDLE1BQUFBLFVBQVUsRUFBRTtBQUNWQyxRQUFBQSxJQUFJLEVBQUUsUUFESTtBQUVWQyxRQUFBQSxPQUFPLEVBQUUsbUJBQVc7QUFDbEJDLFVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaO0FBQ0Q7QUFKUyxPQURMO0FBT1BDLE1BQUFBLGlCQUFpQixFQUFFO0FBQ2pCSixRQUFBQSxJQUFJLEVBQUUsZ0JBRFc7QUFFakJLLFFBQUFBLFNBQVMsRUFBRSxtQkFGTTtBQUdqQkosUUFBQUEsT0FBTyxFQUFFLG1CQUFXO0FBQ2xCQyxVQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQkFBWjtBQUNEO0FBTGdCLE9BUFo7QUFjUEcsTUFBQUEsZUFBZSxFQUFFO0FBQ2ZOLFFBQUFBLElBQUksRUFBRSxnQkFEUztBQUVmSyxRQUFBQSxTQUFTLEVBQUUsbUJBRkk7QUFHZkosUUFBQUEsT0FBTyxFQUFFLG1CQUFXO0FBQ2xCQyxVQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQkFBWjtBQUNEO0FBTGM7QUFkVjtBQU4yQixHQUF0QztBQTZCRCxDQWhDQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpIHtcbiAgaWYgKCQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCcpIHtcbiAgICAkKCcjaG92ZXItZHJvcGRvd24tZGVtbyAuZHJvcGRvd24tbWVudScpLmFkZENsYXNzKCdkcm9wZG93bi1tZW51LXJpZ2h0Jyk7XG4gICAgJCgnI25lc3RpbmctZHJvcGRvd24tZGVtbyA+IC5kcm9wZG93bi1tZW51JykuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnKTtcbiAgICAkKCcjYnRuLWRyb3Bkb3duLWRlbW8gLmRyb3Bkb3duLW1lbnUnKS5hZGRDbGFzcygnZHJvcGRvd24tbWVudS1yaWdodCcpO1xuICB9XG59KTtcblxuLy8gQm9vdHN0cmFwIG1lbnVcbiQoZnVuY3Rpb24oKSB7XG4gIHZhciBpc1J0bCA9ICQoJ2JvZHknKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCcgfHwgJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09PSAncnRsJztcblxuICBuZXcgQm9vdHN0cmFwTWVudSgnI2JzLW1lbnUtZXhhbXBsZScsIHtcbiAgICBtZW51UG9zaXRpb246IGlzUnRsID8gJ2JlbG93UmlnaHQnIDogJ2JlbG93TGVmdCcsXG4gICAgYWN0aW9uc0dyb3VwczogW1xuICAgICAgWydhY3Rpb25OYW1lJywgJ2Fub3RoZXJBY3Rpb25OYW1lJyBdLFxuICAgICAgWyd0aGlyZEFjdGlvbk5hbWUnXVxuICAgIF0sXG4gICAgYWN0aW9uczoge1xuICAgICAgYWN0aW9uTmFtZToge1xuICAgICAgICBuYW1lOiAnQWN0aW9uJyxcbiAgICAgICAgb25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdG9hc3RyLmluZm8oXCInQWN0aW9uJyBjbGlja2VkIVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGFub3RoZXJBY3Rpb25OYW1lOiB7XG4gICAgICAgIG5hbWU6ICdBbm90aGVyIGFjdGlvbicsXG4gICAgICAgIGljb25DbGFzczogJ2lvbiBpb24tbWQtY3JlYXRlJyxcbiAgICAgICAgb25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdG9hc3RyLmluZm8oXCInQW5vdGhlciBhY3Rpb24nIGNsaWNrZWQhXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpcmRBY3Rpb25OYW1lOiB7XG4gICAgICAgIG5hbWU6ICdBIHRoaXJkIGFjdGlvbicsXG4gICAgICAgIGljb25DbGFzczogJ2lvbiBpb24tbWQtdW5sb2NrJyxcbiAgICAgICAgb25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdG9hc3RyLmluZm8oXCInQSB0aGlyZCBhY3Rpb24nIGNsaWNrZWQhXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuIl0sImZpbGUiOiJqcy91aV9kcm9wZG93bnMuZXM1LmpzIn0=
